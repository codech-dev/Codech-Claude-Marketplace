"""Mix the marketing film's soundtrack (Mode C): sound effects from a cue sheet over the fitted music.

  python mf_mix.py audio/cues.py --music audio/music_fit.wav --sfx audio/sfx/wav --len 102.85 --out audio/final_mix.wav

The cue sheet is a Python file run with these names available:
  q(sound, film_time, gain_db=-10, ln=None, pre=0.0)   place <sfx>/<sound>.npy at film_time (seconds)
        ln  = keep only the first ln seconds (typing loops), with a 50 ms fade
        pre = start this many seconds early, so a whoosh swells INTO the cut instead of after it
  W = 0.22                                              the usual whoosh pre-roll
  at(scene_id, local_t)                                 film time of a scene-local time, from --timeline timeline.json
                                                        (the template's edit list), so cues follow when scenes move
Without a timeline, define your own time mappings at the top of the cue sheet (examples/shingtik-marketing-film/cues.py).

Mix: SFX bus soft-limited with tanh, music x music_gain with a fade-out, peak-normalised to 0.95, 16-bit 44.1 kHz WAV.
Needs numpy."""
import argparse, json, os, runpy, wave
import numpy as np

SR = 44100


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('cues'); ap.add_argument('--music'); ap.add_argument('--sfx', required=True)
    ap.add_argument('--len', type=float, required=True, help='film length in seconds')
    ap.add_argument('--out', required=True)
    ap.add_argument('--music-gain', type=float, default=0.82); ap.add_argument('--sfx-gain', type=float, default=0.9)
    ap.add_argument('--fade-out', type=float, default=1.55)
    ap.add_argument('--timeline', help="the Remotion template's src/timeline.json: enables at(id, t) in the cue sheet")
    a = ap.parse_args()

    starts = {}
    if a.timeline:
        prev = None
        for e in json.load(open(a.timeline, encoding='utf-8')):
            st = prev[0] + prev[1] - e.get('overlap', 0) if prev else 0.0
            starts[e['id']] = st; prev = (st, e['dur'])
    def at(sid, t=0.0):
        if sid not in starts:
            raise SystemExit(f'at(): scene {sid!r} not in timeline ({", ".join(starts) or "pass --timeline"})')
        return starts[sid] + t

    C = []
    def q(s, t, g=-10, ln=None, pre=0.0):
        C.append((s, t, g, ln, pre))
    runpy.run_path(a.cues, init_globals={'q': q, 'W': 0.22, 'at': at})

    N = int(a.len * SR)
    bus = np.zeros((N, 2), np.float32)
    cache, missing = {}, set()
    for s, t, g, ln, pre in C:
        p = os.path.join(a.sfx, f'{s}.npy')
        if not os.path.exists(p):
            missing.add(s); continue
        y = cache.setdefault(s, np.load(p))
        if ln:
            y = y[:int(ln * SR)].copy(); f = min(len(y), int(0.05 * SR)); y[-f:] *= np.linspace(1, 0, f)[:, None]
        st = int((t - pre) * SR)
        if st >= N:
            continue
        if st < 0:
            y = y[-st:]; st = 0
        e = min(N, st + len(y))
        bus[st:e] += y[:e - st] * (10 ** (g / 20))
    if missing:
        print('MISSING sounds (fetch them with mf_sfx.py):', ', '.join(sorted(missing)))
    bus = np.tanh(bus * 1.2) / 1.2
    mix = bus * a.sfx_gain
    if a.music:
        with wave.open(a.music) as w:
            assert w.getframerate() == SR and w.getnchannels() == 2, 'music must be 44.1 kHz stereo (mf_music.py fit writes that)'
            m = np.frombuffer(w.readframes(w.getnframes()), np.int16).reshape(-1, 2).astype(np.float32) / 32768
        if len(m) < N:
            print(f'WARNING: music is {len(m) / SR:.2f} s, film is {a.len:.2f} s: refit with a longer plan')
        m = m[:N] if len(m) >= N else np.pad(m, ((0, N - len(m)), (0, 0)))
        fo = int(a.fade_out * SR); m[-fo:] *= np.linspace(1, 0, fo)[:, None]
        mix = mix + m * a.music_gain
    mix = mix / max(1.0, np.abs(mix).max() / 0.95)
    with wave.open(a.out, 'wb') as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((mix * 32767).astype(np.int16).tobytes())
    print('cues', len(C), 'peak', round(float(np.abs(mix).max()), 3), '->', a.out)


if __name__ == '__main__':
    main()
