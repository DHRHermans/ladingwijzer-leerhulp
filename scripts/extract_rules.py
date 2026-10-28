"""Index literal paragraphs and code explanations, preserving page provenance."""
import re,json,sys
from pathlib import Path
import pdfplumber,fitz
with fitz.open('adn-bron.pdf') as pdf:
 pages=[p.get_text(sort=True) for p in pdf]
starts={1:12,2:157,3:383,4:961,5:963,6:1041,7:1043,8:1109,9:1140}
rules={};active=None
for n,page in enumerate(pages,1):
 if n<40 or 392<=n<=753 or 772<=n<=844:active=None;continue
 for line in page.splitlines():
  if re.fullmatch(r'\s*-\s*(\d+\s*-)?\s*',line):continue
  m=re.match(r'^\s*([1-9](?:\.\d{1,3}){1,7})\s+(.*)',line)
  if m and n>=starts[int(m[1][0])]:
   key=m[1]
   if key not in rules:rules[key]={'page':n,'lines':[line.strip()]};active=key
   else:active=None
  elif active:rules[active]['lines'].append(line.rstrip())
for k,v in rules.items():v['text']='\n'.join(v.pop('lines')).strip()
# BP numbers are in monotonically increasing order in 3.3.1; indented lists
# are not accepted as a new BP number. Keep full content between headings.
bps={};active=None;last=0
for n in range(878,950):
 for line in pages[n-1].splitlines():
  if re.fullmatch(r'\s*-\s*(\d+\s*-)?\s*',line):continue
  m=re.match(r'^\s*(\d{2,3})\s{2,}(.+)',line)
  if m and int(m[1])>last:
   last=int(m[1]);active=m[1];bps[active]={'page':n,'lines':[m[2]]}
  elif active:bps[active]['lines'].append(line.rstrip())
for v in bps.values():v['text']='\n'.join(v.pop('lines')).strip()
# Code definitions stop at the next code or numbered ADN paragraph.
codes={};active=None
for n,page in enumerate(pages,1):
 if n<1000:continue
 for line in page.splitlines():
  if re.fullmatch(r'\s*-\s*(\d+\s*-)?\s*',line):continue
  m=re.match(r'^\s*((?:CO|ST|RA|VE|LO|HA|IN)\d{2})\s*:?\s+(.*)',line)
  if m:active=m[1];codes[active]={'page':n,'lines':[m[2]]}
  elif re.match(r'^\s*[1-9](?:\.\d+){2,}\s',line):active=None
  elif active:codes[active]['lines'].append(line.rstrip())
for v in codes.values():v['text']='\n'.join(v.pop('lines')).strip()
# C column 20 note headings share x=186pt. Nested numbered lists are indented.
notes={};active=None
with pdfplumber.open('adn-bron.pdf') as pdf:
 for n in range(757,772):
  p=pdf.pages[n-1];ws=p.extract_words(x_tolerance=1,y_tolerance=2);lines=[]
  for w in sorted(ws,key=lambda w:(round(w['top']/2)*2,w['x0'])):
   if w['top']>745:continue
   if not lines or abs(w['top']-lines[-1][0])>2:lines.append([w['top'],[w]])
   else:lines[-1][1].append(w)
  for _,words in lines:
   words.sort(key=lambda w:w['x0']);first=words[0];txt=' '.join(w['text'] for w in words)
   m=re.fullmatch(r'(\d{1,2})\.?',first['text'])
   if m and abs(first['x0']-186)<1:
    active=m[1];notes[active]={'page':n,'lines':[txt]}
   elif active:notes[active]['lines'].append(txt)
for v in notes.values():v['text']='\n'.join(v.pop('lines')).strip()
# C footnotes follow the table, before 3.2.3.3. Preserve as a single context.
with fitz.open('adn-bron.pdf') as pdf:
 footnotes=pdf[844].get_text()
obj={'rules':rules,'special':bps,'codes':codes,'notes':notes,'footnotes':{'page':845,'text':footnotes}}
Path('adn-loket/dist/regulations-data.js').write_text('window.ADN_REGULATIONS='+json.dumps(obj,ensure_ascii=False,separators=(',',':'))+';\n')
print('paragraphs',len(rules),'BP',len(bps),'codes',len(codes),'C notes',len(notes), sorted(notes,key=int))
print('BP gasoline',{k:bps.get(k,{}).get('text','MISSING')[:130] for k in ['243','534','279','802','640']})
