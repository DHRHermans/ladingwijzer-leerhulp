from pathlib import Path
import re
import base64
root=Path(__file__).resolve().parents[1]
s=(root/'dist/index.html').read_text()
s=s.replace('<link rel="stylesheet" href="style.css">','<style>'+(root/'dist/style.css').read_text()+'</style>')
s=s.replace('src="logo.png"', 'src="data:image/png;base64,'+base64.b64encode((root/'dist/logo.png').read_bytes()).decode()+'"')
files=re.findall(r'<script src="([a-z-]+\.js)" defer></script>',s)
s=re.sub(r'<script src="[a-z-]+\.js" defer></script>','',s)
blocks=[]
for f in files:
 code=(root/'dist'/f).read_text()
 code=re.sub(r'</script',r'<\\/script',code,flags=re.I)
 blocks.append('<script>'+code+'</script>')
s=s.replace('</body>','\n'.join(blocks)+'</body>')
(root/'LadingWijzer.html').write_text(s)
print('Built LadingWijzer.html:',len(s.encode()),'bytes;',len(files),'scripts')
