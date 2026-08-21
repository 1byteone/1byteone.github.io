from PIL import Image
from pathlib import Path
p=Path('assets/media/ai-engineering')
for f in sorted(p.glob('*.png')):
 im=Image.open(f).convert('L')
 print(f.name, im.size, round(sum(im.getdata())/(im.width*im.height),1))
