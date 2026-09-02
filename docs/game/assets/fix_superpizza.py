"""
fix_superpizza_v2.py — Smart background removal for SuperPizza.
Uses flood-fill + higher tolerance to handle the uniform salmon background.
Also handles the case where previous processing already made bg RGBA.
"""

from PIL import Image
import numpy as np
import os

ASSETS_DIR = os.path.dirname(os.path.abspath(__file__))
DECORACION_DIR = os.path.join(ASSETS_DIR, "decoracion")
INPUT  = os.path.join(DECORACION_DIR, "SuperPizza.png")
OUTPUT = os.path.join(DECORACION_DIR, "SuperPizza.png")

# Detected background color: R=255, G=140, B=125 (salmon)
BG_COLOR = np.array([255.0, 140.0, 125.0])
TOLERANCE = 60  # Higher tolerance to catch all bg shades

def process():
    print(f"Loading: {INPUT}  ({os.path.getsize(INPUT)/1024:.1f} KB)")
    img = Image.open(INPUT).convert("RGBA")
    w, h = img.size
    print(f"Dimensions: {w}x{h}")

    data = np.array(img, dtype=np.float32)
    r, g, b = data[..., 0], data[..., 1], data[..., 2]

    # Distance from bg color for every pixel
    dist = np.sqrt(
        (r - BG_COLOR[0])**2 +
        (g - BG_COLOR[1])**2 +
        (b - BG_COLOR[2])**2
    )

    # Flood-fill from all 4 corners
    visited = np.zeros((h, w), dtype=bool)
    stack = [(0, 0), (0, w-1), (h-1, 0), (h-1, w-1)]
    # Also seed the entire border for robustness
    for x in range(w):
        stack.append((0, x))
        stack.append((h-1, x))
    for y in range(h):
        stack.append((y, 0))
        stack.append((y, w-1))

    while stack:
        y, x = stack.pop()
        if y < 0 or y >= h or x < 0 or x >= w:
            continue
        if visited[y, x]:
            continue
        visited[y, x] = True
        if dist[y, x] <= TOLERANCE:
            for dy, dx in [(-1,0),(1,0),(0,-1),(0,1)]:
                stack.append((y+dy, x+dx))

    # Smooth alpha at edges
    new_alpha = np.where(
        visited,
        0,   # fully transparent for bg
        255  # fully opaque for pizza
    ).astype(np.uint8)

    result_data = np.array(img)
    result_data[..., 3] = new_alpha
    result = Image.fromarray(result_data, "RGBA")
    result.save(OUTPUT, optimize=True)

    final_kb = os.path.getsize(OUTPUT)/1024
    print(f"✅ Saved: {OUTPUT}  ({final_kb:.1f} KB)")
    print(f"   BG pixels removed: {visited.sum()} / {h*w}")

if __name__ == "__main__":
    process()
