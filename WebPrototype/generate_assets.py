import base64
import os

files = {
    "tomato": "tomato.png",
    "cheese": "cheese.png",
    "mushroom": "mushroom.png",
    "basil": "basil.png",
    "pizza": "pizza_reward_v2.png"
}

output_js = "const BASE64_ASSETS = {\n"

for tag, filename in files.items():
    if os.path.exists(filename):
        with open(filename, "rb") as f:
            b64 = base64.b64encode(f.read()).decode("utf-8")
            output_js += f'    "{tag}": "data:image/png;base64,{b64}",\n'
            print(f"Encoded {tag}")
    else:
        print(f"Missing {filename}")

output_js += "};\n"

with open("assets.js", "w", encoding="utf-8") as f:
    f.write(output_js)

print("assets.js created successfully.")
