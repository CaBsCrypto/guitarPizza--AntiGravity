"""
compress_decoracion.py — Compress all JPG/PNG in decoracion/ folder.
Resizes if larger than 1024x1024, quality 82 for JPG.
"""
from PIL import Image
import os

DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "decoracion")

def compress():
    files = [f for f in os.listdir(DIR) if f.lower().endswith(('.jpg', '.jpeg', '.png'))]
    print(f"Found {len(files)} files in {DIR}\n")
    for fname in files:
        path = os.path.join(DIR, fname)
        orig_kb = os.path.getsize(path) / 1024
        try:
            with Image.open(path) as img:
                # Resize if larger than 1024x1024
                if img.width > 1024 or img.height > 1024:
                    img = img.copy()
                    img.thumbnail((1024, 1024), Image.LANCZOS)

                if fname.lower().endswith('.png'):
                    img.save(path, optimize=True)
                else:
                    if img.mode in ('RGBA', 'P'):
                        img = img.convert('RGB')
                    img.save(path, optimize=True, quality=82)

            new_kb = os.path.getsize(path) / 1024
            saved = orig_kb - new_kb
            print(f"✅ {fname}: {orig_kb:.0f}KB → {new_kb:.0f}KB  (saved {saved:.0f}KB)")
        except Exception as e:
            print(f"❌ {fname}: ERROR — {e}")

if __name__ == "__main__":
    compress()
