import os

workspace_path = r"d:\00 PROGRAMANDO\guitarPizza--AntiGravity"
artifacts_path = r"C:\Users\cabs_\.gemini\antigravity\brain\f48571f8-e5df-4582-98a3-fff57663c76e"

print("Checking workspace path...")
for root, dirs, files in os.walk(workspace_path):
    for f in files:
        if "audit" in f.lower() or "security" in f.lower():
            print(f"FOUND in workspace: {os.path.join(root, f)}")

print("Checking artifacts path...")
for root, dirs, files in os.walk(artifacts_path):
    for f in files:
        if "audit" in f.lower() or "security" in f.lower():
            print(f"FOUND in artifacts: {os.path.join(root, f)}")
