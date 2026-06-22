import os

file_path = r"d:\00 PROGRAMANDO\guitarPizza--AntiGravity\stellar-game-studio\sgs_frontend\src\games\guitar-pizza\GuitarPizzaGame.tsx"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Replace the onClick handler on startBtn
target = 'onClick={() => setView(\'campaign\')}'
replacement = 'onClick={() => handleStartGame()}'

if target in content:
    content = content.replace(target, replacement)
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)
    print("Success: startBtn onClick replaced successfully.")
else:
    # Try with double quotes
    target2 = 'onClick={() => setView("campaign")}'
    if target2 in content:
        content = content.replace(target2, replacement)
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(content)
        print("Success: startBtn onClick replaced successfully (double quotes).")
    else:
        print("Error: Target onClick string not found in content.")
