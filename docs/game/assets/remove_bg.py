"""
remove_bg.py — Remove white background from cartoon character PNG
Uses flood-fill from image corners + fuzzy tolerance for clean edges.
"""

from PIL import Image
import numpy as np

INPUT  = "don_clean.png"
OUTPUT = "don_transparent.png"

# Tolerance: how far from "pure white" a pixel can be and still get removed
# 0 = only exact white, 30 = near-white (shadows, anti-aliasing edge)
TOLERANCE = 30

def color_distance(c1, c2):
    """Euclidean distance between two RGB tuples."""
    return sum((a - b) ** 2 for a, b in zip(c1, c2)) ** 0.5

def remove_white_background(path_in, path_out, tolerance=TOLERANCE):
    img = Image.open(path_in).convert("RGBA")
    data = np.array(img, dtype=np.float32)

    r, g, b, a = data[..., 0], data[..., 1], data[..., 2], data[..., 3]

    # How "white" each pixel is: distance from (255, 255, 255)
    dist_from_white = np.sqrt((r - 255)**2 + (g - 255)**2 + (b - 255)**2)

    # Flood-fill mask from corners — only removes connected white regions
    # so internal white areas (apron, gloves) stay intact
    visited = np.zeros(img.size[::-1], dtype=bool)  # [H, W]
    h, w = visited.shape
    stack = []

    # Seed from all four corners
    for corner in [(0, 0), (0, w-1), (h-1, 0), (h-1, w-1)]:
        stack.append(corner)

    while stack:
        y, x = stack.pop()
        if y < 0 or y >= h or x < 0 or x >= w:
            continue
        if visited[y, x]:
            continue
        visited[y, x] = True
        if dist_from_white[y, x] <= tolerance:
            for dy, dx in [(-1,0),(1,0),(0,-1),(0,1)]:
                stack.append((y+dy, x+dx))

    # Build alpha: pixels in flood-fill mask get alpha proportional to
    # how white they are (smooth edge fade instead of hard cut)
    new_alpha = np.where(
        visited,
        np.clip((dist_from_white / tolerance) * 255, 0, 255),
        255
    ).astype(np.uint8)

    result = img.copy()
    result_data = np.array(result)
    result_data[..., 3] = new_alpha
    result = Image.fromarray(result_data, "RGBA")
    result.save(path_out)
    print(f"✅ Saved: {path_out}")
    print(f"   Input:  {path_in}")
    print(f"   Tolerance used: {tolerance}")

if __name__ == "__main__":
    remove_white_background(INPUT, OUTPUT)
