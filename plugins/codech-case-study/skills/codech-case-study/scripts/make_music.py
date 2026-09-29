#!/usr/bin/env python3
"""Compose an original, royalty-free background track for a case-study film.

    python make_music.py <out.wav> --duration 71.5 [--style ambient] [--marks 3.6,15.2,...] [--outro 66.3] [--bpm N] [--seed 7]

Styles (all synthesised from scratch with numpy, so there is nothing to license):
  ambient    calm "ambient tech" bed in C major: detuned pad, sub bass, soft plucked arpeggio, light pulse (default)
  bright     upbeat product-launch feel in D major: steady four-on-the-floor, clap, eighth-note bass, bright plucks
  cinematic  slow and wide in D minor: long swelling pads, sparse piano notes, low booms on chapter changes, riser into the outro
  lofi       warm lo-fi in F: electric-piano chords, swung hats, soft kick/snare, vinyl crackle, rolled-off highs
  drive      energetic future-house in A minor, 124 bpm: pumping supersaw chords, offbeat bass, four-on-the-floor,
             16th hats and plucks; builds (snare roll + riser) into every chapter change and drops on it
Every style: a bell at each chapter change (--marks, seconds), rhythm only between the first scene and the outro,
fade in/out, and a quiet level (peak about -6 dBFS) that sits under captions without a melody competing with reading.
record_film.py calls this automatically with the film's real chapter times (film.music_style in case.json, or --music-style).
"""
import argparse, wave
import numpy as np

SR = 44100

def midi(n): return 440.0 * 2 ** ((n - 69) / 12)

def env_adsr(n, a, r, sus=1.0):
    e = np.ones(n) * sus
    ai = min(n, int(a * SR)); ri = min(n - ai, int(r * SR))
    if ai: e[:ai] = np.linspace(0, sus, ai)
    if ri: e[n - ri:] *= np.linspace(1, 0, ri)
    return e

def lowpass(x, cutoff):
    # one-pole low-pass, applied twice for a softer slope
    a = np.exp(-2 * np.pi * cutoff / SR)
    for _ in range(2):
        y = np.empty_like(x); acc = 0.0
        for i in range(len(x)):
            acc = (1 - a) * x[i] + a * acc; y[i] = acc
        x = y
    return x

def pad_voice(freq, n, rng):
    t = np.arange(n) / SR
    out = np.zeros(n)
    for det in (-0.12, 0.0, 0.11):          # three detuned saws (in semitones)
        f = freq * 2 ** (det / 12)
        ph = rng.random()
        out += 2 * ((t * f + ph) % 1.0) - 1
    return out / 3

def noise_hit(rng, n, lo, hi, decay):
    x = lowpass(rng.standard_normal(n), hi) - lowpass(rng.standard_normal(n), lo)
    return x * np.exp(-np.arange(n) / SR * decay)

def kick_hit(n):
    kt = np.arange(n) / SR
    return np.sin(2 * np.pi * (48 * kt + 40 * (1 - np.exp(-kt * 30)) / 30)) * np.exp(-kt * 9)

def epiano(freq, n):
    t = np.arange(n) / SR
    tone = (np.sin(2 * np.pi * freq * t) + .25 * np.sin(4 * np.pi * freq * t) * np.exp(-t * 6)
            + .08 * np.sin(2 * np.pi * 7.02 * freq * t) * np.exp(-t * 14))
    return tone * np.exp(-t * 1.1) * (1 + .12 * np.sin(2 * np.pi * 4.5 * t))

# prog: (bass root, chord notes), two bars each
STYLES = {
    "ambient": dict(bpm=92, prog=[(36, [48, 55, 59, 62, 64]), (45, [45, 52, 55, 59, 60]), (41, [41, 48, 52, 55, 57]), (43, [43, 50, 55, 57, 59])],
                    pad="saw", pad_cut=900, pad_lvl=.30, pad_att=1.4, bass="sustain", arp=.07, drums="soft", bell=84),
    "bright": dict(bpm=112, prog=[(38, [50, 54, 57, 62, 64]), (45, [45, 52, 57, 61, 64]), (47, [47, 54, 59, 62, 66]), (43, [43, 50, 55, 59, 62])],
                   pad="saw", pad_cut=1900, pad_lvl=.20, pad_att=.6, bass="eighth", arp=.085, drums="four", bell=86),
    "cinematic": dict(bpm=70, prog=[(38, [50, 53, 57, 62, 64]), (34, [46, 50, 53, 57, 62]), (41, [41, 48, 53, 57, 60]), (36, [48, 52, 55, 60, 62])],
                      pad="saw", pad_cut=1300, pad_lvl=.36, pad_att=2.6, bass="sustain", arp=.09, drums="none", bell=81,
                      piano=True, booms=True, riser=True),
    "lofi": dict(bpm=82, prog=[(41, [53, 57, 60, 64, 67]), (38, [50, 53, 57, 60, 64]), (46, [46, 50, 53, 57, 60]), (36, [48, 52, 55, 58, 62])],
                 pad="epiano", pad_cut=0, pad_lvl=.34, pad_att=0, bass="lofi", arp=0, drums="lofi", bell=84,
                 crackle=True, swing=.30, master_cut=5200),
    # energetic: everything comes from drive_layer(); the shared loop only adds the chapter bells
    "drive": dict(bpm=124, prog=[(45, [57])] * 4, pad="none", pad_lvl=0, bass="none", arp=0, drums="none", bell=88, bell_lvl=.03, drive=True, sat=3.0, peak=.68),
}

def drive_layer(rng, D, N, beat, first, outro, marks):
    """Future-house bed in A minor: side-chain-pumped supersaw chords (filter opens on the drop at the
    first scene), offbeat saw bass, four-on-the-floor kick, clap, 16th hats, a plucked 16th arpeggio,
    and a snare roll + riser into every chapter change with a crash on the downbeat."""
    L = np.zeros(N); R = np.zeros(N)
    def put(s, sig, gl, gr=None):
        if s < 0 or s >= N: return
        e = min(N, s + len(sig)) - s
        L[s:s + e] += gl * sig[:e]; R[s:s + e] += (gl if gr is None else gr) * sig[:e]
    prog = [(45, [57, 60, 64, 67, 71]), (41, [53, 57, 60, 64, 67]), (36, [55, 60, 64, 67, 72]), (43, [55, 59, 62, 67, 69])]
    bar = 4 * beat; clen = 2 * bar
    t = np.arange(N) / SR
    pump = np.where((t >= first) & (t < outro), 1 - 0.7 * np.exp(-((t - first) % beat) * 10), 1.0)
    PL = np.zeros(N); PR = np.zeros(N)
    k = 0; t0 = 0.0
    while t0 < D:
        root, notes = prog[k % 4]; n = int(min(clen + .8, D - t0) * SR); s = int(t0 * SR)
        if n <= 0: break
        tt = np.arange(n) / SR
        sl = np.zeros(n); sr = np.zeros(n)
        for m in notes:
            for j, det in enumerate((-.18, -.09, 0, .09, .18)):
                w = 2 * ((tt * midi(m) * 2 ** (det / 12) + rng.random()) % 1) - 1
                if j % 2: sl += w
                else: sr += w
        cut = 900 if t0 + clen <= first or t0 >= outro else 3200
        env = env_adsr(n, .05, .6, 1.0)
        for buf, x in ((PL, sl), (PR, sr)):
            e = min(N, s + n) - s; buf[s:s + e] += .30 * (lowpass(x / (len(notes) * 3), cut) * env)[:e]
        bn = int(beat * .45 * SR); x = np.arange(bn) / SR; f = midi(root)
        bass = .8 * lowpass((2 * ((x * f) % 1) - 1) * np.exp(-x * 5), 700) + np.sin(2 * np.pi * f * x) * np.exp(-x * 4)
        for q in range(8):
            bt = t0 + q * beat + beat / 2
            if first <= bt < outro:
                bs = int(bt * SR); e = min(N, bs + bn) - bs
                if e > 0: PL[bs:bs + e] += .22 * bass[:e]; PR[bs:bs + e] += .22 * bass[:e]
        k += 1; t0 += clen
    L += PL * pump; R += PR * pump
    kick = kick_hit(int(.4 * SR)); nxt_marks = [m for m in marks if m > first + 1] + [outro]
    st = beat / 4; i = 0; tt0 = first
    while tt0 < outro - .05:
        s = int(tt0 * SR); pos = i % 16
        if pos % 4 == 0: put(s, kick, .30)
        if pos in (4, 12): put(s, noise_hit(rng, int(.2 * SR), 1200, 6000, 20), .14)
        op = pos % 4 == 2
        put(s, noise_hit(rng, int((.12 if op else .04) * SR), 5000, 11000, 18 if op else 80), .04 if op else .02, .05 if op else .025)
        if pos % 4 != 3:
            notes = prog[int(tt0 // clen) % 4][1]; m = notes[[0, 2, 4, 2, 1, 3, 4, 3][i % 8]] + 12
            n = int(.35 * SR); x = np.arange(n) / SR; ph = 2 * np.pi * midi(m) * x
            pl = (np.sin(ph) + .3 * np.sign(np.sin(ph))) * np.exp(-x * 12); pan = .5 + .4 * np.sin(i * .6)
            put(s, pl, .07 * (1 - pan), .07 * pan)
        nxt = next((m for m in nxt_marks if m > tt0), None)
        if nxt is not None and nxt - bar <= tt0:
            g = .03 + .08 * (1 - (nxt - tt0) / bar)
            put(s, noise_hit(rng, int(.08 * SR), 900, 5000, 40), g)
        tt0 += st; i += 1
    for m in [first] + nxt_marks[:-1]:
        n = int(min(bar, m) * SR)
        if n <= 0: continue
        put(int(m * SR) - n, lowpass(rng.standard_normal(n), 6000) * np.linspace(0, 1, n) ** 2, .06)
        put(int(m * SR), noise_hit(rng, int(1.5 * SR), 3000, 12000, 3), .05)
    return L, R

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("out"); ap.add_argument("--duration", type=float, required=True)
    ap.add_argument("--style", default="ambient", choices=sorted(STYLES))
    ap.add_argument("--marks", default=""); ap.add_argument("--outro", type=float, default=None)
    ap.add_argument("--bpm", type=float, default=None); ap.add_argument("--seed", type=int, default=7)
    o = ap.parse_args()
    S = STYLES[o.style]
    rng = np.random.default_rng(o.seed)
    D = o.duration; N = int(D * SR)
    marks = [max(0.0, float(x)) for x in o.marks.split(",") if x.strip()]  # a mark can land a hair before frame 0
    first_scene = marks[1] if len(marks) > 1 else 4.0
    outro = o.outro if o.outro is not None else D - 6
    beat = 60 / (o.bpm or S["bpm"]); bar = 4 * beat
    L = np.zeros(N); R = np.zeros(N)

    def add(s, sig, gl, gr=None):
        if s < 0 or s >= N: return
        e = min(N, s + len(sig)) - s
        L[s:s + e] += gl * sig[:e]; R[s:s + e] += (gl if gr is None else gr) * sig[:e]

    prog = S["prog"]; chord_len = 2 * bar
    k = 0; t0 = 0.0
    while t0 < D:
        root, notes = prog[k % 4]
        n = int(min(chord_len + 1.5, D - t0) * SR); s = int(t0 * SR)
        if n <= 0: break
        tt = np.arange(n) / SR
        if S["pad"] == "saw":
            # pad: detuned saws, low-passed, slow swell; right channel slightly delayed for width
            chord = sum(pad_voice(midi(m), n, rng) * (0.9 if i else 1.0) for i, m in enumerate(notes))
            chord = lowpass(chord / len(notes), S["pad_cut"]) * env_adsr(n, S["pad_att"], 1.5, 1.0)
            add(s, chord, S["pad_lvl"], 0); add(s, np.roll(chord, int(0.011 * SR)), 0, S["pad_lvl"])
        elif S["pad"] == "epiano":
            # electric piano: lightly strummed chord on beats 1 and 3 of each bar, the re-strikes softer
            bn = int(2.6 * SR)
            ch = sum(np.roll(epiano(midi(m), bn), int(i * .012 * SR)) for i, m in enumerate(notes)) / len(notes)
            for b0, g in ((0, 1.0), (2, .45), (4, .9), (6, .4)):
                add(s + int(b0 * beat * SR), ch, S["pad_lvl"] * g * .95, S["pad_lvl"] * g)
        # bass
        if S["bass"] == "sustain":
            add(s, np.sin(2 * np.pi * midi(root) * tt) * env_adsr(n, 0.25, 1.2, 1.0), .16)
        elif S["bass"] == "eighth":
            bn = int(beat / 2 * SR * .95); x = np.arange(bn) / SR
            for q in range(16):
                bt = t0 + q * beat / 2
                if bt < first_scene or bt >= outro: continue
                f = midi(root + (12 if q % 4 == 3 else 0))
                add(int(bt * SR), (np.sin(2 * np.pi * f * x) + .35 * np.sin(4 * np.pi * f * x)) * np.exp(-x * 7), .13)
        elif S["bass"] == "lofi":
            bn = int(beat * 1.4 * SR); x = np.arange(bn) / SR
            for q, off in ((0, 0), (3, 7), (4, 0), (7, 5)):
                add(int((t0 + q * beat) * SR), np.sin(2 * np.pi * midi(root + off) * x) * env_adsr(bn, .02, .3, 1.0) * np.exp(-x * 1.5), .17)
        k += 1; t0 += chord_len

    # arpeggio / piano and drums between the first scene and the outro (eighth-note grid)
    step = beat / 2; t = first_scene; i = 0
    while t < outro - 0.2:
        notes = prog[int(t // chord_len) % 4][1]
        s = int((t + (S.get("swing", 0) * step if i % 2 else 0)) * SR); pos = i % 8
        if S["arp"] and not S.get("piano"):
            m = notes[[1, 2, 3, 4, 3, 2][i % 6]] + 12
            n = int(1.2 * SR); tt = np.arange(n) / SR
            pluck = (np.sin(2 * np.pi * midi(m) * tt) + 0.3 * np.sin(4 * np.pi * midi(m) * tt)) * np.exp(-tt * 5.5)
            pan = 0.5 + 0.35 * np.sin(i * 0.9)
            add(s, pluck, S["arp"] * (1 - pan), S["arp"] * pan)
        if S.get("piano") and i % 4 == 0:  # sparse piano: one note every two beats
            m = notes[[2, 4, 3, 1][(i // 4) % 4]] + 12
            n = int(3.2 * SR); tt = np.arange(n) / SR
            pn = sum(a * np.sin(2 * np.pi * midi(m) * r * tt) * np.exp(-tt * d) for r, a, d in ((1, 1, 1.4), (2, .4, 2.5), (3, .15, 4)))
            pan = 0.5 + 0.25 * np.sin(i * .7)
            add(s, pn, S["arp"] * (1 - pan), S["arp"] * pan)
        dr = S["drums"]
        if dr == "soft":
            if i % 2 == 0: add(s, kick_hit(int(.35 * SR)), .10)
            else: add(s, noise_hit(rng, int(.06 * SR), 2500, 7000, 60), .025, .03)
        elif dr == "four":
            if i % 2 == 0: add(s, kick_hit(int(.35 * SR)), .15)
            if pos in (2, 6):
                cl = noise_hit(rng, int(.18 * SR), 1100, 5200, 22)
                add(s, cl, .07); add(s + int(.012 * SR), cl, .03)
            add(s, noise_hit(rng, int(.05 * SR), 3500, 9000, 70), .02 if i % 2 == 0 else .035, .03 if i % 2 == 0 else .025)
        elif dr == "lofi":
            if pos in (0, 5): add(s, kick_hit(int(.3 * SR)), .14)
            if pos in (2, 6):
                sn_n = int(.2 * SR); x = np.arange(sn_n) / SR
                add(s, noise_hit(rng, sn_n, 900, 4200, 20) + .5 * np.sin(2 * np.pi * 185 * x) * np.exp(-x * 30), .07)
            add(s, noise_hit(rng, int(.045 * SR), 3000, 7500, 80), .02, .024)
        t += step; i += 1

    # bell at each chapter change (a lower one for the outro); cinematic adds a low boom
    for mt in marks + [outro]:
        s = int(mt * SR); n = int(3.0 * SR); tt = np.arange(n) / SR
        f = midi(S["bell"] if mt != outro else S["bell"] - 5)
        bell = sum(a * np.sin(2 * np.pi * f * r * tt) * np.exp(-tt * d) for r, a, d in ((1, 1, 2.2), (2.76, .35, 3.5), (5.4, .12, 6)))
        add(s, bell, S.get("bell_lvl", .06))
        if S.get("booms") and mt > 1:
            bn = int(2.5 * SR); x = np.arange(bn) / SR
            add(s, np.sin(2 * np.pi * (38 * x + 30 * (1 - np.exp(-x * 8)) / 8)) * np.exp(-x * 1.8), .22)
    if S.get("riser") and outro > 2.5:
        n = int(2.5 * SR)
        add(int((outro - 2.5) * SR), lowpass(rng.standard_normal(n), 3000) * np.linspace(0, 1, n) ** 2, .05)
    if S.get("crackle"):
        c = np.zeros(N); idx = rng.integers(0, N, int(D * 9)); c[idx] = rng.uniform(-1, 1, len(idx))
        hiss = lowpass(rng.standard_normal(N) * .02, 4000)
        L += .05 * c + .4 * hiss; R += .05 * np.roll(c, 97) + .4 * hiss
    if S.get("drive"):
        dl, dr_ = drive_layer(rng, D, N, beat, first_scene, outro, marks); L += dl; R += dr_

    # simple ambience: a few feedback-free echoes (longer and wetter for cinematic)
    taps = ((0.19, 0.28), (0.31, 0.22), (0.47, 0.16), (0.63, 0.1)) if o.style == "cinematic" else ((0.113, 0.22), (0.187, 0.16), (0.271, 0.11))
    for dly, g in taps:
        d = int(dly * SR)
        L[d:] += g * R[:-d]; R[d:] += g * L[:-d]
    if S.get("master_cut"):
        L = lowpass(L, S["master_cut"]); R = lowpass(R, S["master_cut"])

    # fades, soft clip, level
    fade = np.ones(N); fi = int(2.5 * SR); fo = int(3.5 * SR)
    fade[:fi] = np.linspace(0, 1, fi); fade[-fo:] = np.linspace(1, 0, fo)
    st = np.stack([L, R], 1) * fade[:, None]
    sat = S.get("sat", 1.4)                              # more drive = louder, denser mix
    st = np.tanh(st * sat) / np.tanh(sat)
    st *= S.get("peak", 0.5) / max(1e-9, np.abs(st).max())   # peak about -6 dBFS: a bed, not a feature (drive runs hotter)
    pcm = (st * 32767).astype("<i2")
    with wave.open(o.out, "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
    print(f"wrote {o.out}: {o.style}, {D:.1f}s, {len(marks)} chapter bells, rhythm {first_scene:.1f}-{outro:.1f}s")

if __name__ == "__main__":
    import sys as _s; _s.stdout.reconfigure(encoding="utf-8", errors="replace")
    main()
