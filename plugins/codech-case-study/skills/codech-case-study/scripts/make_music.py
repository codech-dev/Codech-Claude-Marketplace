#!/usr/bin/env python3
"""Compose an original, royalty-free background track for a case-study film.

    python make_music.py <out.wav> --duration 71.5 [--marks 3.6,15.2,...] [--outro 66.3] [--bpm 92] [--seed 7]

Calm "ambient tech" bed in C major: warm detuned pad (Cmaj9 → Am9 → Fmaj9 → G6/9, two bars each),
sub bass, a soft plucked arpeggio and a light pulse once the product scenes start, a gentle bell
at every chapter change (--marks, seconds), the pulse drops out for the outro, and the whole
thing fades in and out. Synthesised from scratch with numpy, so there is nothing to license.
It sits under captions: quiet (about -18 LUFS-ish) and without melody that competes with reading.
record_film.py calls this automatically with the film's real chapter times.
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
        # vectorised IIR via cumulative trick is unstable; loop in chunks is fine at this size
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
        saw = 2 * ((t * f + ph) % 1.0) - 1
        out += saw
    return out / 3

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("out"); ap.add_argument("--duration", type=float, required=True)
    ap.add_argument("--marks", default=""); ap.add_argument("--outro", type=float, default=None)
    ap.add_argument("--bpm", type=float, default=92); ap.add_argument("--seed", type=int, default=7)
    o = ap.parse_args()
    rng = np.random.default_rng(o.seed)
    D = o.duration; N = int(D * SR)
    marks = [float(x) for x in o.marks.split(",") if x.strip()]
    first_scene = marks[1] if len(marks) > 1 else 4.0
    outro = o.outro if o.outro is not None else D - 6
    beat = 60 / o.bpm; bar = 4 * beat
    L = np.zeros(N); R = np.zeros(N)

    # chord progression, two bars each: (root for bass, pad notes)
    prog = [(36, [48, 55, 59, 62, 64]),   # Cmaj9
            (45, [45, 52, 55, 59, 60]),   # Am9 (A C E G B)
            (41, [41, 48, 52, 55, 57]),   # Fmaj9 (F A C E G)
            (43, [43, 50, 55, 57, 59])]   # G6/9 (G B D E A)
    chord_len = 2 * bar
    k = 0; t0 = 0.0
    while t0 < D:
        root, notes = prog[k % 4]
        n = int(min(chord_len + 1.5, D - t0) * SR); s = int(t0 * SR)
        if n <= 0: break
        # pad: detuned saws, low-passed, slow swell; left/right slightly different voicings
        chord = np.zeros(n)
        for i, m in enumerate(notes):
            v = pad_voice(midi(m), n, rng) * (0.9 if i else 1.0)
            chord += v
        chord = lowpass(chord / len(notes), 900.0) * env_adsr(n, 1.4, 1.5, 1.0)
        e = min(N, s + n) - s
        L[s:s + e] += 0.30 * chord[:e]
        R[s:s + e] += 0.30 * np.roll(chord, int(0.011 * SR))[:e]
        # sub bass (sine, soft attack)
        tt = np.arange(n) / SR
        bass = np.sin(2 * np.pi * midi(root) * tt) * env_adsr(n, 0.25, 1.2, 1.0)
        L[s:s + e] += 0.16 * bass[:e]; R[s:s + e] += 0.16 * bass[:e]
        k += 1; t0 += chord_len

    # arpeggio + pulse between the first scene and the outro
    step = beat / 2; t = first_scene; i = 0
    while t < outro - 0.2:
        ci = int(t // chord_len) % 4; notes = prog[ci][1]
        m = notes[[1, 2, 3, 4, 3, 2][i % 6]] + 12
        n = int(1.2 * SR); s = int(t * SR); e = min(N, s + n) - s
        tt = np.arange(n) / SR
        pluck = (np.sin(2 * np.pi * midi(m) * tt) + 0.3 * np.sin(4 * np.pi * midi(m) * tt)) * np.exp(-tt * 5.5)
        pan = 0.5 + 0.35 * np.sin(i * 0.9)
        L[s:s + e] += 0.07 * (1 - pan) * pluck[:e]; R[s:s + e] += 0.07 * pan * pluck[:e]
        if i % 2 == 0:  # soft kick on the beat
            kn = int(0.35 * SR); ke = min(N, s + kn) - s; kt = np.arange(kn) / SR
            kick = np.sin(2 * np.pi * (48 * kt + 40 * (1 - np.exp(-kt * 30)) / 30)) * np.exp(-kt * 9)
            L[s:s + ke] += 0.10 * kick[:ke]; R[s:s + ke] += 0.10 * kick[:ke]
        else:           # quiet shaker on the off-beat
            hn = int(0.06 * SR); he = min(N, s + hn) - s
            hat = lowpass(rng.standard_normal(hn), 7000) - lowpass(rng.standard_normal(hn), 2500)
            hat *= np.exp(-np.arange(hn) / SR * 60)
            L[s:s + he] += 0.025 * hat[:he]; R[s:s + he] += 0.03 * hat[:he]
        t += step; i += 1

    # bell at each chapter change (and a lower one for the outro)
    for j, mt in enumerate(marks + [outro]):
        s = int(mt * SR); n = int(3.0 * SR); e = min(N, s + n) - s
        if e <= 0: continue
        tt = np.arange(n) / SR; f = midi(84 if mt != outro else 79)
        bell = sum(a * np.sin(2 * np.pi * f * r * tt) * np.exp(-tt * d) for r, a, d in ((1, 1, 2.2), (2.76, .35, 3.5), (5.4, .12, 6)))
        L[s:s + e] += 0.06 * bell[:e]; R[s:s + e] += 0.06 * bell[:e]

    # simple ambience: a few feedback-free echoes
    for dly, g in ((0.113, 0.22), (0.187, 0.16), (0.271, 0.11)):
        d = int(dly * SR)
        L[d:] += g * R[:-d]; R[d:] += g * L[:-d]

    # fades, soft clip, level
    fade = np.ones(N); fi = int(2.5 * SR); fo = int(3.5 * SR)
    fade[:fi] = np.linspace(0, 1, fi); fade[-fo:] = np.linspace(1, 0, fo)
    st = np.stack([L, R], 1) * fade[:, None]
    st = np.tanh(st * 1.4) / np.tanh(1.4)
    st *= 0.5 / max(1e-9, np.abs(st).max())          # peak about -6 dBFS: a bed, not a feature
    pcm = (st * 32767).astype("<i2")
    with wave.open(o.out, "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
    print(f"wrote {o.out}: {D:.1f}s, {len(marks)} chapter bells, pulse {first_scene:.1f}-{outro:.1f}s")

if __name__ == "__main__":
    import sys as _s; _s.stdout.reconfigure(encoding="utf-8", errors="replace")
    main()
