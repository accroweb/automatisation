# -*- coding: utf-8 -*-
from pathlib import Path
import json
path = Path('Tools/workflow-upload.json')
data = json.loads(path.read_text(encoding='utf-8'))
data.pop('pinData', None)
path.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding='utf-8')
