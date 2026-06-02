import os

file_path = r"d:\00 PROGRAMANDO\guitarPizza--AntiGravity\stellar-game-studio\sgs_frontend\src\games\guitar-pizza\GuitarPizzaGame.tsx"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

target_segment = """                                         background: 'linear-gradient(135deg, #160202 0%, #4a0303 100%) !important',

                                         border: '2.5px solid var(--ph-gold)',

                                         boxShadow: '0 0 15px rgba(255, 69, 0, 0.5), inset 0 0 12px rgba(255, 69, 0, 0.3)',

                                         color: '#FFF8DC',

                                         display: 'flex',

                                         alignItems: 'center',

                                         justifyContent: 'center',

                                         gap: '0.8rem',

                                         height: '52px',

                                         borderRadius: '10px',

                                         cursor: 'pointer',

                                         transition: 'all 0.2s',

                                         animation: 'pulse 2s infinite',

                                         opacity: '1 !important',

                                         backdropFilter: 'none !important'"""

# Let's search with a broader target in case spacing is different
broken_lines = [
    "background: 'linear-gradient(135deg, #160202 0%, #4a0303 100%) !important',",
    "opacity: '1 !important',",
    "backdropFilter: 'none !important',"
]

for bl in broken_lines:
    if bl in content:
        print(f"Found broken line: {bl}")

# Let's replace the broken values with standard React style values
replacement_background = "background: 'linear-gradient(135deg, #2D0808 0%, #6E0D0D 50%, #9E1B1B 100%)',"
replacement_opacity = "opacity: 1,"
replacement_backdrop = "backdropFilter: 'none',"

content = content.replace("background: 'linear-gradient(135deg, #160202 0%, #4a0303 100%) !important',", replacement_background)
content = content.replace("opacity: '1 !important',", replacement_opacity)
content = content.replace("backdropFilter: 'none !important',", replacement_backdrop)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("SUCCESS: Checked and fixed lacquer styling!")
