import os

file_path = r"d:\00 PROGRAMANDO\guitarPizza--AntiGravity\stellar-game-studio\sgs_frontend\src\games\guitar-pizza\GuitarPizzaGame.tsx"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

target = """                                        background: 'linear-gradient(135deg, #1e0505, #8B0000)',"""

# Let's search if target is present
if "background: 'linear-gradient(135deg, #1e0505, #8B0000)'," in content:
    content = content.replace(
        "background: 'linear-gradient(135deg, #1e0505, #8B0000)',",
        "background: 'linear-gradient(135deg, #160202 0%, #4a0303 100%) !important',\n                                        opacity: '1 !important',\n                                        backdropFilter: 'none !important',"
    )
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)
    print("SUCCESS: Button styled successfully!")
else:
    # Let's try matching with smaller spaces or search
    print("ERROR: Target line not found!")
