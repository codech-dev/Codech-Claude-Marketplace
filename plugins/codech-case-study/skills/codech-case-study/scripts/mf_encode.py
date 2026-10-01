"""Encode a Remotion JPEG sequence (+ the mixed soundtrack) into the marketing film MP4 (Mode C).

Remotion's bundled ffmpeg/ffprobe crash on some Windows PCs at the stitch step and when compositions contain <Audio>,
so we render frames only and encode with imageio-ffmpeg:

  npx remotion render src/index.ts Film out/seq --sequence --image-format=jpeg --jpeg-quality=90
  python mf_encode.py remotion/out/seq --audio audio/final_mix.wav --len 102.85 --out renders/film-v1.mp4
  python mf_encode.py remotion/out/seq --audio audio/final_mix.wav --len 102.85 --out renders/film-v1-preview.mp4 --preview
  python mf_encode.py --stills renders/film-v1.mp4 --at 3,8,13,24,34 --sheet renders/check.jpg

Remotion names frames element-%0Nd.jpeg with N = digits of the LAST frame index, so a --frames= partial render into a
folder that already holds a full render mixes widths: this script refuses mixed widths and gaps. Render into a clean folder.
--preview = 1280 wide crf 25 (fits the 30 MB SendUserFile limit). Needs imageio-ffmpeg (+ pillow for --sheet)."""
import argparse, os, re, subprocess, sys


def ffmpeg():
    import imageio_ffmpeg
    return imageio_ffmpeg.get_ffmpeg_exe()


def sequence(folder):
    files = [f for f in os.listdir(folder) if re.fullmatch(r'element-\d+\.jpe?g', f)]
    if not files:
        sys.exit(f'no element-*.jpeg frames in {folder}')
    widths = {len(re.search(r'(\d+)', f).group(1)) for f in files}
    if len(widths) > 1:
        sys.exit(f'mixed frame-number widths {sorted(widths)} in {folder}: stale frames from another render. Render into a clean folder.')
    w = widths.pop()
    nums = sorted(int(re.search(r'(\d+)', f).group(1)) for f in files)
    gaps = [n for a, b in zip(nums, nums[1:]) for n in range(a + 1, b)]
    if gaps:
        sys.exit(f'{len(gaps)} missing frames (first {gaps[:5]}) in {folder}')
    ext = files[0].rsplit('.', 1)[1]
    return os.path.join(folder, f'element-%0{w}d.{ext}'), nums[0], len(nums)


def stills(video, at, sheet):
    from PIL import Image
    ff = ffmpeg(); tmp = []
    for t in at:
        p = f'{os.path.splitext(sheet)[0]}_{t:g}.jpg'
        subprocess.run([ff, '-y', '-v', 'error', '-ss', str(t), '-i', video, '-frames:v', '1', '-vf', 'scale=640:-2', p], check=True); tmp.append(p)
    ims = [Image.open(p) for p in tmp]
    w, h = ims[0].size
    o = Image.new('RGB', (w * 2, h * ((len(ims) + 1) // 2)), 'white')
    for i, im in enumerate(ims):
        o.paste(im, ((i % 2) * w, (i // 2) * h))
    o.save(sheet, quality=78)
    for p in tmp:
        os.remove(p)
    print('contact sheet ->', sheet)


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('seq', nargs='?'); ap.add_argument('--audio'); ap.add_argument('--len', type=float)
    ap.add_argument('--out'); ap.add_argument('--fps', type=int, default=30); ap.add_argument('--crf', type=int, default=20)
    ap.add_argument('--preview', action='store_true')
    ap.add_argument('--stills', help='video to pull stills from'); ap.add_argument('--at', default='3,10,20,30,45,60'); ap.add_argument('--sheet')
    a = ap.parse_args()
    if a.stills:
        return stills(a.stills, [float(x) for x in a.at.split(',')], a.sheet or os.path.splitext(a.stills)[0] + '-sheet.jpg')
    pat, first, n = sequence(a.seq)
    print(f'{n} frames ({n / a.fps:.2f} s) from {pat}')
    cmd = [ffmpeg(), '-y', '-v', 'error', '-framerate', str(a.fps), '-start_number', str(first), '-i', pat]
    if a.audio:
        cmd += ['-i', a.audio, '-map', '0:v', '-map', '1:a']
    if a.len:
        cmd += ['-t', str(a.len)]
    if a.preview:
        cmd += ['-vf', 'scale=1280:-2', '-c:v', 'libx264', '-crf', '25', '-preset', 'slow']
    else:
        cmd += ['-c:v', 'libx264', '-crf', str(a.crf), '-preset', 'slow']
    cmd += ['-pix_fmt', 'yuv420p']
    if a.audio:
        cmd += ['-c:a', 'aac', '-b:a', '128k' if a.preview else '192k']
    cmd += ['-movflags', '+faststart', a.out]
    os.makedirs(os.path.dirname(os.path.abspath(a.out)), exist_ok=True)
    subprocess.run(cmd, check=True)
    print(f'{a.out}  {os.path.getsize(a.out) / 1e6:.1f} MB')


if __name__ == '__main__':
    main()
