import json
from pathlib import Path
path=Path('Tools/workflow-upload.json')
data=json.loads(path.read_text(encoding='utf-8'))
for node in data['nodes']:
    print(node.get('id'), node.get('name'), node.get('type'), node.get('typeVersion'))
