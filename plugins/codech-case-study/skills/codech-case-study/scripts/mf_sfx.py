"""Sound-effect palette for the marketing film (Mode C), from Mixkit (free licence, no attribution).

  fetch   download the palette and save each sound trimmed (silence cut, 5 ms pre-roll) and peak-normalised
          as <out>/<name>.npy (float32 stereo, 44.1 kHz), ready for mf_mix.py
  search  list ids and titles on Mixkit category pages, to swap a sound in the palette

  python mf_sfx.py fetch --out audio/sfx/wav
  python mf_sfx.py fetch --out audio/sfx/wav --add whoosh_soft=1489,bell=938
  python mf_sfx.py search whoosh pop click notification typing camera interface transition impact

Needs numpy and imageio-ffmpeg."""
import argparse, html, os, re, subprocess, urllib.request
import numpy as np

SR = 44100
# The palette used for the ShingTik film. Names describe what each sound is FOR in a UI-showcase cut.
PALETTE = {
    'pop': 2354, 'pop_light': 3005, 'pop_dry': 2356, 'pop_hard': 2364,     # cards, bubbles, chips landing
    'notif': 2357, 'ding': 951, 'confirm': 2867, 'tech_ok': 3116,          # messages arriving, success states
    'click': 2568, 'tap': 1120, 'select': 3124,                            # cursor clicks, phone taps, picks
    'typing': 1396, 'typing_phone': 1395,                                  # keyboard / phone typing (trim with ln=)
    'sweep': 166, 'sweep2': 174, 'sweep_air': 168, 'whoosh_big': 1492,     # whip pans, slides, zoom-throughs
    'tech_slide': 3120, 'scifi_sweep': 3114, 'swirl': 1493, 'sparkle': 2350,  # panels, scans, orb swirl, AI magic
    'impact_zoom': 772, 'impact_intro': 2902, 'impact_logo': 2900,         # slams, the drop, end-card logo
    'shutter': 1432, 'error': 1110, 'fail': 946, 'tick': 2577, 'page': 1107,  # camera, wrong item, generic-AI fail, counters, flips
}


def ffmpeg():
    import imageio_ffmpeg
    return imageio_ffmpeg.get_ffmpeg_exe()


def get(url):
    return urllib.request.urlopen(urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'}), timeout=60).read()


def cmd_fetch(a):
    pal = dict(PALETTE)
    for kv in filter(None, (a.add or '').split(',')):
        k, v = kv.split('=')
        pal[k.strip()] = int(v)
    os.makedirs(a.out, exist_ok=True)
    cache = os.path.join(a.out, '_raw'); os.makedirs(cache, exist_ok=True)
    ff = ffmpeg()
    for k, i in pal.items():
        mp = os.path.join(cache, f'{i}.mp3')
        if not os.path.exists(mp):
            open(mp, 'wb').write(get(f'https://assets.mixkit.co/active_storage/sfx/{i}/{i}-preview.mp3'))
        raw = subprocess.run([ff, '-v', 'error', '-i', mp, '-ac', '2', '-ar', str(SR), '-f', 's16le', '-'], capture_output=True, check=True).stdout
        y = np.frombuffer(raw, np.int16).reshape(-1, 2).astype(np.float32) / 32768
        env = np.abs(y).max(1)
        nz = np.where(env > env.max() * 0.02)[0]
        y = y[max(0, nz[0] - int(0.005 * SR)):min(len(y), nz[-1] + int(0.05 * SR))]
        y = y / np.abs(y).max() * 0.9
        np.save(os.path.join(a.out, f'{k}.npy'), y)
        print(f'{k:13s} #{i:<5d} {len(y) / SR:5.2f} s')


def cmd_search(a):
    for tag in a.tags:
        s = get(f'https://mixkit.co/free-sound-effects/{tag}/').decode('utf-8', 'ignore')
        rows = []
        for m in re.finditer(r'data-audio-player-item-id-value="(\d+)"', s):
            t = re.search(r'item-grid-card__title[^>]*>\s*([^<]+?)\s*<', s[m.end():m.end() + 4000])
            rows.append(f"{m.group(1)}:{html.unescape(t.group(1)) if t else '?'}")
        print(f'== {tag} ({len(rows)})\n   ' + '\n   '.join(rows))
    print('\npreview: https://assets.mixkit.co/active_storage/sfx/<id>/<id>-preview.mp3')


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = ap.add_subparsers(dest='cmd', required=True)
    f = sub.add_parser('fetch'); f.add_argument('--out', required=True); f.add_argument('--add', help='extra name=id pairs, comma-separated'); f.set_defaults(fn=cmd_fetch)
    s = sub.add_parser('search'); s.add_argument('tags', nargs='+'); s.set_defaults(fn=cmd_search)
    a = ap.parse_args(); a.fn(a)


if __name__ == '__main__':
    main()
