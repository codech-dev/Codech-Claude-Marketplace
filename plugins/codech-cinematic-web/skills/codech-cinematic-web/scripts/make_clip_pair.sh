#!/bin/bash
# make_clip_pair.sh <tag> <W> <H> <intro-raw.mp4> <loop-raw.mp4>
#
#   e.g.  make_clip_pair.sh bg-01-m 720 1280 raw/intro.mp4 raw/loop.mp4
#
# Turns a generated intro/loop pair into two web clips that hand off with no
# visible seam, then MEASURES the three joins so you do not have to trust it.
#
#   loop   0.6 s crossfade at its own wrap, scaled, crf 20
#   intro  last 10 frames blended IN RAW YUV into the loop's exact first frame,
#          concatenated onto the head, crf 16
#
# Why raw YUV and not ffmpeg filters: xfade and blend-against-a-still both
# revert mid-fade here, and an RGB round trip biases the result by a uniform
# ~1.3 levels, which reads as a flash at the join. numpy on yuv420p does not.
#
# Needs: ffmpeg, ffprobe, python3 + numpy + Pillow
set -e
T="$1"; W="$2"; H="$3"; INTRO="$4"; LOOP="$5"
if [ -z "$LOOP" ]; then
  sed -n '2,8p' "$0" | sed 's/^# \{0,1\}//'; exit 1
fi
OUT="${OUT:-.}"; mkdir -p "$OUT"

echo "=== inputs ==="
for f in "$INTRO" "$LOOP"; do
  ffprobe -v error -select_streams v:0 \
    -show_entries stream=width,height,r_frame_rate \
    -show_entries format=duration,size -of csv=p=0 "$f" \
    | tr '\n' ' ' | sed "s|^|  $f: |"; echo
done

# ---- loop: crossfade the wrap -----------------------------------------------
D=$(ffprobe -v error -show_entries format=duration -of default=nw=1:nk=1 "$LOOP" | tr -d '[:space:]')
CUT=$(python3 -c "print(round(float('$D')-0.6,3))")
ffmpeg -loglevel error -y -i "$LOOP" -filter_complex \
 "[0:v]split[a][b];[a]trim=0:${CUT},setpts=PTS-STARTPTS[a];\
  [b]trim=${CUT}:${D},setpts=PTS-STARTPTS[b];\
  [b][a]xfade=transition=fade:duration=0.6:offset=0,\
  scale=${W}:${H}:flags=lanczos,format=yuv420p[v]" \
 -map "[v]" -an -c:v libx264 -profile:v main -preset slow -crf 20 \
 -movflags +faststart "$OUT/$T-loop.mp4"

# ---- intro: blend the tail into the loop's first frame, in raw YUV ----------
B=$(mktemp -d)
ffmpeg -loglevel error -y -i "$OUT/$T-loop.mp4" -frames:v 1 \
  -f rawvideo -pix_fmt yuv420p "$B/l0.yuv"
NF=$(ffprobe -v error -count_frames -select_streams v:0 \
      -show_entries stream=nb_read_frames -of csv=p=0 "$INTRO" | tr -d '[:space:]')
HEAD=$((NF-10))
ffmpeg -loglevel error -y -i "$INTRO" \
  -vf "select='gte(n,${HEAD})',scale=${W}:${H}:flags=lanczos" \
  -vsync 0 -f rawvideo -pix_fmt yuv420p "$B/tail.yuv"

python3 - "$W" "$H" "$B" <<'PY'
import sys, numpy as np
W, H, B = int(sys.argv[1]), int(sys.argv[2]), sys.argv[3]
F = W * H * 3 // 2                                   # yuv420p frame size
l0   = np.frombuffer(open(f'{B}/l0.yuv','rb').read(), np.uint8).astype(np.float32)
tail = np.frombuffer(open(f'{B}/tail.yuv','rb').read(), np.uint8)
n = len(tail) // F
out = bytearray()
for k in range(n):
    A = tail[k*F:(k+1)*F].astype(np.float32)
    w = (k + 1) / n                                  # ramp into the loop frame
    out += np.clip(np.rint(A*(1-w) + l0*w), 0, 255).astype(np.uint8).tobytes()
open(f'{B}/blend.yuv','wb').write(out)
print(f"  tail frames blended: {n}")
PY

ffmpeg -loglevel error -y -i "$INTRO" \
  -f rawvideo -pix_fmt yuv420p -s "${W}x${H}" -r 24 -i "$B/blend.yuv" \
  -filter_complex \
  "[0:v]trim=end_frame=${HEAD},setpts=PTS-STARTPTS,scale=${W}:${H}:flags=lanczos,format=yuv420p[head];\
   [1:v]setpts=PTS-STARTPTS[bl];[head][bl]concat=n=2:v=1:a=0[v]" \
  -map "[v]" -an -r 24 -c:v libx264 -profile:v main -preset slow -crf 16 \
  -movflags +faststart "$OUT/$T-intro.mp4"
rm -rf "$B"

# ---- poster: the REST POSE (end of intro), never the empty first frame ------
PD=$(ffprobe -v error -show_entries format=duration -of default=nw=1:nk=1 "$OUT/$T-intro.mp4" | tr -d '[:space:]')
PT=$(python3 -c "print(max(0,float('$PD')-0.08))")
mkdir -p "$OUT/posters"
ffmpeg -loglevel error -y -ss "$PT" -i "$OUT/$T-intro.mp4" -frames:v 1 -q:v 6 \
  "$OUT/posters/$T-poster.jpg"

echo "=== outputs ==="
ls -la "$OUT/$T-intro.mp4" "$OUT/$T-loop.mp4" "$OUT/posters/$T-poster.jpg" \
  | awk '{printf "  %.2f MB  %s\n", $5/1048576, $9}'

# ---- measure the seams ------------------------------------------------------
python3 - "$T" "$W" "$H" "$OUT" <<'PY'
import sys, subprocess, tempfile, os
import numpy as np
from PIL import Image
T, W, H, OUT = sys.argv[1], int(sys.argv[2]), int(sys.argv[3]), sys.argv[4]
d = tempfile.mkdtemp()

def frames(path, pre=None, post=None, small=True):
    # pre = INPUT options (must precede -i, e.g. -sseof); post = output options
    vf = [f'scale={W//4}:{H//4}'] if small else []
    cmd = ['ffmpeg','-loglevel','error','-y'] + (pre or []) + ['-i',path] + (post or [])
    if vf: cmd += ['-vf', vf[0]]
    cmd += ['-vsync','0', os.path.join(d,'f_%04d.png')]
    subprocess.run(cmd, check=True)
    fs = sorted(f for f in os.listdir(d) if f.startswith('f_'))
    F = [np.asarray(Image.open(os.path.join(d,f)).convert('RGB'), np.float32) for f in fs]
    for f in fs: os.remove(os.path.join(d,f))
    return F

L = frames(f'{OUT}/{T}-loop.mp4')
I = frames(f'{OUT}/{T}-intro.mp4')
adj  = np.array([np.abs(L[i+1]-L[i]).mean() for i in range(len(L)-1)])
wrap = np.abs(L[0]-L[-1]).mean()
p95  = np.percentile(adj, 95)
print("\n=== seams ===")
print(f"  loop : {len(L)} frames | adjacent median {np.median(adj):.2f} "
      f"p95 {p95:.2f} max {adj.max():.2f}")
print(f"         WRAP {wrap:.2f} -> "
      f"{'invisible' if wrap <= p95 else 'within range' if wrap <= adj.max() else 'VISIBLE - regenerate'}")

iadj = np.array([np.abs(I[i+1]-I[i]).mean() for i in range(len(I)-1)])
# The last ~10 frames are OUR blend ramp into the loop's first frame, so they
# are expected to move. "Ends still" is about the source clip: measure just
# BEFORE the ramp, and compare against the intro's own typical motion.
pre_ramp = iadj[-14:-10] if len(iadj) > 16 else iadj[-4:]
still = pre_ramp.mean() <= max(0.8, np.median(iadj) * 1.1)
print(f"  intro: {len(I)} frames | motion just before the blend ramp "
      f"{pre_ramp.round(2)} (median {np.median(iadj):.2f})")
print(f"         -> {'ends still' if still else 'STILL SETTLING at the hand-off - regenerate the intro'}")
print(f"         blend ramp (ours, expected to move): {iadj[-6:].round(2)}")

L0   = frames(f'{OUT}/{T}-loop.mp4',  post=['-frames:v','1'], small=False)[0]
last = frames(f'{OUT}/{T}-intro.mp4', pre=['-sseof','-0.12'], small=False)[-1]
mean = np.abs(last-L0).mean()
signed = (last-L0).reshape(-1,3).mean(0)
print(f"  JOIN intro-last -> loop-first (full res): {mean:.2f} "
      f"signed {signed.round(2)} -> "
      f"{'clean' if mean <= max(0.9, adj.max()) else 'STEP - re-run the blend'}")
print("  (a signed offset near zero is what proves there is no brightness step)")

p = f'{OUT}/posters/{T}-poster.jpg'
if os.path.exists(p):
    a = np.asarray(Image.open(p).convert('RGB'), np.float32)
    lum = 0.2126*a[:,:,0]+0.7152*a[:,:,1]+0.0722*a[:,:,2]
    print(f"  poster: mean lum {lum.mean():.1f} std {lum.std():.1f} -> "
          f"{'has content' if lum.std() > 15 else 'LOOKS BLANK - check the source frame'}")
PY
