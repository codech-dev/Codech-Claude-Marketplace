#!/usr/bin/env python3
# /// script
# requires-python = ">=3.10"
# dependencies = [
#     "huggingface-hub>=0.25.0",
#     "Pillow>=10.0.0",
# ]
# ///
"""
Generate AI images for design mockup showcases using the Hugging Face Inference API.

Usage:
    uv run scripts/generate_mockup_images.py --help
    uv run scripts/generate_mockup_images.py --brand "Chez Choux bakery" --mood "warm artisan premium" --output-dir docs/design/images
    uv run scripts/generate_mockup_images.py --custom-prompt "A beautiful French patisserie storefront" --output-dir images

Requirements:
    - HF_TOKEN environment variable set (get one at https://huggingface.co/settings/tokens)
    - Free Inference API access (no paid plan required for basic usage)
"""

import argparse
import os
import sys
import json
from pathlib import Path

try:
    from huggingface_hub import InferenceClient
    from PIL import Image
except ImportError:
    print("Error: Required packages not found. Run with: uv run scripts/generate_mockup_images.py")
    sys.exit(1)

IMAGE_TEMPLATES = {
    "hero": {
        "description": "Full-width hero banner image",
        "width": 1440, "height": 640,
        "prompt_template": "Professional hero banner photograph for {brand}. {mood} aesthetic. Wide cinematic composition, shallow depth of field, studio lighting. Clean background suitable for text overlay. Commercial photography, high resolution, editorial quality. {extra}",
        "negative_prompt": "text, watermark, logo, blurry, low quality, distorted, ugly, cartoon, illustration",
    },
    "product": {
        "description": "Product showcase image",
        "width": 800, "height": 800,
        "prompt_template": "Professional product photography for {brand}. {mood} aesthetic. Clean minimalist composition on neutral background. Soft studio lighting, gentle shadows. Commercial product shot, high detail, editorial quality. {extra}",
        "negative_prompt": "text, watermark, blurry, low quality, distorted, busy background, cluttered",
    },
    "lifestyle": {
        "description": "Lifestyle/atmosphere background image",
        "width": 1200, "height": 800,
        "prompt_template": "Lifestyle photograph capturing the atmosphere of {brand}. {mood} aesthetic. Natural lighting, authentic feeling, aspirational. Environmental portrait style, bokeh background. Editorial photography, warm tones, inviting. {extra}",
        "negative_prompt": "text, watermark, blurry, low quality, artificial, stock photo feeling, generic",
    },
    "texture": {
        "description": "Background texture or pattern",
        "width": 1200, "height": 1200,
        "prompt_template": "Seamless subtle background texture for {brand}. {mood} aesthetic. Minimal, elegant, abstract. Suitable as a web background. Soft gradients, organic shapes, muted palette. {extra}",
        "negative_prompt": "text, watermark, busy, loud, high contrast, distracting, faces, objects",
    },
    "about": {
        "description": "About/team section atmospheric image",
        "width": 800, "height": 600,
        "prompt_template": "Behind-the-scenes atmospheric photograph for {brand}. {mood} aesthetic. Craftsmanship, detail, process. Warm natural lighting. Documentary style, authentic, editorial quality. {extra}",
        "negative_prompt": "text, watermark, blurry, low quality, staged, artificial",
    },
    "card": {
        "description": "Small card/thumbnail image",
        "width": 600, "height": 600,
        "prompt_template": "Square product or feature image for {brand}. {mood} aesthetic. Clean composition, single subject, well-lit. Suitable for a card thumbnail. High quality, sharp detail. {extra}",
        "negative_prompt": "text, watermark, blurry, low quality, multiple subjects, cluttered",
    },
}

RECOMMENDED_MODELS = {
    "flux-schnell": {"id": "black-forest-labs/FLUX.1-schnell", "description": "Fast, high-quality. Best default.", "speed": "fast (~5s)"},
    "flux-dev": {"id": "black-forest-labs/FLUX.1-dev", "description": "Higher quality, slower. Best for hero images.", "speed": "medium (~15s)"},
    "sdxl": {"id": "stabilityai/stable-diffusion-xl-base-1.0", "description": "Stable Diffusion XL. Good all-rounder.", "speed": "medium (~10s)"},
}


def generate_image(client, prompt, negative_prompt="", width=1024, height=1024, model="black-forest-labs/FLUX.1-schnell"):
    max_dim = 1440
    if width > max_dim:
        ratio = max_dim / width; width = max_dim; height = int(height * ratio)
    if height > max_dim:
        ratio = max_dim / height; height = max_dim; width = int(width * ratio)
    width = (width // 8) * 8
    height = (height // 8) * 8
    return client.text_to_image(prompt=prompt, negative_prompt=negative_prompt or None, width=width, height=height, model=model)


def build_prompt(template, brand, mood, extra=""):
    return template["prompt_template"].format(brand=brand, mood=mood, extra=extra)


def generate_batch(brand, mood, image_types, output_dir, model, extra_context="", count_per_type=1):
    token = os.environ.get("HF_TOKEN")
    if not token:
        print("Error: HF_TOKEN environment variable not set.")
        print("Get a free token at: https://huggingface.co/settings/tokens")
        sys.exit(1)
    client = InferenceClient(token=token)
    output_dir.mkdir(parents=True, exist_ok=True)
    results = []
    for img_type in image_types:
        if img_type not in IMAGE_TEMPLATES:
            print(f"Warning: Unknown type '{img_type}', skipping. Available: {list(IMAGE_TEMPLATES.keys())}")
            continue
        template = IMAGE_TEMPLATES[img_type]
        for i in range(count_per_type):
            suffix = f"-{i+1}" if count_per_type > 1 else ""
            filename = f"{img_type}{suffix}.png"
            filepath = output_dir / filename
            prompt = build_prompt(template, brand, mood, extra_context)
            print(f"\n  Generating: {filename} ({template['description']}, {template['width']}x{template['height']})")
            print(f"  Prompt: {prompt[:100]}...")
            try:
                image = generate_image(client, prompt, template["negative_prompt"], template["width"], template["height"], model)
                image.save(filepath)
                print(f"  Saved: {filepath}")
                results.append({"type": img_type, "filename": filename, "path": str(filepath), "width": template["width"], "height": template["height"], "prompt": prompt, "model": model})
            except Exception as e:
                print(f"  Error: {e}")
                results.append({"type": img_type, "filename": filename, "error": str(e)})
    return results


def main():
    parser = argparse.ArgumentParser(
        description="Generate AI images for design mockup showcases using the HF Inference API.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="Available image types: hero, product, lifestyle, texture, about, card\nAvailable models: flux-schnell (default, fast), flux-dev (higher quality), sdxl")
    parser.add_argument("--brand", type=str, help="Brand name and description")
    parser.add_argument("--mood", type=str, help="Design mood/aesthetic keywords")
    parser.add_argument("--types", type=str, default="hero,product,lifestyle,about", help="Comma-separated image types")
    parser.add_argument("--output-dir", type=str, required=True, help="Output directory")
    parser.add_argument("--model", type=str, default="flux-schnell", choices=list(RECOMMENDED_MODELS.keys()), help="Model to use")
    parser.add_argument("--count", type=int, default=1, help="Variations per type")
    parser.add_argument("--extra", type=str, default="", help="Extra context for prompts")
    parser.add_argument("--custom-prompt", type=str, help="Single custom prompt")
    parser.add_argument("--custom-width", type=int, default=1024, help="Width for custom prompt")
    parser.add_argument("--custom-height", type=int, default=1024, help="Height for custom prompt")
    parser.add_argument("--custom-filename", type=str, default="custom.png", help="Filename for custom prompt")
    parser.add_argument("--list-types", action="store_true", help="List image types")
    parser.add_argument("--list-models", action="store_true", help="List models")
    args = parser.parse_args()

    if args.list_types:
        print("\nAvailable image types:\n")
        for name, t in IMAGE_TEMPLATES.items():
            print(f"  {name:12s} {t['width']:>5d}x{t['height']:<5d}  {t['description']}")
        sys.exit(0)
    if args.list_models:
        print("\nRecommended models:\n")
        for name, info in RECOMMENDED_MODELS.items():
            print(f"  {name:16s} {info['speed']:>14s}  {info['description']}")
            print(f"  {'':16s} {info['id']}\n")
        sys.exit(0)

    output_dir = Path(args.output_dir)
    model_id = RECOMMENDED_MODELS[args.model]["id"]

    if args.custom_prompt:
        token = os.environ.get("HF_TOKEN")
        if not token:
            print("Error: HF_TOKEN not set."); sys.exit(1)
        client = InferenceClient(token=token)
        output_dir.mkdir(parents=True, exist_ok=True)
        filepath = output_dir / args.custom_filename
        print(f"\n  Generating: {args.custom_filename} ({args.custom_width}x{args.custom_height})")
        image = generate_image(client, args.custom_prompt, width=args.custom_width, height=args.custom_height, model=model_id)
        image.save(filepath)
        print(f"  Saved: {filepath}")
        manifest = [{"filename": args.custom_filename, "path": str(filepath), "prompt": args.custom_prompt, "model": model_id}]
        (output_dir / "generated-images.json").write_text(json.dumps(manifest, indent=2))
    else:
        if not args.brand or not args.mood:
            parser.error("--brand and --mood required (unless using --custom-prompt)")
        image_types = [t.strip() for t in args.types.split(",")]
        print(f"\n{'='*60}")
        print(f"  Mockup Image Generator")
        print(f"  Brand: {args.brand}")
        print(f"  Mood:  {args.mood}")
        print(f"  Types: {', '.join(image_types)}")
        print(f"  Model: {args.model}")
        print(f"  Output: {output_dir}")
        print(f"{'='*60}")
        results = generate_batch(args.brand, args.mood, image_types, output_dir, model_id, args.extra, args.count)
        (output_dir / "generated-images.json").write_text(json.dumps(results, indent=2))
        success = sum(1 for r in results if "error" not in r)
        failed = sum(1 for r in results if "error" in r)
        print(f"\n{'='*60}")
        print(f"  Done! {success} generated, {failed} failed")
        print(f"  Output: {output_dir}")
        print(f"{'='*60}")


if __name__ == "__main__":
    main()
