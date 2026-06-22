import os

file_path = r"d:\00 PROGRAMANDO\guitarPizza--AntiGravity\stellar-game-studio\sgs_frontend\src\games\guitar-pizza\GuitarPizzaGame.tsx"

with open(file_path, "r", encoding="utf-8") as f:
    lines = f.readlines()

start_idx = -1
end_idx = -1

for i, line in enumerate(lines):
    if "DAILY ENGAGEMENT HUD" in line:
        start_idx = i - 1
        break

# The closing div is at the end of the quests list.
# Let's find "Vibrant Disco Music Selector Between Buttons" and walk up to find the nearest "</div>" that ends the block.
for i, line in enumerate(lines):
    if "Vibrant Disco Music Selector Between Buttons" in line:
        # Walk up to find the line containing </div> that corresponds to the end of the HUD.
        # Looking at the code:
        # 4449: })
        # 4450: </div>
        # 4451: (empty)
        # 4452: <div style={{ display: 'flex', flexDirection: 'column' ... (start of buttons)
        for j in range(i - 1, i - 30, -1):
            if "</div>" in lines[j] and "style=" not in lines[j] and "button" not in lines[j]:
                end_idx = j
                break
        break

if start_idx != -1 and end_idx != -1:
    print(f"Found block from line {start_idx} to {end_idx}")
    
    # Delete the block
    new_lines = lines[:start_idx] + lines[end_idx+1:]
    with open(file_path, "w", encoding="utf-8") as f:
        f.writelines(new_lines)
    print("Success: Programmatically removed Daily HUD from lobby.")
else:
    print(f"Error: Could not find block indexes. start_idx={start_idx}, end_idx={end_idx}")
