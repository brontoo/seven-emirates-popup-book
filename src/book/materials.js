import * as THREE from 'three';
const textures = new Map();
export function paperTexture(label = '') {
  if (textures.has(label)) return textures.get(label);
  const canvas = document.createElement('canvas'); canvas.width = 1024; canvas.height = 1024;
  const ctx = canvas.getContext('2d'); ctx.fillStyle = '#eee7d5'; ctx.fillRect(0, 0, 1024, 1024);
  let seed = 21; const random = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
  for (let i = 0; i < 65000; i++) { const v = Math.floor(100 + random() * 80); ctx.fillStyle = `rgba(${v},${v-8},${v-18},${random()*.075})`; ctx.fillRect(random()*1024, random()*1024, random()*2+.3, .6); }
  const gradient = ctx.createLinearGradient(0,0,1024,0); gradient.addColorStop(0,'rgba(89,65,40,.16)'); gradient.addColorStop(.09,'rgba(89,65,40,0)'); gradient.addColorStop(.9,'rgba(255,255,255,0)'); gradient.addColorStop(1,'rgba(255,255,255,.15)'); ctx.fillStyle=gradient; ctx.fillRect(0,0,1024,1024);
  if (label) { ctx.fillStyle = '#7b7765'; ctx.font = '19px Georgia'; ctx.textAlign = 'center'; ctx.fillText(label,512,944); ctx.fillStyle = '#b7ad94'; ctx.fillRect(468,906,88,1); }
  const texture = new THREE.CanvasTexture(canvas); texture.colorSpace = THREE.SRGBColorSpace; texture.anisotropy=4; textures.set(label, texture); return texture;
}
export function coverTexture() {
  if (textures.has('cover')) return textures.get('cover');
  const canvas=document.createElement('canvas'); canvas.width=768; canvas.height=1024; const c=canvas.getContext('2d');
  c.fillStyle='#46544a'; c.fillRect(0,0,768,1024); c.strokeStyle='#b9a67d'; c.lineWidth=2; c.strokeRect(50,50,668,924);
  c.textAlign='center'; c.fillStyle='#dfd0aa'; c.font='24px Georgia'; c.fillText('A STORY IN PAPER',384,290); c.font='66px Georgia'; c.fillText('The Seven',384,440); c.fillText('Emirates',384,520); c.font='20px Georgia'; c.fillText('UNITED ARAB EMIRATES',384,760);
  c.beginPath(); c.moveTo(330,625); c.lineTo(384,570); c.lineTo(438,625); c.lineTo(384,680); c.closePath(); c.stroke();
  const t=new THREE.CanvasTexture(canvas); t.colorSpace=THREE.SRGBColorSpace; t.center.set(.5,.5); t.rotation=Math.PI; textures.set('cover',t); return t;
}
