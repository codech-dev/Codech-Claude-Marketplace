"""Rank the downloaded Pixabay tracks with mf_music's energy/beat/bpm measures (same as `find`)."""
import json, os, sys
import numpy as np
import glob, re
# this skill's scripts/ folder: $SK_SCRIPTS, else the newest installed codech-case-study (by version number, not ls order)
SK = os.environ.get('SK_SCRIPTS') or max(glob.glob(os.path.expanduser('~/.claude/plugins/cache/codech-marketplace/codech-case-study/*/skills/codech-case-study/scripts')),
                                         key=lambda p: [int(n) for n in re.search(r'codech-case-study[\\/](\d+(?:\.\d+)*)[\\/]', p).group(1).split('.')])
sys.path.insert(0, SK)
import mf_music as M
os.chdir(os.path.dirname(os.path.abspath(__file__)))
rows = json.load(open('px_tracks.json', encoding='utf-8'))
for r in rows:
    x = M.decode(r['file'], 11025, 1)
    x = x.mean(1) if x.ndim > 1 else x
    sec = M.per_second_rms(x, 11025)
    win = min(25, len(sec))
    best = max(range(0, max(1, len(sec) - win)), key=lambda k: sec[k:k + win].mean())
    env = M.onset_env(x, 11025, 256, 1024, log=False)
    seg = env[:4000]
    ac = np.correlate(seg, seg, 'full')[len(seg) - 1:]
    fps = 11025 / 256
    bpms = 60 * fps / np.maximum(np.arange(len(ac)), 1)
    m = (bpms > 80) & (bpms < 180)
    beat = float(ac[m].max() / ac[0])
    intro = float(sec[:6].mean() / (sec.max() + 1e-9))  # how much the first 6 s already carries
    r.update(peak_at=int(best), beat=round(beat, 2), bpm=round(float(bpms[m][np.argmax(ac[m])])), energy=round(float(sec[best:best + win].mean()) * (0.5 + beat), 3), intro=round(intro, 2),
             id=r['id'], slug='px' + r['id'], tags=r['q'], secs=r['secs'])
rows.sort(key=lambda r: -r['energy'])
for r in rows:
    print(f"{r['energy']:.3f} beat {r['beat']:.2f} intro {r['intro']:.2f} {r['bpm']:>3}bpm  px{r['id']}  {r['name']} | {r['artist']} | {r['genre']} | {r['secs']}s")
json.dump(rows, open('px_rank.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
