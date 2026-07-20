from PIL import Image
import os
import sys

def compress_images(directory):
    files = [f for f in os.listdir(directory) if f.lower().endswith(('.png', '.jpg', '.jpeg'))]
    total = len(files)
    processed = 0
    
    print(f"Discovered {total} images to process in {directory}")

    for filename in files:
        filepath = os.path.join(directory, filename)
        try:
            with Image.open(filepath) as img:
                original_size = os.path.getsize(filepath)
                
                # Resize if larger than 512x512
                if img.width > 512 or img.height > 512:
                    img.thumbnail((512, 512))
                
                # Save with optimization
                if filename.lower().endswith('.png'):
                     img.save(filepath, optimize=True)
                else:
                    img.save(filepath, optimize=True, quality=80)
                
                new_size = os.path.getsize(filepath)
                processed += 1
                print(f"[{processed}/{total}] Compressed {filename}: {original_size/1024:.1f}KB -> {new_size/1024:.1f}KB")
        except Exception as e:
            print(f"Error processing {filename}: {e}")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        target_dir = sys.argv[1]
    else:
        target_dir = '.'
    
    # Check if PIL is installed, if not, try to install
    try:
        import PIL
    except ImportError:
        print("Pillow not found. Please run 'pip install Pillow' first.")
        sys.exit(1)

    compress_images(target_dir)
