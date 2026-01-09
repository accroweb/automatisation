from pathlib import Path
import json
path = Path('Tools/workflow-upload.json')
data = json.loads(path.read_text(encoding='utf-8'))
print(list(data.keys()))
