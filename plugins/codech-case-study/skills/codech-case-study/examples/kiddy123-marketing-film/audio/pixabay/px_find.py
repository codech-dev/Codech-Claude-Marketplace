"""Pixabay music finder for the Kiddy123 KiddyMatch AI film (bright, optimistic product-tech) (Pixabay blocks plain scripts; firecrawl renders the pages).
1) scrape search pages -> track list (name, genre, length, url)   2) scrape each kept track page -> mp3 url
3) download mp3s to tracks/   Pixabay Content License: commercial use, no attribution (some tracks carry YouTube Content ID)."""
import json, os, re, subprocess, sys, urllib.request
HERE = os.path.dirname(os.path.abspath(__file__))
os.chdir(HERE)
QUERIES = ['inspiring technology', 'upbeat technology', 'uplifting corporate', 'happy corporate', 'optimistic', 'inspiring corporate', 'positive corporate', 'bright upbeat', 'technology innovation', 'product launch', 'startup', 'education']
GOOD = ('beats', 'future bass', 'electronic', 'corporate', 'upbeat', 'electronica', 'synthwave', 'pop', 'chill', 'ambient', 'abstract', 'instrumental', 'modern')
BAD = ('hip hop', 'old school', 'funk', 'orchestral', 'action', 'trailer', 'drum n bass', 'edm', 'dubstep', 'rock', 'metal', 'children', 'christmas', 'country', 'jazz', 'lofi', 'trap')

def fc(url, fmt, out):
    if not os.path.exists(out):
        subprocess.run(['firecrawl', 'scrape', url, '--format', fmt, '-o', out], capture_output=True, timeout=180, shell=True)
    return json.load(open(out, encoding='utf-8')) if os.path.exists(out) else {}

os.makedirs('pages', exist_ok=True); os.makedirs('tracks', exist_ok=True)
seen = {}
for q in QUERIES:
    slug = re.sub(r'\W+', '-', q)
    d = fc('https://pixabay.com/music/search/' + q.replace(' ', '%20') + '/', 'markdown', f'pages/search-{slug}.json')
    md = d.get('markdown', '')
    # blocks: [Name](track url) [artist](user url) \n\n m:ss \n\n [Genre](.../genre/x/)
    for m in re.finditer(r'\[([^\]]+)\]\((https://pixabay\.com/music/[a-z0-9-]+-(\d+)/)\)\s*\[([^\]]+)\]\(https://pixabay\.com/users/[^)]+\)\s*(\d+:\d\d)\s*\[([^\]]+)\]\(https://pixabay\.com/music/search/genre/', md):
        name, url, tid, artist, length, genre = m.groups()
        mm, ss = length.split(':')
        seen.setdefault(tid, dict(id=tid, name=name, url=url, artist=artist, secs=int(mm) * 60 + int(ss), genre=genre, q=set()))['q'].add(q)
print(len(seen), 'tracks found')
USED = {'577311', '568146', '617076', '568180', '588829', '484304', '568205', '159131'}  # JY + OTSO film tracks and JY's earlier shortlist
cands = [r for r in seen.values() if r['secs'] >= 90 and r['id'] not in USED and not any(b in r['genre'].lower() for b in BAD)]
cands.sort(key=lambda r: (-len(r['q']), r['name']))
cands = cands[:int(sys.argv[1]) if len(sys.argv) > 1 else 24]
rows = []
for r in cands:
    f = f"tracks/px{r['id']}.mp3"
    if not os.path.exists(f):
        d = fc(r['url'], 'rawHtml', f"pages/t{r['id']}.json")
        mp3 = re.findall(r'cdn\.pixabay\.com/download/audio/[^"\'\s<>]+?\.mp3(?:\?filename=[^"\'\s<>&]+)?', d.get('rawHtml', ''))
        if not mp3:
            print('no mp3', r['name']); continue
        req = urllib.request.Request('https://' + mp3[0], headers={'User-Agent': 'Mozilla/5.0', 'Referer': 'https://pixabay.com/'})
        try:
            open(f, 'wb').write(urllib.request.urlopen(req, timeout=60).read())
        except Exception as e:
            print('dl fail', r['name'], e); continue
    r['q'] = sorted(r['q']); r['file'] = f
    rows.append(r); print('ok', r['id'], r['name'], '|', r['genre'], '|', r['secs'], 's |', ','.join(r['q']))
json.dump(rows, open('px_tracks.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
