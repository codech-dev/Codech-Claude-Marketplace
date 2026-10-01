"""Soundtrack tools for the marketing film (Mode C): find royalty-free tracks, analyse tempo/downbeats, fit a track to the cut.

  find     scrape Mixkit tag pages, download candidates, rank by energy, write 25 s auditions,
           optional film previews (the cut scored with each track FROM ITS START) and a shortlist page
  analyse  tempo (comb-refined to 0.01 BPM), beat phase, bar length and the drop downbeat
  fit      splice whole bars so the track covers the film; 20 ms equal-power crossfades

  python mf_music.py find --tags corporate,technology,inspirational --out audio/lib --top 6 --film renders/cut.mp4
  python mf_music.py analyse audio/lib/tracks/173.mp3 --json audio/fit.json
  python mf_music.py fit audio/lib/tracks/173.mp3 --params audio/fit.json --plan "0:d0+26b, d0+12b:d0+16b, d0+26b:end" --out audio/music_fit.wav --target 102.85

Mixkit tracks are under the Mixkit Stock Music Free License (commercial video, no attribution); re-check
https://mixkit.co/license/ before shipping. Pixabay audio is JS-loaded (403 to scripts) and FreePD is closed.
Needs numpy and imageio-ffmpeg."""
import argparse, html, json, math, os, re, subprocess, sys, urllib.request, wave
import numpy as np

UA = {'User-Agent': 'Mozilla/5.0'}
LD = re.compile(r'\{"@id":"[^"]+","@type":"MusicRecording","name":"([^"]+)","genre":"([^"]+)","byArtist":"([^"]+)","duration":"([^"]+)","url":"https://assets\.mixkit\.co/music/(\d+)/')


def ffmpeg():
    import imageio_ffmpeg
    return imageio_ffmpeg.get_ffmpeg_exe()


def decode(path, sr=44100, ch=2):
    raw = subprocess.run([ffmpeg(), '-v', 'error', '-i', path, '-ac', str(ch), '-ar', str(sr), '-f', 's16le', '-'], capture_output=True, check=True).stdout
    y = np.frombuffer(raw, np.int16).astype(np.float32) / 32768
    return y.reshape(-1, ch) if ch > 1 else y


def get(url, timeout=60):
    return urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=timeout).read()


def iso_secs(d):  # "PT1M40S"
    m = re.match(r'PT(?:(\d+)M)?(?:(\d+)S)?', d)
    return int(m.group(1) or 0) * 60 + int(m.group(2) or 0) if m else 0


def onset_env(mono, sr, hop, win=2048, log=True):
    fr = np.lib.stride_tricks.sliding_window_view(mono, win)[::hop] * np.hanning(win)
    S = np.abs(np.fft.rfft(fr, axis=1))
    if log:
        S = np.log1p(S * 50)
    flux = np.maximum(0, np.diff(S, axis=0)).sum(1)
    return (flux - flux.mean()) / (flux.std() + 1e-9)


def per_second_rms(mono, sr):
    n = len(mono) // sr
    return np.array([np.sqrt(np.mean(mono[k * sr:(k + 1) * sr] ** 2)) for k in range(n)])


# ---------------------------------------------------------------- find
def cmd_find(a):
    os.makedirs(os.path.join(a.out, 'pages'), exist_ok=True)
    os.makedirs(os.path.join(a.out, 'tracks'), exist_ok=True)
    seen = {}
    for tag in [t.strip() for t in a.tags.split(',') if t.strip()]:
        page = os.path.join(a.out, 'pages', f'{tag}.html')
        if not os.path.exists(page):
            try:
                open(page, 'wb').write(get(f'https://mixkit.co/free-stock-music/tag/{tag}/'))
            except Exception as e:
                print('skip tag', tag, e); continue
        s = open(page, encoding='utf-8', errors='ignore').read()
        for n, g, ar, d, i in LD.findall(s):
            seen.setdefault(i, dict(id=i, name=html.unescape(n), genre=g, artist=html.unescape(ar), secs=iso_secs(d), tags=set()))['tags'].add(tag)
    if a.min_secs:
        seen = {k: v for k, v in seen.items() if v['secs'] >= a.min_secs or v['secs'] == 0}
    # tracks found under several tags first: they sit closest to the brief
    cands = sorted(seen.values(), key=lambda r: (-len(r['tags']), r['name']))[:a.max]
    print(f'{len(seen)} tracks found, ranking {len(cands)}')
    rows = []
    for r in cands:
        f = os.path.join(a.out, 'tracks', f"{r['id']}.mp3")
        if not os.path.exists(f):
            try:
                open(f, 'wb').write(get(f"https://assets.mixkit.co/music/{r['id']}/{r['id']}.mp3"))
            except Exception as e:
                print('download failed', r['id'], e); continue
        x = decode(f, 11025, 1)
        sec = per_second_rms(x, 11025)
        win = min(25, len(sec))
        best = max(range(0, max(1, len(sec) - win)), key=lambda k: sec[k:k + win].mean())
        env = onset_env(x, 11025, 256, 1024, log=False)
        seg = env[:4000]
        ac = np.correlate(seg, seg, 'full')[len(seg) - 1:]
        fps = 11025 / 256
        bpms = 60 * fps / np.maximum(np.arange(len(ac)), 1)
        m = (bpms > 80) & (bpms < 180)
        beat = float(ac[m].max() / ac[0])
        r.update(peak_rms=round(float(sec[best:best + win].mean()), 3), peak_at=int(best), beat=round(beat, 2),
                 bpm=round(float(bpms[m][np.argmax(ac[m])])), secs=r['secs'] or len(sec), energy=round(float(sec[best:best + win].mean()) * (0.5 + beat), 3))
        rows.append(r)
    rows.sort(key=lambda r: -r['energy'])
    for r in rows:
        print(f"{r['energy']:.3f}  #{r['id']:>5}  {r['name']} | {r['artist']} | {r['genre']} | {r['secs'] // 60}:{r['secs'] % 60:02d} | {r['bpm']} bpm | {','.join(sorted(r['tags']))}")
    short = rows[:a.top]
    sl = os.path.join(a.out, 'shortlist'); os.makedirs(sl, exist_ok=True)
    ff = ffmpeg()
    for r in short:
        slug = re.sub(r'[^a-z0-9]+', '-', r['name'].lower()).strip('-')
        r['slug'] = slug
        src = os.path.join(a.out, 'tracks', f"{r['id']}.mp3")
        st = max(0, r['peak_at'] - 3)
        subprocess.run([ff, '-y', '-v', 'error', '-ss', str(st), '-t', '25', '-i', src, '-af', 'afade=t=in:d=0.4,afade=t=out:st=23.5:d=1.5', '-b:a', '128k', os.path.join(sl, f"{r['id']}-{slug}.mp3")], check=True)
        if a.film:
            # score the cut from the track's beginning: the user judges the opening, not the peak
            n = str(a.film_secs)
            subprocess.run([ff, '-y', '-v', 'error', '-t', n, '-i', a.film, '-i', src, '-map', '0:v', '-map', '1:a', '-t', n, '-vf', 'scale=1280:-2', '-c:v', 'libx264', '-crf', '27', '-preset', 'veryfast',
                            '-af', f'afade=t=out:st={a.film_secs - 2}:d=2', '-c:a', 'aac', '-b:a', '128k', '-movflags', '+faststart', os.path.join(sl, f"{r['id']}-{slug}-film.mp4")], check=True)
    for r in rows:
        r['tags'] = sorted(r['tags'])
    json.dump(rows, open(os.path.join(a.out, 'rank.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    write_shortlist(sl, short, bool(a.film), a.film_secs, a.title)
    print('shortlist ->', os.path.join(sl, 'index.html'), '(publish it as an Artifact with the mp3/mp4 files)')


def write_shortlist(sl, short, film, film_secs, title):
    tpl = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'assets', 'marketing-film', 'music-shortlist.html')
    s = open(tpl, encoding='utf-8').read()
    data = [[r['id'], r['slug'], r['name'], r['artist'], r['genre'], f"{r['secs'] // 60}:{r['secs'] % 60:02d}", [f"{r['bpm']} BPM"] + r['tags'][:2]] for r in short]
    s = s.replace('/*@DATA*/', json.dumps(data, ensure_ascii=False)).replace('@FILM', 'true' if film else 'false').replace('@SECS', str(film_secs)).replace('@TITLE', html.escape(title))
    open(os.path.join(sl, 'index.html'), 'w', encoding='utf-8').write(s)


# ---------------------------------------------------------------- analyse
def analyse(path, lo=80, hi=170, near=None):
    SR, hop = 44100, 441  # 100 onset frames per second
    y = decode(path, SR, 2)
    mono = y.mean(1)
    fps = SR / hop
    flux = onset_env(mono, SR, hop)
    sec = per_second_rms(mono, SR)
    dur = len(mono) / SR
    # analyse the loudest ~50 s, where the groove is steadiest
    w = min(50, len(sec) - 1)
    a0 = max(range(0, max(1, len(sec) - w)), key=lambda k: sec[k:k + w].mean())
    A, B = a0 * fps, (a0 + w) * fps
    seg = flux[int(A):int(B)]
    ac = np.correlate(seg, seg, 'full')[len(seg) - 1:]
    bpms = 60 * fps / np.maximum(np.arange(len(ac)), 1)
    m = (bpms > lo) & (bpms < hi)
    coarse = float(bpms[m][np.argmax(ac[m])])

    def comb(bpm, ph):
        per = 60 / bpm * fps
        idx = ph + np.arange(0, int(dur * bpm / 60) + 2) * per
        idx = idx[(idx > A) & (idx < B)].astype(int)
        return flux[idx].mean() if len(idx) else -9
    best = (-9, coarse, 0.0)
    for bpm in np.arange(coarse - 3, coarse + 3, 0.01):
        per = 60 / bpm * fps
        for ph in np.arange(0, per, 1):
            s = comb(bpm, ph)
            if s > best[0]:
                best = (s, bpm, ph)
    _, bpm, ph = best
    beat = 60 / bpm
    bar = 4 * beat
    beats = ph / fps + np.arange(0, int(dur / beat) + 2) * beat

    def bscore(off):
        idx = [int((ph / fps + (off + 4 * k) * beat) * fps) for k in range(int(dur / bar)) if A < (ph / fps + (off + 4 * k) * beat) * fps < B]
        return flux[idx].mean() if idx else -9
    off = max(range(4), key=bscore)
    downbeats = beats[off::4]
    # drop = the downbeat with the biggest energy rise (4 bars after vs 4 bars before), or the one nearest --near
    def rise(d):
        i = int(d)
        n = max(1, int(round(4 * bar)))
        if i - n < 0 or i + n > len(sec):
            return -9
        return sec[i:i + n].mean() - sec[i - n:i].mean()
    if near is not None:
        drop = float(min(downbeats, key=lambda d: abs(d - near)))
    else:
        drop = float(max(downbeats, key=rise))
    return dict(track=path, duration=round(dur, 3), bpm=round(float(bpm), 3), beat=round(beat, 5), bar=round(bar, 5), d0=round(drop, 3),
                first_downbeat=round(float(downbeats[0]), 3), rise_candidates=[round(float(d), 3) for d in sorted(downbeats, key=rise, reverse=True)[:5]])


def cmd_analyse(a):
    r = analyse(a.track, a.lo, a.hi, a.near)
    print(json.dumps(r, indent=1))
    if a.json:
        json.dump(r, open(a.json, 'w'), indent=1)
        print('saved', a.json)


# ---------------------------------------------------------------- fit
def evaluate(expr, d0, bar, end):
    expr = re.sub(r'(\d+(?:\.\d+)?)\s*b\b', r'(\1*bar)', expr.strip())  # "26b" -> 26 bars
    return float(eval(expr, {'__builtins__': {}}, {'d0': d0, 'bar': bar, 'end': end}))


def cmd_fit(a):
    p = json.load(open(a.params)) if a.params else {}
    d0 = a.d0 if a.d0 is not None else p['d0']
    bar = a.bar if a.bar is not None else p['bar']
    SR = 44100
    y = decode(a.track, SR, 2)
    end = len(y) / SR
    parts = []
    for piece in a.plan.split(','):
        s, e = piece.split(':')
        parts.append((evaluate(s, d0, bar, end), evaluate(e, d0, bar, end)))
    X = int(0.02 * SR)
    fo = np.cos(np.linspace(0, np.pi / 2, X))[:, None]
    fi = np.sin(np.linspace(0, np.pi / 2, X))[:, None]
    out = None
    film_t = 0.0
    for s, e in parts:
        if s <= d0 < e:
            print(f'drop (d0={d0:.3f}) lands at output {film_t + d0 - s:.3f} s')
        print(f'  track {s:7.3f} -> {e:7.3f}  ({(e - s) / bar:5.2f} bars)  at output {film_t:7.3f}')
        seg = y[int(s * SR):int(e * SR)].copy()
        film_t += e - s
        out = seg if out is None else np.concatenate([out[:-X], out[-X:] * fo + seg[:X] * fi, seg[X:]])
    out = out / max(1e-9, np.abs(out).max()) * 0.89
    L = len(out) / SR
    print(f'length {L:.2f} s' + (f'  (target {a.target:.2f} s: {"covers" if L >= a.target else "SHORT by %.2f s" % (a.target - L)})' if a.target else ''))
    with wave.open(a.out, 'wb') as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((out * 32767).astype(np.int16).tobytes())
    print('saved', a.out)


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = ap.add_subparsers(dest='cmd', required=True)
    f = sub.add_parser('find')
    f.add_argument('--tags', default='corporate,technology,inspirational,motivational,positive,promo,presentation,uplifting,advertising,commercial,optimistic,business')
    f.add_argument('--out', required=True)
    f.add_argument('--max', type=int, default=24, help='candidates to download and rank')
    f.add_argument('--top', type=int, default=6)
    f.add_argument('--min-secs', type=int, default=60)
    f.add_argument('--film', help='current cut (mp4): renders a preview per shortlisted track')
    f.add_argument('--film-secs', type=int, default=36)
    f.add_argument('--title', default='Soundtrack shortlist')
    f.set_defaults(fn=cmd_find)
    n = sub.add_parser('analyse')
    n.add_argument('track'); n.add_argument('--json'); n.add_argument('--near', type=float, help='pick the downbeat nearest this time as d0')
    n.add_argument('--lo', type=float, default=80); n.add_argument('--hi', type=float, default=170)
    n.set_defaults(fn=cmd_analyse)
    t = sub.add_parser('fit')
    t.add_argument('track'); t.add_argument('--params'); t.add_argument('--d0', type=float); t.add_argument('--bar', type=float)
    t.add_argument('--plan', required=True, help='comma-separated start:end in track seconds; names d0, b (bars), end. e.g. "0:d0+26b, d0+12b:d0+16b, d0+26b:end"')
    t.add_argument('--out', required=True); t.add_argument('--target', type=float)
    t.set_defaults(fn=cmd_fit)
    a = ap.parse_args()
    a.fn(a)


if __name__ == '__main__':
    main()
