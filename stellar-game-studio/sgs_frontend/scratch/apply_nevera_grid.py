import os

file_path = r"d:\00 PROGRAMANDO\guitarPizza--AntiGravity\stellar-game-studio\sgs_frontend\src\games\guitar-pizza\GuitarPizzaGame.tsx"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

target = 'style={{ display: \'grid\', gridTemplateColumns: \'1fr 1fr\', gap: \'0.8rem\', marginBottom: \'1.2rem\' }}'
replacement = 'className="nevera-grid"'

if target in content:
    content = content.replace(target, replacement)
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)
    print("SUCCESS: Replaced successfully!")
else:
    print("ERROR: Target not found!")
