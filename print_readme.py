import sys
from pathlib import Path
path = Path('README.md')
text = path.read_text(encoding='cp1252').splitlines()
sys.stdout.reconfigure(encoding='utf-8')
for i, line in enumerate(text[:60], start=1):
    print(f"{i:03}: {line}")
