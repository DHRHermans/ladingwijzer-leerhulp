"""Reproducible extraction of the supplied official PDF; no inference of permission.
Requires pdfplumber. Every record retains source page and literal cell text.
"""
import json,re,hashlib,sys
from pathlib import Path
import pdfplumber
SRC=Path(sys.argv[1] if len(sys.argv)>1 else '../adn-bron.pdf')
OUT=Path(sys.argv[2] if len(sys.argv)>2 else 'dist/products-data.js')
AX=[79.55,93.55,204.8,218.45,240,260.16,287.7,302.5,329.67,356.75,372.02,410.47,427.5,484.5,499.82,532.5]
CX=[53.5,75.3,188.37,206.92,225.81,244.48,290.17,326.51,359.34,392.18,425,454.35,478.44,498.52,531.51,564.36,585.56,618.51,651.22,687.03,707.95,745.85]
AK=['un','name','class','classification','pg','hazards','special','lq','eq','carriage','equipment','ventilation','measures','cones','extra']
CK=['un','name','class','classification','pg','hazards','shipType','tankDesign','tankType','tankEquipment','pressure','fill','density','sampling','pumpRoom','temperature','explosionGroup','explosionProtection','equipment','cones','extra']
result=[];audit=[]
# Centre-based extraction avoids duplicated text from vertically merged cells.
def cell(words,x0,y0,x1,y1):
 ws=[w for w in words if x0-0.4<=(w['x0']+w['x1'])/2<x1+0.4 and y0<=(w['top']+w['bottom'])/2<y1]
 ws.sort(key=lambda w:(round(w['top']/2)*2,w['x0']))
 lines=[]
 for w in ws:
  if not lines or abs(w['top']-lines[-1][0])>2:lines.append([w['top'],[w]])
  else:lines[-1][1].append(w)
 return '\n'.join(' '.join(w['text'] for w in sorted(ls,key=lambda w:w['x0'])) for _,ls in lines).strip()
with pdfplumber.open(SRC) as pdf:
 for table,first,last,xs,keys in [('A',392,638,AX,AK),('C',772,844,CX,CK)]:
  for n in range(first,last+1):
   p=pdf.pages[n-1];words=p.extract_words(x_tolerance=1,y_tolerance=2)
   tables=p.find_tables({'vertical_strategy':'explicit','explicit_vertical_lines':xs,'intersection_tolerance':4})
   seen=set();count=0
   for t in tables:
    for row in t.rows:
     box=row.cells[0]
     if not box or box in seen:continue
     seen.add(box);_,y0,_,y1=box
     un=re.sub(r'\s+','',cell(words,xs[0],y0,xs[1],y1))
     if not re.fullmatch(r'\d{4}',un):continue
     raw={k:cell(words,xs[j],y0,xs[j+1],y1) for j,k in enumerate(keys)}
     # Kolom 11 in A is split into three physical cells, read independently.
     if table=='A':raw['measureParts']=[cell(words,x0,y0,x1,y1) for x0,x1 in [(427.5,447),(447,466.47),(466.47,484.5)]]
     rec={'id':f'{table}-{n}-{count}','table':table,'page':n,'raw':raw}
     for k,v in raw.items():
      if isinstance(v,str):rec[k]=re.sub(r'\s+','',v) if k in ['un','class','classification','pg','eq','cones','tankDesign','tankType','fill','shipType'] else re.sub(r'\s+',' ',v).strip()
     rec['name']=re.sub(r'\b([a-zà-ÿ]+)-\s+([a-zà-ÿ]+)\b',r'\1\2',rec['name'])
     if not rec['name'] or rec['class'] not in ['1','2','3','4.1','4.2','4.3','5.1','5.2','6.1','6.2','7','8','9','']:rec['extractionWarning']=True
     result.append(rec);count+=1
   audit.append({'table':table,'page':n,'rows':count})
   if n%20==0:print(table,n,'records',len(result),flush=True)
   p.close()
obj={'edition':'ADN 2025','sourceDate':'2026-10-28','sourceSha256':hashlib.sha256(SRC.read_bytes()).hexdigest(),'records':result,'audit':audit}
OUT.write_text('window.ADN_PRODUCTS='+json.dumps(obj,ensure_ascii=False,separators=(',',':'))+';\n')
Path(str(OUT)+'.audit.json').write_text(json.dumps(audit,indent=2))
print('DONE',len(result),'A',sum(r['table']=='A' for r in result),'C',sum(r['table']=='C' for r in result),'empty', [a for a in audit if not a['rows']],flush=True)
