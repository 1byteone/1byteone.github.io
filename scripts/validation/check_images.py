from PIL import Image
from pathlib import Path
ROOT = Path(__file__).resolve().parents[2]
p = ROOT / 'assets' / 'media' / 'ai-engineering'
for f in sorted(p.glob('*.png')):
 im=Image.open(f).convert('L')
 print(f.name, im.size, round(sum(im.getdata())/(im.width*im.height),1))
