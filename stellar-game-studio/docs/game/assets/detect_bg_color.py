"""
detect_bg_color.py — Detect the background color of SuperPizza.png
Samples the 4 corners to identify the background color.
"""
from PIL import Image
import numpy as np
import os

DECORACION_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "decoracion")
IMAGE = os.path.join(DECORACION_DIR, "SuperPizza.png")

img = Image.open(IMAGE).convert("RGBA")
data = np.array(img)
h, w = data.shape[:2]

# Sample corners (5x5 area each)
corners = {
    "top-left":     data[0:5, 0:5],
    "top-right":    data[0:5, w-5:w],
    "bottom-left":  data[h-5:h, 0:5],
    "bottom-right": data[h-5:h, w-5:w],
}

print(f"Image: {IMAGE}")
print(f"Size: {w}x{h}")
print(f"Mode: {img.mode}")
print()
for name, patch in corners.items():
    avg = patch.mean(axis=(0,1))
    print(f"{name}: R={avg[0]:.0f} G={avg[1]:.0f} B={avg[2]:.0f} A={avg[3]:.0f}")
