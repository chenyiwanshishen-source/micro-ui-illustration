"""Arrange already-rendered PNGs at a shared scale. Does not render or judge SVG."""
import argparse
from pathlib import Path
from PIL import Image
p=argparse.ArgumentParser(description=__doc__)
p.add_argument('output');p.add_argument('images',nargs='+');p.add_argument('--width',type=int,default=448);p.add_argument('--height',type=int,default=224)
a=p.parse_args()
if min(a.width,a.height)<1:raise SystemExit('Positive tile dimensions required')
sheet=Image.new('RGB',(a.width*len(a.images),a.height),(248,249,250))
for i,name in enumerate(a.images):
 with Image.open(name) as src:
  im=src.convert('RGBA');im.thumbnail((a.width,a.height),Image.Resampling.LANCZOS)
  # Do not enlarge small screenshots: re-render vectors when higher resolution is needed.
  x=i*a.width+(a.width-im.width)//2;y=(a.height-im.height)//2
  sheet.paste(im,(x,y),im)
sheet.save(a.output)
print(Path(a.output).resolve())
