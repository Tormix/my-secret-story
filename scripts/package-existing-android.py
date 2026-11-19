"""Empaqueta código Hermes nuevo sobre una base nativa propia compatible; no recompila clases nativas."""
import sys,struct,zipfile,json,hashlib,os
from pathlib import Path
base,export,out=map(Path,sys.argv[1:4])
assert hashlib.sha256(base.read_bytes()).hexdigest()=='c717f67e53afe65b69caf10978c1ac553e3d3621b37fc6390a04ced3666a24c7','Base APK no reconocida'
meta=json.loads((export/'metadata.json').read_text())['fileMetadata']['android']
bundle=(export/meta['bundle']).read_bytes()
if os.environ.get('MSS_API_KEY_FILE'):
 key=Path(os.environ['MSS_API_KEY_FILE']).read_bytes().strip()
 assert key.startswith(b'sk-') and key in bundle,'La clave esperada no está integrada en este bundle; se cancela el empaquetado'
 print('Clave solicitada verificada dentro del bundle; valor oculto')
with zipfile.ZipFile(base) as src:
 old=src.read('assets/index.android.bundle');assert bundle[:12]==old[:12],'Bytecode Hermes incompatible'
 config=json.loads(src.read('assets/app.config'));assert config['sdkVersion']=='58.0.0'
 manifest=bytearray(src.read('AndroidManifest.xml'));strings=[];pos=8;changed=False
 while pos<len(manifest):
  kind,header,size=struct.unpack_from('<HHI',manifest,pos)
  if kind==1:
   count=struct.unpack_from('<I',manifest,pos+8)[0];flags,start=struct.unpack_from('<II',manifest,pos+16)
   for i in range(count):
    off=pos+start+struct.unpack_from('<I',manifest,pos+header+i*4)[0]
    if flags&256:
     def length(o):
      n=manifest[o];return (((n&127)<<8)|manifest[o+1],o+2) if n&128 else (n,o+1)
     _,off=length(off);n,off=length(off);strings.append(bytes(manifest[off:off+n]).decode())
    else:
     n=struct.unpack_from('<H',manifest,off)[0];strings.append(bytes(manifest[off+2:off+2+n*2]).decode('utf-16-le'))
  if kind==0x102:
   attrstart,attrsize,count=struct.unpack_from('<HHH',manifest,pos+24)
   for i in range(count):
    a=pos+16+attrstart+i*attrsize;name=struct.unpack_from('<I',manifest,a+4)[0]
    if strings[name]=='versionCode':struct.pack_into('<I',manifest,a+16,11);changed=True
  assert size>0;pos+=size
 assert changed
 manifest=bytes(manifest).replace(b'1.4.0',b'1.4.6').replace('1.4.0'.encode('utf-16-le'),'1.4.6'.encode('utf-16-le'))
 config['version']='1.4.6';config['android']['versionCode']=11
 with zipfile.ZipFile(out,'w',zipfile.ZIP_DEFLATED,compresslevel=6) as dest:
  for info in src.infolist():
   name=info.filename
   if name.startswith('META-INF/') and (name.endswith(('.SF','.RSA','.DSA','.EC')) or name=='META-INF/MANIFEST.MF'):continue
   data=src.read(name)
   if name=='AndroidManifest.xml':data=manifest
   elif name=='assets/index.android.bundle':data=bundle
   elif name=='assets/app.config':data=json.dumps(config,separators=(',',':')).encode()
   dest.writestr(info,data)
print('APK actualizado; falta alinear y firmar:',out)
