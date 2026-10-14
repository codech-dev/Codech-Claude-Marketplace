"""Shortlist page for hand-picked Pixabay tracks (reuses mf_music's page template). Run: python px_shortlist.py ../../renders/cut-v3.mp4"""
import json, os, re, subprocess, sys
import glob, re
# this skill's scripts/ folder: $SK_SCRIPTS, else the newest installed codech-case-study (by version number, not ls order)
SK = os.environ.get('SK_SCRIPTS') or max(glob.glob(os.path.expanduser('~/.claude/plugins/cache/codech-marketplace/codech-case-study/*/skills/codech-case-study/scripts')),
                                         key=lambda p: [int(n) for n in re.search(r'codech-case-study[\\/](\d+(?:\.\d+)*)[\\/]', p).group(1).split('.')])
sys.path.insert(0, SK)
import mf_music as M
os.chdir(os.path.dirname(os.path.abspath(__file__)))
PICK = os.environ['PICK'].split(',')
film = os.path.abspath(sys.argv[1]) if len(sys.argv) > 1 else None
FILM_SECS = 75
rows = {r['id']: r for r in json.load(open('px_rank.json', encoding='utf-8'))}
short = []
sl = 'shortlist'; os.makedirs(sl, exist_ok=True)
for f in os.listdir(sl):
    if f.endswith(('.mp3', '.mp4')): os.remove(os.path.join(sl, f))
ff = M.ffmpeg()
for pid in PICK:
    r = dict(rows[pid])
    who = re.sub(r'[^a-z0-9]+', '-', r['artist'].replace('\\', '').lower()).strip('-')
    r['slug'] = re.sub(r'[^a-z0-9]+', '-', r['name'].lower()).strip('-')[:40] + '-' + who
    r['id'] = 'px' + pid
    r['artist'] = r['artist'].replace('\\', '') + ' · Pixabay'
    r['tags'] = [r['genre'].lower()]
    src = r['file']
    st = max(0, r['peak_at'] - 3)
    subprocess.run([ff, '-y', '-v', 'error', '-ss', str(st), '-t', '25', '-i', src, '-af', 'afade=t=in:d=0.4,afade=t=out:st=23.5:d=1.5', '-b:a', '128k', os.path.join(sl, f"{r['id']}-{r['slug']}.mp3")], check=True)
    if film:
        n = str(FILM_SECS)
        subprocess.run([ff, '-y', '-v', 'error', '-t', n, '-i', film, '-i', src, '-map', '0:v', '-map', '1:a', '-t', n, '-vf', 'scale=1280:-2', '-c:v', 'libx264', '-crf', '27', '-preset', 'veryfast',
                        '-af', f'afade=t=out:st={FILM_SECS - 2}:d=2', '-c:a', 'aac', '-b:a', '128k', '-movflags', '+faststart', os.path.join(sl, f"{r['id']}-{r['slug']}-film.mp4")], check=True)
    short.append(r); print('done', r['id'], r['name'], r['artist'])
M.write_shortlist(sl, short, bool(film), FILM_SECS, 'Kiddy123 KiddyMatch AI film · soundtrack shortlist')
print('ok')
