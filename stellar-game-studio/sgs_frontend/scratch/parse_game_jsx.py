import re

# Read the UTF-16LE file
with open(r'd:\00 PROGRAMANDO\guitarPizza--AntiGravity\stellar-game-studio\sgs_frontend\src\games\guitar-pizza\GuitarPizzaGame.tsx', 'r', encoding='utf-8', errors='ignore') as f:
    content = f.read()

print(f"Total length of file: {len(content)} chars")

matches = [m.start() for m in re.finditer(r'return\s*\(', content)]
print(f"Found {len(matches)} return ( statements:")
for idx, pos in enumerate(matches):
    snippet = content[pos:pos+300]
    # Encode with ascii ignore to avoid print errors
    safe_snippet = snippet.encode('ascii', errors='ignore').decode('ascii')
    print(f"Match {idx} at position {pos}:\n{safe_snippet}\n" + "-"*50)
