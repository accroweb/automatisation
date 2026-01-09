import json
import sys
from pathlib import Path
path = Path(sys.argv[1])
data = json.loads(path.read_text(encoding='utf-8'))
allowed = {"name","nodes","connections","active","settings","staticData","pinData"}
clean = {k:v for k,v in data.items() if k in allowed}
if "active" not in clean:
    clean["active"] = False
path.write_text(json.dumps(clean, indent=2, ensure_ascii=False), encoding='utf-8')
