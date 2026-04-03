// macera.js — Koloni Günlükleri: Ana Sayfa
// Canvas tabanlı 3D sahne + hikaye bölümleri

// ── CANVAS KOLONİ SAHNESİ ────────────────────────────────

const _CT = {
  default: {sky:['#000810','#071428','#122040','#1a2e52'],t1:'#16283a',t2:'#0e1e2e',t3:'#091522',t4:'#06101a',rk1:'#1e3448',rk2:'#142436',rk3:'#0e1c2c',fog:'rgba(20,50,110,0.28)',glo:'rgba(60,140,255,0.2)',star:'#ffffff',aur:null},
  mars:    {sky:['#080100','#1e0500','#3d0d04','#5e1a08'],t1:'#3d1a0a',t2:'#2e1006',t3:'#1e0a04',t4:'#140602',rk1:'#4a2010',rk2:'#381508',rk3:'#281006',fog:'rgba(90,25,8,0.32)',glo:'rgba(240,80,20,0.18)',star:'#ffb090',aur:'rgba(255,60,15,0.12)'},
  buz:     {sky:['#010c18','#052038','#0c3c58','#165878'],t1:'#1a3e58',t2:'#102e44',t3:'#0a2030',t4:'#061420',rk1:'#244e68',rk2:'#1a3a50',rk3:'#102838',fog:'rgba(15,75,130,0.32)',glo:'rgba(60,200,255,0.18)',star:'#b8e4ff',aur:'rgba(50,185,255,0.14)'},
  nebula:  {sky:['#040110','#0e0628','#200c48','#341460'],t1:'#200a40',t2:'#160630',t3:'#0e0420',t4:'#080214',rk1:'#2e1050',rk2:'#200a3a',rk3:'#180828',fog:'rgba(55,8,100,0.32)',glo:'rgba(160,50,255,0.2)',star:'#dbb0ff',aur:'rgba(155,35,255,0.16)'},
  altin:   {sky:['#0a0800','#181400','#282000','#382c04'],t1:'#2e2808',t2:'#221e04',t3:'#181400',t4:'#100e00',rk1:'#3a3010',rk2:'#2c2408',rk3:'#201a04',fog:'rgba(70,55,5,0.28)',glo:'rgba(225,175,20,0.2)',star:'#ffe890',aur:'rgba(210,165,15,0.12)'},
  orman:   {sky:['#020a02','#082008','#104018','#186028'],t1:'#102a10',t2:'#0a1e0a',t3:'#061406',t4:'#040e04',rk1:'#183818',rk2:'#102810',rk3:'#0a1c0a',fog:'rgba(10,60,15,0.32)',glo:'rgba(60,200,80,0.18)',star:'#c8ffcc',aur:'rgba(60,220,80,0.13)'},
  karanlik:{sky:['#000005','#050510','#0a0a1a','#101020'],t1:'#0e0e20',t2:'#0a0a18',t3:'#060610',t4:'#020208',rk1:'#181828',rk2:'#101018',rk3:'#0a0a14',fog:'rgba(8,8,30,0.4)',glo:'rgba(80,80,200,0.15)',star:'#aaaaff',aur:null},
};

function _makeTerrainLine(n, seed, amp, freq, baseY) {
  const pts = [], step = 800 / (n - 1);
  for (let i = 0; i < n; i++) {
    const s = seed + i * freq;
    const h = amp * (Math.sin(s*1.0)*0.45 + Math.sin(s*2.3+1.2)*0.28 + Math.sin(s*5.1+0.7)*0.15 + Math.sin(s*11.7+2.1)*0.08 + Math.sin(s*23.0+0.4)*0.04);
    pts.push({ x: i * step, y: baseY + h });
  }
  return pts;
}
const _HOR = 170;
const _TERRAIN = [
  _makeTerrainLine(80, 3.1, 28, 0.14, _HOR + 8),
  _makeTerrainLine(80, 7.4, 38, 0.11, _HOR + 40),
  _makeTerrainLine(80, 1.9, 48, 0.09, _HOR + 80),
  _makeTerrainLine(80, 5.7, 58, 0.07, _HOR + 130),
];
const _CRATERS = [
  {x:96, y:_HOR+95, rx:22,ry:7},{x:304,y:_HOR+150,rx:35,ry:11},
  {x:488,y:_HOR+110,rx:18,ry:6},{x:624,y:_HOR+170,rx:28,ry:9},
  {x:720,y:_HOR+90, rx:14,ry:5},{x:40, y:_HOR+180,rx:20,ry:7},
  {x:416,y:_HOR+200,rx:42,ry:13},
];
const _PEBBLES = Array.from({length:55}, (_,i) => ({
  x:(i*137.5+23)%800, y:_HOR+10+((i*97.3+11)%250),
  w:2+((i*3.7)%9), h:1.5+((i*2.1)%5), layer:((i*0.137)%1)
}));
const _STARS_DATA = Array.from({length:110}, (_,i) => ({
  x:(i*71.3+13)%800, y:(i*43.7+7)%(_HOR-8),
  r:i%14===0?1.8:0.4+((i*0.23)%1),
  a:0.25+((i*0.17)%0.75), spd:1.2+((i*0.11)%4), ph:((i*1.37)%(Math.PI*2))
}));

let _cvTick = 0;
let _cvRaf = null;
let _cvSmokes = [];
let _cvMeteors = [];
let _cvWinStates = {};

function _cvGetTheme() {
  const data = loadColonyData();
  const key = data.tema && _CT[data.tema] ? data.tema : 'default';
  return _CT[key];
}

function _cvPuff(x, y) {
  _cvSmokes.push({x, y, vx:(Math.random()-.5)*.45, vy:-.65-Math.random()*.4, r:2.5, a:.38, life:1});
}
function _cvMeteorSpawn() {
  _cvMeteors.push({x:Math.random()*480+80, y:Math.random()*55, vx:2.8+Math.random()*2.5, vy:1.3+Math.random()*.8, a:1, len:35+Math.random()*28});
}
function _cvWinOn(id) {
  if (!_cvWinStates[id]) _cvWinStates[id] = {on:Math.random()>.12, t:50+Math.floor(Math.random()*300)};
  return _cvWinStates[id].on;
}

function _r3d(c, x, y, w, h, col, brd) {
  c.fillStyle=col; c.fillRect(x,y,w,h);
  const sw=Math.max(w*.05,3);
  c.fillStyle='rgba(0,0,0,0.38)'; c.fillRect(x+w,y+sw*.6,sw,h-sw*.6);
  c.fillStyle='rgba(255,255,255,0.05)'; c.fillRect(x,y,w,2);
  c.strokeStyle=brd; c.lineWidth=.8; c.strokeRect(x+.4,y+.4,w-.8,h-.8);
  c.fillStyle='rgba(0,0,0,.28)'; c.fillRect(x,y+h-1,w,2);
}
function _win(c, x, y, w, h, col, on, tick) {
  c.fillStyle='rgba(0,0,0,.55)'; c.fillRect(x-1,y-1,w+2,h+2);
  if (on) {
    const g=c.createRadialGradient(x+w/2,y+h/2,0,x+w/2,y+h/2,w*1.2);
    g.addColorStop(0,col+'ff'); g.addColorStop(.6,col+'99'); g.addColorStop(1,col+'00');
    c.fillStyle=g; c.fillRect(x,y,w,h);
    c.save(); c.globalAlpha=.09+.06*Math.sin(tick*.04);
    const og=c.createRadialGradient(x+w/2,y+h/2,0,x+w/2,y+h/2,w*4);
    og.addColorStop(0,col); og.addColorStop(1,'transparent');
    c.fillStyle=og; c.fillRect(x-w*3,y-h*3,w*7,h*7); c.restore();
  } else { c.fillStyle='rgba(8,16,28,.85)'; c.fillRect(x,y,w,h); }
}
function _wGrid(c, bx, by, bw, bh, cols, rows, acc, bid, tick) {
  const padX=bw*.12, padY=bh*.1;
  const ww=(bw-padX*2)/cols*.7, wh=(bh-padY*2)/rows*.6;
  const gapX=(bw-padX*2)/cols, gapY=(bh-padY*2)/rows;
  for (let r=0; r<rows; r++) for (let cl=0; cl<cols; cl++) {
    _win(c, bx+padX+cl*gapX, by+padY+r*gapY, ww, wh, acc, _cvWinOn(bid+'_'+r+'_'+cl), tick);
  }
}

function _drawKomuta(c, x, y, sc, tick, level) {
  const bw=95*sc, bh=110*sc, bx=x-bw/2, by=y-bh;
  _r3d(c,bx,by,bw,bh,'#122438','#2a5888');
  const sg=c.createLinearGradient(bx+bw*.46,by,bx+bw*.54,by);
  sg.addColorStop(0,'rgba(123,200,255,0.02)'); sg.addColorStop(.5,'rgba(123,200,255,0.1)'); sg.addColorStop(1,'rgba(123,200,255,0.02)');
  c.fillStyle=sg; c.fillRect(bx+bw*.46,by,bw*.08,bh);
  const w2=bw*.82,h2=28*sc; _r3d(c,bx+(bw-w2)/2,by-h2,w2,h2,'#0e2035','#255080');
  const w3=bw*.55,h3=18*sc; _r3d(c,bx+(bw-w3)/2,by-h2-h3,w3,h3,'#0a1828','#1e4070');
  const dr=bw*.38, dx=x, dy=by-h2-h3;
  const kg=c.createRadialGradient(dx-dr*.3,dy-dr*.5,0,dx,dy,dr);
  kg.addColorStop(0,'rgba(123,200,255,0.24)'); kg.addColorStop(.5,'rgba(50,120,220,0.14)'); kg.addColorStop(1,'rgba(20,60,150,0.07)');
  c.beginPath(); c.arc(dx,dy,dr,Math.PI,0); c.fillStyle=kg; c.fill();
  c.strokeStyle='#2a5888'; c.lineWidth=.9; c.stroke();
  c.save(); c.globalAlpha=.11+.06*Math.sin(tick*.03);
  c.beginPath(); c.arc(dx,dy,dr*.6,Math.PI,0); c.fillStyle='rgba(123,200,255,0.35)'; c.fill(); c.restore();
  const visRows = Math.min(5, Math.max(1, Math.ceil(level/3)));
  _wGrid(c,bx,by,bw,bh,6,visRows,'#7BC8FF','komuta',tick);
  const aH=26*sc;
  c.strokeStyle='rgba(200,225,255,0.5)'; c.lineWidth=1.2;
  c.beginPath(); c.moveTo(x,dy-dr); c.lineTo(x,dy-dr-aH); c.stroke();
  if (Math.sin(tick*.06)>.2) {
    c.save(); c.globalAlpha=.93; c.fillStyle='#ff3333';
    c.beginPath(); c.arc(x,dy-dr-aH,3*sc,0,Math.PI*2); c.fill();
    c.globalAlpha=.14; c.beginPath(); c.arc(x,dy-dr-aH,9*sc,0,Math.PI*2); c.fill(); c.restore();
  }
}

function _drawSera(c, x, y, sc, tick) {
  const bw=72*sc, bh=62*sc, bx=x-bw/2, by=y-bh;
  _r3d(c,bx,by+bh*.55,bw,bh*.45,'#0e2a18','#2a6a3a');
  c.save();
  const cg=c.createLinearGradient(bx,by,bx,by+bh*.6);
  cg.addColorStop(0,'rgba(80,180,80,0.26)'); cg.addColorStop(.5,'rgba(40,140,60,0.16)'); cg.addColorStop(1,'rgba(20,80,30,0.1)');
  c.fillStyle=cg;
  c.beginPath(); c.moveTo(bx+bw*.1,by+bh*.55); c.lineTo(x,by); c.lineTo(bx+bw*.9,by+bh*.55); c.closePath(); c.fill();
  c.strokeStyle='rgba(80,200,80,0.48)'; c.lineWidth=.8; c.stroke();
  for(let i=1;i<5;i++){
    c.strokeStyle='rgba(60,180,60,'+(0.15-i*.02)+')'; c.lineWidth=.5;
    const ly=by+bh*.55-i*(bh*.55/5);
    const lx1=bx+bw*.1+(x-bx-bw*.1)*(i/5), lx2=bx+bw*.9+(x-bx-bw*.9)*(i/5);
    c.beginPath(); c.moveTo(lx1,ly); c.lineTo(lx2,ly); c.stroke();
  }
  c.restore();
  c.save(); c.globalAlpha=.32;
  for(let i=0;i<5;i++){
    const px=bx+bw*.15+i*(bw*.16), ph=bh*.18+Math.sin(i*2.3)*bh*.06;
    c.fillStyle='rgba(40,160,50,0.55)';
    c.beginPath(); c.moveTo(px,y-bh*.46); c.lineTo(px-7*sc,y-bh*.46-ph); c.lineTo(px+7*sc,y-bh*.46-ph); c.closePath(); c.fill();
  }
  c.restore();
  _win(c,bx+bw*.15,by+bh*.65,bw*.15,bh*.12,'#97C459',true,tick);
  _win(c,bx+bw*.55,by+bh*.65,bw*.15,bh*.12,'#97C459',true,tick);
  _win(c,bx+bw*.35,by+bh*.65,bw*.15,bh*.12,'#97C459',_cvWinOn('sera_m'),tick);
  c.save(); c.globalAlpha=.06+.04*Math.sin(tick*.025);
  const gg=c.createRadialGradient(x,y-bh*.3,0,x,y-bh*.3,bw*.5);
  gg.addColorStop(0,'rgba(80,200,60,0.9)'); gg.addColorStop(1,'transparent');
  c.fillStyle=gg; c.fillRect(bx,by,bw,bh); c.restore();
}

function _drawLab(c, x, y, sc, tick) {
  const bw=58*sc, bh=72*sc, bx=x-bw/2, by=y-bh;
  _r3d(c,bx,by,bw,bh,'#241c08','#7a5a1a');
  const tr=10*sc, tx=bx-tr*.6, th=bh*.6, ty=y-th;
  c.fillStyle='#1e2c1a'; c.fillRect(tx-tr,ty,tr*2,th);
  c.strokeStyle='#3a5a2a'; c.lineWidth=.8; c.strokeRect(tx-tr,ty,tr*2,th);
  c.save(); c.fillStyle='#2a3e20'; c.beginPath(); c.ellipse(tx,ty,tr,tr*.35,0,0,Math.PI*2); c.fill(); c.strokeStyle='#3a5a2a'; c.stroke(); c.restore();
  const tx2=bx+bw+tr*.5, th2=bh*.45, ty2=y-th2;
  c.fillStyle='#1a2418'; c.fillRect(tx2-tr*.8,ty2,tr*1.6,th2);
  c.strokeStyle='#3a5a28'; c.lineWidth=.8; c.strokeRect(tx2-tr*.8,ty2,tr*1.6,th2);
  c.save(); c.fillStyle='#243220'; c.beginPath(); c.ellipse(tx2,ty2,tr*.8,tr*.28,0,0,Math.PI*2); c.fill(); c.strokeStyle='#3a5a28'; c.stroke(); c.restore();
  c.strokeStyle='#4a3a14'; c.lineWidth=4*sc; c.beginPath(); c.moveTo(tx,y-th*.6); c.lineTo(bx,y-th*.6); c.stroke();
  c.strokeStyle='#6a5a20'; c.lineWidth=2*sc; c.beginPath(); c.moveTo(tx2-tr*.8,y-th2*.5); c.lineTo(bx+bw,y-th2*.5); c.stroke();
  c.strokeStyle='rgba(200,210,200,0.38)'; c.lineWidth=3*sc; c.beginPath(); c.moveTo(bx+bw*.7,by); c.lineTo(bx+bw*.7,by-12*sc); c.stroke();
  _wGrid(c,bx,by,bw,bh,2,3,'#FAC775','lab',tick);
  c.save(); c.globalAlpha=.055+.04*Math.sin(tick*.04);
  const lg=c.createRadialGradient(x,y-bh*.4,0,x,y-bh*.4,bw*.6);
  lg.addColorStop(0,'rgba(240,180,30,0.8)'); lg.addColorStop(1,'transparent');
  c.fillStyle=lg; c.fillRect(bx-10,by-10,bw+20,bh+10); c.restore();
}

function _drawEnerji(c, x, y, sc, tick) {
  const bw=50*sc, bh=50*sc, bx=x-bw/2, by=y-bh;
  _r3d(c,bx,by,bw,bh,'#2a1e08','#7a5a18');
  c.save(); c.translate(bx-25*sc,y-bh*.7); c.rotate(-0.25);
  for(let pi=0;pi<3;pi++){
    const py=pi*14*sc;
    c.fillStyle='#1a2a50'; c.fillRect(0,py,45*sc,11*sc);
    c.strokeStyle='#2a4a80'; c.lineWidth=.8; c.strokeRect(0,py,45*sc,11*sc);
    for(let ci=1;ci<5;ci++){ c.strokeStyle='rgba(60,100,180,0.38)'; c.lineWidth=.4; c.beginPath(); c.moveTo(ci*9*sc,py); c.lineTo(ci*9*sc,py+11*sc); c.stroke(); }
    c.save(); c.globalAlpha=.07+.05*Math.sin(tick*.03+pi); c.fillStyle='rgba(80,150,255,0.6)'; c.fillRect(0,py,45*sc,11*sc); c.restore();
  }
  c.restore();
  c.fillStyle='#302010'; c.fillRect(bx+bw*.3,by-14*sc,bw*.4,14*sc);
  c.strokeStyle='#6a4a18'; c.lineWidth=.8; c.strokeRect(bx+bw*.3,by-14*sc,bw*.4,14*sc);
  c.save(); c.fillStyle='#3a2a10'; c.beginPath(); c.ellipse(bx+bw*.5,by-14*sc,bw*.2,bw*.07,0,0,Math.PI*2); c.fill(); c.strokeStyle='#7a5a20'; c.stroke(); c.restore();
  c.save(); c.globalAlpha=.09+.07*Math.sin(tick*.05);
  const eg=c.createRadialGradient(x,y-bh*.5,0,x,y-bh*.5,bw*.7);
  eg.addColorStop(0,'rgba(255,200,30,0.9)'); eg.addColorStop(1,'transparent');
  c.fillStyle=eg; c.fillRect(bx-15,by-20,bw+30,bh+20); c.restore();
  _wGrid(c,bx,by,bw,bh,2,2,'#fde047','enerji',tick);
}

function _drawGozlem(c, x, y, sc, tick) {
  const bw=55*sc, bh=55*sc, bx=x-bw/2, by=y-bh;
  _r3d(c,bx,by,bw,bh,'#0e0e2e','#3a3a7a');
  const cylW=bw*.6, cylH=bh*.35, cylX=bx+(bw-cylW)/2, cylY=by-cylH;
  c.fillStyle='#141432'; c.fillRect(cylX,cylY,cylW,cylH); c.strokeStyle='#3a3a7a'; c.lineWidth=.8; c.strokeRect(cylX,cylY,cylW,cylH);
  const dr=cylW*.52, dx=x, dy=cylY;
  c.save();
  const dg=c.createRadialGradient(dx-dr*.2,dy-dr*.4,0,dx,dy,dr);
  dg.addColorStop(0,'rgba(165,180,252,0.33)'); dg.addColorStop(.6,'rgba(80,80,200,0.18)'); dg.addColorStop(1,'rgba(30,30,120,0.08)');
  c.beginPath(); c.arc(dx,dy,dr,Math.PI,0); c.fillStyle=dg; c.fill(); c.strokeStyle='#5a5ab0'; c.lineWidth=.9; c.stroke();
  const slitA=(tick*.008)%(Math.PI*2);
  c.globalAlpha=.68; c.fillStyle='#0a0a20';
  c.beginPath(); c.moveTo(dx,dy); c.arc(dx,dy,dr,slitA-.22,slitA+.22); c.closePath(); c.fill(); c.restore();
  c.save(); c.translate(dx,dy); c.rotate(slitA-Math.PI/2);
  c.fillStyle='#2a2a60'; c.fillRect(-3*sc,-dr*.85,6*sc,dr*.8);
  c.fillStyle='#4a4a90'; c.fillRect(-4*sc,-dr*.9,8*sc,4*sc); c.restore();
  c.save(); c.globalAlpha=.06+.05*Math.sin(tick*.04);
  const gg=c.createRadialGradient(dx,dy,0,dx,dy,dr*1.5);
  gg.addColorStop(0,'rgba(165,180,252,0.8)'); gg.addColorStop(1,'transparent');
  c.fillStyle=gg; c.fillRect(bx-10,by-dr-10,bw+20,bh+dr+10); c.restore();
  _wGrid(c,bx,by,bw,bh,2,2,'#a5b4fc','gozlem',tick);
}

function _drawYasam(c, x, y, sc, tick) {
  const bw=62*sc, bh=65*sc, bx=x-bw/2, by=y-bh;
  c.fillStyle='#0d2820';
  c.beginPath(); if(c.roundRect) c.roundRect(bx,by,bw,bh,8*sc); else c.rect(bx,by,bw,bh); c.fill();
  c.strokeStyle='#2a6a4a'; c.lineWidth=.9; c.stroke();
  const w2=bw*.7, h2=20*sc; _r3d(c,bx+(bw-w2)/2,by-h2,w2,h2,'#0a2218','#1e5035');
  const dr2=w2*.3, dxy=bx+bw/2, dyy=by-h2;
  c.save();
  const lg2=c.createRadialGradient(dxy-dr2*.3,dyy-dr2*.5,0,dxy,dyy,dr2);
  lg2.addColorStop(0,'rgba(93,202,165,0.28)'); lg2.addColorStop(1,'rgba(20,80,50,0.08)');
  c.beginPath(); c.arc(dxy,dyy,dr2,Math.PI,0); c.fillStyle=lg2; c.fill(); c.strokeStyle='#2a7a5a'; c.lineWidth=.8; c.stroke(); c.restore();
  const panW=bw*.28, panH=bh*.14;
  _win(c,bx+bw*.08,by+bh*.2,panW,panH,'#5DCAA5',true,tick);
  _win(c,bx+bw*.64,by+bh*.2,panW,panH,'#5DCAA5',_cvWinOn('ys1'),tick);
  _win(c,bx+bw*.08,by+bh*.45,panW,panH,'#5DCAA5',_cvWinOn('ys2'),tick);
  _win(c,bx+bw*.64,by+bh*.45,panW,panH,'#5DCAA5',true,tick);
  _win(c,bx+bw*.36,by+bh*.65,panW,panH,'#5DCAA5',true,tick);
  c.save(); c.globalAlpha=.07+.05*Math.sin(tick*.028);
  const yg=c.createRadialGradient(x,y-bh*.4,0,x,y-bh*.4,bw*.55);
  yg.addColorStop(0,'rgba(60,200,130,0.8)'); yg.addColorStop(1,'transparent');
  c.fillStyle=yg; c.fillRect(bx-8,by-10,bw+16,bh+10); c.restore();
}

function _drawIletisim(c, x, y, sc, tick) {
  const bw=32*sc, bh=48*sc, bx=x-bw/2, by=y-bh;
  _r3d(c,bx,by,bw,bh,'#0e1e2e','#2a5060');
  const kw=6*sc, kh=50*sc, kx=x-kw/2, ky=by-kh;
  c.fillStyle='#182838'; c.fillRect(kx,ky,kw,kh); c.strokeStyle='#2a5070'; c.lineWidth=.6; c.strokeRect(kx,ky,kw,kh);
  const ar=20*sc, ay=ky+6*sc, crot=Math.sin(tick*.01)*.12-.1;
  c.save(); c.translate(x,ay); c.rotate(crot);
  const ag=c.createRadialGradient(0,0,0,0,0,ar);
  ag.addColorStop(0,'rgba(125,211,252,0.24)'); ag.addColorStop(1,'rgba(30,100,180,0.04)');
  c.beginPath(); c.ellipse(0,0,ar,ar*.38,0,0,Math.PI); c.fillStyle=ag; c.fill();
  c.strokeStyle='rgba(125,211,252,0.52)'; c.lineWidth=.9; c.stroke();
  c.fillStyle='rgba(125,211,252,0.8)'; c.beginPath(); c.arc(0,0,2.5*sc,0,Math.PI*2); c.fill();
  c.strokeStyle='rgba(80,150,200,0.5)'; c.lineWidth=1.5*sc; c.beginPath(); c.moveTo(0,0); c.lineTo(0,kh*.25); c.stroke();
  c.restore();
  for(let r=1;r<=3;r++){
    const rad=(r*14+(tick*1.8)%(14*3))*sc;
    c.save(); c.globalAlpha=Math.max(0,0.28-rad/(55*sc));
    c.strokeStyle='rgba(125,211,252,0.6)'; c.lineWidth=.6;
    c.beginPath(); c.arc(x,ay,rad,0,Math.PI*2); c.stroke(); c.restore();
  }
  _wGrid(c,bx,by,bw,bh,2,2,'#7dd3fc','iletisim',tick);
}

function _drawBgBuilding(c, x, y, sc, col, brd, acc, aw, ah, hasAnt, hasDome, bid, tick) {
  const bx=x-aw/2, by=y-ah;
  _r3d(c,bx,by,aw,ah,col,brd);
  if(hasDome){
    const dr=aw*.3;
    c.save(); const dg=c.createRadialGradient(x,by,0,x,by,dr);
    dg.addColorStop(0,acc+'44'); dg.addColorStop(1,'transparent');
    c.beginPath(); c.arc(x,by,dr,Math.PI,0); c.fillStyle=dg; c.fill(); c.strokeStyle=brd; c.lineWidth=.6; c.stroke(); c.restore();
  }
  _wGrid(c,bx,by,aw,ah,2,2,acc,bid,tick);
  if(hasAnt){
    c.strokeStyle='rgba(180,200,240,0.38)'; c.lineWidth=.8;
    c.beginPath(); c.moveTo(x,by); c.lineTo(x,by-10*sc); c.stroke();
    if(Math.sin(tick*.07)>.3){ c.fillStyle='rgba(255,80,80,.75)'; c.beginPath(); c.arc(x,by-10*sc,1.6,0,Math.PI*2); c.fill(); }
  }
}

function _cvDraw(cv, c, T, level) {
  const CW=800, CH=420, tick=_cvTick;
  c.clearRect(0,0,CW,CH);

  const sg=c.createLinearGradient(0,0,0,_HOR+20);
  T.sky.forEach((col,i)=>sg.addColorStop(i/(T.sky.length-1),col));
  c.fillStyle=sg; c.fillRect(0,0,CW,_HOR+20);

  if(T.aur){
    c.save(); c.globalAlpha=.62+.3*Math.sin(tick*.009);
    const ag=c.createRadialGradient(CW/2,-15,0,CW/2,-15,CW*.72);
    ag.addColorStop(0,T.aur); ag.addColorStop(1,'transparent');
    c.fillStyle=ag; c.fillRect(0,0,CW,_HOR+15); c.restore();
  }

  _STARS_DATA.forEach(s=>{
    const fl=.45+.55*Math.sin(tick*.022*s.spd+s.ph);
    c.save(); c.globalAlpha=s.a*fl; c.fillStyle=T.star;
    c.beginPath(); c.arc(s.x,s.y,s.r,0,Math.PI*2); c.fill();
    if(s.r>1.2){ c.globalAlpha=s.a*fl*.28; c.beginPath(); c.arc(s.x,s.y,s.r*2.8,0,Math.PI*2); c.fill(); }
    c.restore();
  });

  for(let i=_cvMeteors.length-1;i>=0;i--){
    const m=_cvMeteors[i];
    c.save(); c.globalAlpha=m.a;
    const mg=c.createLinearGradient(m.x-m.len,m.y-m.len*.45,m.x,m.y);
    mg.addColorStop(0,'transparent'); mg.addColorStop(1,'rgba(255,255,255,0.88)');
    c.strokeStyle=mg; c.lineWidth=1.5; c.beginPath(); c.moveTo(m.x-m.len,m.y-m.len*.45); c.lineTo(m.x,m.y); c.stroke(); c.restore();
    m.x+=m.vx; m.y+=m.vy; m.a-=.014;
    if(m.a<=0) _cvMeteors.splice(i,1);
  }

  c.fillStyle=T.t4; c.fillRect(0,_HOR,CW,CH-_HOR);

  const tCols=[[T.t4,T.rk3],[T.t3,T.rk2],[T.t2,T.rk1],[T.t1,T.rk1]];
  _TERRAIN.forEach((pts,li)=>{
    const [base,hi]=tCols[li];
    const grad=c.createLinearGradient(0,_HOR,0,CH);
    grad.addColorStop(0,li===3?T.t1:base); grad.addColorStop(.5,base); grad.addColorStop(1,T.t4);
    c.fillStyle=grad;
    c.beginPath(); c.moveTo(0,CH); c.lineTo(0,pts[0].y);
    pts.forEach(p=>c.lineTo(p.x,p.y)); c.lineTo(CW,CH); c.closePath(); c.fill();
    c.beginPath(); c.moveTo(pts[0].x,pts[0].y); pts.forEach(p=>c.lineTo(p.x,p.y));
    c.strokeStyle=hi; c.lineWidth=li===3?1.4:.8; c.stroke();
    if(li===3){
      c.beginPath(); c.moveTo(pts[0].x,pts[0].y); pts.forEach(p=>c.lineTo(p.x,p.y));
      c.strokeStyle=T.glo.replace('0.2','0.12'); c.lineWidth=2.5; c.stroke();
    }
  });

  const hg=c.createLinearGradient(0,_HOR-12,0,_HOR+40);
  hg.addColorStop(0,'transparent'); hg.addColorStop(.4,T.glo); hg.addColorStop(1,'transparent');
  c.fillStyle=hg; c.fillRect(0,_HOR-12,CW,52);

  _CRATERS.forEach(cr=>{
    c.save();
    const ig=c.createRadialGradient(cr.x,cr.y,0,cr.x,cr.y+cr.ry*.3,cr.rx);
    ig.addColorStop(0,'rgba(0,0,0,0.55)'); ig.addColorStop(.6,'rgba(0,0,0,0.25)'); ig.addColorStop(1,'transparent');
    c.fillStyle=ig; c.beginPath(); c.ellipse(cr.x,cr.y,cr.rx,cr.ry,0,0,Math.PI*2); c.fill();
    c.strokeStyle=T.rk1; c.lineWidth=1.8;
    c.beginPath(); c.ellipse(cr.x,cr.y-cr.ry*.3,cr.rx*1.08,cr.ry*.55,0,Math.PI,0); c.stroke();
    c.strokeStyle='rgba(0,0,0,0.35)'; c.lineWidth=1.2;
    c.beginPath(); c.ellipse(cr.x,cr.y+cr.ry*.2,cr.rx*.85,cr.ry*.4,0,0,Math.PI); c.stroke();
    c.restore();
  });

  c.save(); c.globalAlpha=.55;
  _PEBBLES.filter(p=>p.layer<.4).forEach(p=>{
    const tg=c.createLinearGradient(p.x,p.y-p.h,p.x,p.y+p.h*.5);
    tg.addColorStop(0,T.rk1); tg.addColorStop(1,T.rk3);
    c.fillStyle=tg; c.beginPath(); c.ellipse(p.x,p.y,p.w,p.h*.5,0,0,Math.PI*2); c.fill();
    c.strokeStyle=T.rk1; c.lineWidth=.5;
    c.beginPath(); c.ellipse(p.x,p.y-p.h*.12,p.w*.8,p.h*.22,0,Math.PI,0); c.stroke();
  });
  c.restore();

  _drawBgBuilding(c,72,  _HOR+22,.42,'#0c1e30','#1a3a54','#7BC8FF',22,34,false,false,'bg1',tick);
  _drawBgBuilding(c,176, _HOR+18,.44,'#0d2030','#1e4050','#5DCAA5',20,28,true, false,'bg2',tick);
  _drawBgBuilding(c,400, _HOR+12,.4, '#0c1828','#183050','#a5b4fc',19,26,false,true, 'bg3',tick);
  _drawBgBuilding(c,584, _HOR+16,.43,'#0e1e30','#204050','#FAC775',21,30,false,false,'bg4',tick);
  _drawBgBuilding(c,720, _HOR+14,.42,'#0d1e2e','#1a3a50','#7dd3fc',18,26,true, false,'bg5',tick);

  c.save(); c.globalAlpha=.38;
  const fog1=c.createLinearGradient(0,_HOR,0,_HOR+55);
  fog1.addColorStop(0,'transparent'); fog1.addColorStop(.45,T.fog); fog1.addColorStop(1,'transparent');
  c.fillStyle=fog1; c.fillRect(0,_HOR,CW,55); c.restore();

  c.save(); c.globalAlpha=.72;
  _PEBBLES.filter(p=>p.layer>=.4&&p.layer<.7).forEach(p=>{
    const tg=c.createLinearGradient(p.x,p.y-p.h,p.x,p.y+p.h*.5);
    tg.addColorStop(0,T.rk1); tg.addColorStop(1,T.rk3);
    c.fillStyle=tg; c.beginPath(); c.ellipse(p.x,p.y,p.w,p.h*.5,0,0,Math.PI*2); c.fill();
  });
  c.restore();

  const sc1=.72;
  if(level>=2)  _drawYasam(c,80,   _HOR+55,sc1*.85,tick);
  if(level>=4)  _drawLab(c,704,  _HOR+55,sc1*.82,tick);
  if(level>=14) _drawEnerji(c,240,_HOR+50,sc1*.78,tick);
  if(level>=10) _drawGozlem(c,560,_HOR+52,sc1*.8,tick);

  c.save(); c.globalAlpha=.16; c.fillStyle=T.fog; c.fillRect(0,_HOR+35,CW,38); c.restore();

  c.save();
  _PEBBLES.filter(p=>p.layer>=.7).forEach(p=>{
    c.globalAlpha=0.85+p.layer*.12;
    const tg=c.createLinearGradient(p.x,p.y-p.h,p.x,p.y+p.h*.5);
    tg.addColorStop(0,T.rk1); tg.addColorStop(1,T.rk3);
    c.fillStyle=tg; c.beginPath(); c.ellipse(p.x,p.y,p.w*1.1,p.h*.55,0,0,Math.PI*2); c.fill();
    c.strokeStyle=T.rk1; c.lineWidth=.7;
    c.beginPath(); c.ellipse(p.x,p.y-p.h*.1,p.w*.85,p.h*.2,0,Math.PI,0); c.stroke();
    c.globalAlpha=0.3; c.fillStyle='rgba(0,0,0,0.4)';
    c.beginPath(); c.ellipse(p.x,p.y+p.h*.45,p.w*.65,p.h*.18,0,0,Math.PI*2); c.fill();
  });
  c.restore();

  if(level>=7)  _drawSera(c,152,  _HOR+100,.98,tick);
  if(level>=18) _drawIletisim(c,656,_HOR+95,.96,tick);
  _drawKomuta(c,400,_HOR+115,1.05,tick,level);

  [[400,_HOR+115,88],[152,_HOR+100,60],[656,_HOR+95,26],
   [80,_HOR+55,44],[704,_HOR+55,40],[240,_HOR+50,34],[560,_HOR+52,36]
  ].forEach(([sx,sy,sr])=>{
    c.save(); c.globalAlpha=.28;
    const sg2=c.createRadialGradient(sx,sy+3,0,sx,sy+3,sr);
    sg2.addColorStop(0,'rgba(0,0,0,0.55)'); sg2.addColorStop(1,'transparent');
    c.fillStyle=sg2; c.fillRect(sx-sr,sy-3,sr*2,18); c.restore();
  });

  for(let i=_cvSmokes.length-1;i>=0;i--){
    const s=_cvSmokes[i];
    c.save(); c.globalAlpha=s.a*s.life;
    c.fillStyle='rgba(180,200,215,0.7)';
    c.beginPath(); c.arc(s.x,s.y,s.r,0,Math.PI*2); c.fill(); c.restore();
    s.x+=s.vx; s.y+=s.vy; s.life-=.006; s.r+=.04;
    if(s.life<=0) _cvSmokes.splice(i,1);
  }
  if(tick%22===0) _cvPuff(704-8, _HOR+55-42*.82*.72);
  if(tick%31===0 && level>=14) _cvPuff(240+12, _HOR+50-35*.78);

  _cvTick++;
}

function _cvFlickerWins() {
  Object.keys(_cvWinStates).forEach(k=>{
    const ws=_cvWinStates[k]; ws.t--;
    if(ws.t<=0){ ws.on=Math.random()>.1; ws.t=80+Math.floor(Math.random()*400); }
  });
}

function _cvStop() {
  if(_cvRaf){ cancelAnimationFrame(_cvRaf); _cvRaf=null; }
}

function _cvStart(level) {
  if(_cvRaf) return;
  const flickerI = setInterval(()=>{ if(!document.getElementById('colonyCanvas')){ clearInterval(flickerI); return; } _cvFlickerWins(); }, 60);
  const meteorI  = setInterval(()=>{ if(!document.getElementById('colonyCanvas')){ clearInterval(meteorI);  return; } _cvMeteorSpawn(); }, Math.max(4000,14000-level*200));
  setTimeout(_cvMeteorSpawn, 900);
  function loop(){
    const cv=document.getElementById('colonyCanvas');
    if(!cv){ _cvRaf=null; return; }
    _cvDraw(cv, cv.getContext('2d'), _cvGetTheme(), level);
    _cvRaf=requestAnimationFrame(loop);
  }
  loop();
}

// ── maceraPage ────────────────────────────────────────────
function maceraPage() {
  const data = loadColonyData();
  const level = data.level || 1;
  const xpProg = getXpProgress(data.xp, level);
  const levelInfo = getColonyLevelInfo(level);
  const activeModules = getActiveModules(level);
  const nextMod = getNextModule(level);
  const chapters = getUnlockedChapters(level);
  const today = getTodayKey();
  const alreadyEntered = data.lastEntryDate === today;
  const recentChapters = chapters.slice().reverse().slice(0, 4);
  const newestId = recentChapters[0]?.id;
  const lockedHints = COLONY_CHAPTERS.filter(c => c.level > level).slice(0, 2);
  const streakText = data.currentStreak > 0 ? data.currentStreak + ' gün seri' : '';

  return `
    <div class="colony-wrap">
      <div style="position:relative;background:#000;border-radius:16px 16px 0 0;overflow:hidden">
        <canvas id="colonyCanvas" width="800" height="420" style="display:block;width:100%;height:auto"></canvas>

        <div style="position:absolute;top:0;left:0;right:0;pointer-events:none">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;padding:10px 13px 0">
            <div>
              <div style="font-size:17px;font-weight:700;color:#fff;text-shadow:0 0 18px rgba(80,160,255,0.9)">Seviye ${level}</div>
              <div style="font-size:9px;color:rgba(150,200,255,0.45);letter-spacing:1.2px;margin-top:2px">${(data.colonyName||'ARCADIA').toUpperCase()} KOLONİSİ</div>
              <div style="display:flex;gap:4px;margin-top:6px;flex-wrap:wrap">
                ${streakText ? `<span style="font-size:9px;padding:2px 7px;border-radius:9px;background:rgba(29,158,117,0.25);color:#5DCAA5;border:.5px solid rgba(93,202,165,0.3)">${streakText}</span>` : ''}
                ${data.honestyShield ? '<span style="font-size:9px;padding:2px 7px;border-radius:9px;background:rgba(55,138,221,0.2);color:#85B7EB;border:.5px solid rgba(133,183,235,0.3)">dürüstlük kalkanı</span>' : ''}
              </div>
            </div>
            <div style="text-align:right;color:rgba(255,255,255,0.3);font-size:9px;line-height:1.6">
              <div>Gün ${data.totalDays||0}</div>
              <div style="font-size:8px;margin-top:2px;color:rgba(255,255,255,0.18)">${levelInfo.title}</div>
            </div>
          </div>
          <div style="display:flex;align-items:center;gap:7px;padding:6px 13px 4px">
            <span style="font-size:10px;font-weight:700;color:rgba(255,255,255,0.35);min-width:32px">Sv.${level}</span>
            <div style="flex:1;height:4px;background:rgba(255,255,255,0.07);border-radius:2px;overflow:hidden">
              <div id="colonyXpBar" style="height:100%;border-radius:2px;background:linear-gradient(90deg,#185FA5,#5BBFFF);width:0%;transition:width 1s ease"></div>
            </div>
            <span style="font-size:10px;color:rgba(255,255,255,0.22);min-width:68px;text-align:right">${xpProg.current} / ${xpProg.needed} XP</span>
          </div>
        </div>

        <div style="position:absolute;bottom:10px;right:10px;display:flex;gap:5px;pointer-events:none">
          <div style="text-align:center;padding:5px 7px;background:rgba(0,0,0,0.45);border-radius:7px;border:.5px solid rgba(255,255,255,0.1);backdrop-filter:blur(4px)">
            <div style="font-size:14px;font-weight:800;color:#fff">${data.currentStreak||0}</div>
            <div style="font-size:8px;color:rgba(255,255,255,0.35)">seri</div>
          </div>
          <div style="text-align:center;padding:5px 7px;background:rgba(0,0,0,0.45);border-radius:7px;border:.5px solid rgba(255,255,255,0.1);backdrop-filter:blur(4px)">
            <div style="font-size:14px;font-weight:800;color:#fff">${activeModules.length}</div>
            <div style="font-size:8px;color:rgba(255,255,255,0.35)">modül</div>
          </div>
          <div style="text-align:center;padding:5px 7px;background:rgba(0,0,0,0.45);border-radius:7px;border:.5px solid rgba(255,255,255,0.1);backdrop-filter:blur(4px)">
            <div style="font-size:14px;font-weight:800;color:#fff">${chapters.length}</div>
            <div style="font-size:8px;color:rgba(255,255,255,0.35)">bölüm</div>
          </div>
          <div style="text-align:center;padding:5px 7px;background:rgba(0,0,0,0.45);border-radius:7px;border:.5px solid rgba(255,255,255,0.1);backdrop-filter:blur(4px)">
            <div style="font-size:14px;font-weight:800;color:#fff">${data.totalDays||0}</div>
            <div style="font-size:8px;color:rgba(255,255,255,0.35)">gün</div>
          </div>
        </div>
      </div>

      ${alreadyEntered ? `
        <div style="margin:10px 12px;padding:11px 14px;background:rgba(29,158,117,0.08);border:1px solid rgba(29,158,117,0.2);border-radius:12px;text-align:center">
          <span style="font-size:13px;color:var(--accent3);font-weight:700">✓ Bugünkü giriş tamamlandı — +${COLONY_XP_RULES.wellnessEntry} XP</span>
          <div style="font-size:11px;color:var(--text2);margin-top:3px">Yarın tekrar gel — kolonin seni bekliyor</div>
        </div>
      ` : `
        <div style="margin:10px 12px;padding:13px;background:linear-gradient(135deg,rgba(24,95,165,0.08),rgba(55,138,221,0.08));border:1px solid rgba(55,138,221,0.2);border-radius:12px;cursor:pointer" onclick="showPage('daily-entry')">
          <div style="display:flex;align-items:center;gap:10px">
            <div style="width:34px;height:34px;border-radius:50%;background:linear-gradient(135deg,#185FA5,#378ADD);display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:15px">✏️</div>
            <div style="flex:1">
              <div style="font-size:13px;font-weight:700;color:var(--text)">Bugün nasıl hissediyorsun?</div>
              <div style="font-size:11px;color:var(--text2);margin-top:2px">Giriş yap → <span style="color:#378ADD;font-weight:700">+${COLONY_XP_RULES.wellnessEntry} XP</span> kazan</div>
            </div>
            <span style="color:var(--accent);font-size:1.1rem">→</span>
          </div>
        </div>
      `}

      <div style="padding:4px 12px 16px">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
          <span style="font-size:13px;font-weight:700;color:var(--text2)">Koloni Günlükleri</span>
          <span style="font-size:11px;color:var(--text2)">${chapters.length} / ${COLONY_CHAPTERS.length} bölüm</span>
        </div>

        ${recentChapters.map(ch => `
          <div class="colony-entry" onclick="_colonyToggleChapter(this)" data-id="${ch.id}">
            ${ch.id === newestId ? '<span style="position:absolute;top:10px;right:10px;font-size:9px;padding:2px 7px;border-radius:10px;background:rgba(55,138,221,0.15);color:#378ADD;font-weight:700">Yeni</span>' : ''}
            <div style="font-size:10px;color:var(--text2);margin-bottom:3px">Bölüm ${ch.level} — ${getColonyLevelInfo(ch.level)?.title||''}</div>
            <div style="font-size:14px;font-weight:700;margin-bottom:4px">${ch.title}</div>
            <div class="colony-chapter-text" style="max-height:${ch.id===newestId?'300':'0'}px;overflow:hidden;transition:max-height 0.35s ease">
              <div style="font-size:12px;color:var(--text2);line-height:1.7;padding-top:4px">${ch.text}</div>
              ${ch.nextHint ? `<div style="font-size:11px;color:var(--accent);margin-top:8px;font-style:italic">→ ${ch.nextHint}</div>` : ''}
            </div>
          </div>
        `).join('')}

        ${chapters.length > 4 ? `
          <button onclick="_colonyShowAllChapters()" style="width:100%;padding:10px;background:var(--surface2);border:1px solid var(--border);border-radius:10px;color:var(--accent);font-size:12px;font-weight:700;cursor:pointer;margin-bottom:8px;font-family:'Nunito',sans-serif">
            Tüm bölümleri gör (${chapters.length})
          </button>
        ` : ''}

        ${lockedHints.map(ch => `
          <div style="padding:12px 14px;background:var(--surface2);border-radius:10px;margin-bottom:6px;opacity:0.5;border:1px dashed var(--border)">
            <div style="font-size:10px;color:var(--text2)">Bölüm ${ch.level} — Seviye ${ch.level}'de açılacak</div>
            <div style="font-size:13px;font-weight:700;color:var(--text2)">${ch.title.startsWith('???')?'???':ch.title}</div>
          </div>
        `).join('')}

        ${nextMod ? `
          <div style="display:flex;align-items:center;gap:10px;padding:12px 14px;background:var(--surface);border:1px solid var(--border);border-radius:12px;margin-top:8px">
            <div style="width:34px;height:34px;border-radius:50%;background:linear-gradient(135deg,#185FA5,#0F6E56);display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:14px">🔧</div>
            <div>
              <div style="font-size:12px;font-weight:700">${nextMod.name} yaklaşıyor</div>
              <div style="font-size:11px;color:var(--text2)">Seviye ${nextMod.unlockLevel}'de yeni modül + özel hikaye açılacak</div>
            </div>
          </div>
        ` : ''}
      </div>
    </div>

    <style>
      .colony-wrap{background:var(--surface);border:1px solid var(--border);border-radius:18px;overflow:hidden}
      .colony-entry{padding:14px;background:var(--surface2);border-radius:12px;margin-bottom:8px;cursor:pointer;transition:background 0.15s;border-left:3px solid var(--accent);position:relative}
      .colony-entry:active{background:var(--border)}
    </style>
  `;
}

function _colonyPostRender() {
  _cvStop();
  _cvSmokes = [];
  _cvMeteors = [];
  setTimeout(() => {
    const data = loadColonyData();
    const level = data.level || 1;
    const bar = document.getElementById('colonyXpBar');
    if (bar) {
      const prog = getXpProgress(data.xp, level);
      setTimeout(() => { bar.style.width = prog.percent + '%'; }, 150);
    }
    _cvStart(level);
  }, 50);
}

// Market tema uyumluluğu — _cvGetTheme() her frame'de okur, otomatik çalışır
function _colonyApplyTheme() {}

function _colonyToggleChapter(el) {
  const text = el.querySelector('.colony-chapter-text');
  if (!text) return;
  text.style.maxHeight = (text.style.maxHeight && text.style.maxHeight !== '0px') ? '0' : '500px';
  const id = el.dataset.id;
  if (id) {
    const data = loadColonyData();
    if (!data.chaptersRead) data.chaptersRead = [];
    if (!data.chaptersRead.includes(id)) { data.chaptersRead.push(id); saveColonyData(data); }
  }
}

function _colonyModuleClick(moduleId) {
  const mod = COLONY_MODULES.find(m => m.id === moduleId);
  if (!mod) return;
  const data = loadColonyData();
  const status = getModuleStatus(moduleId, data.level);
  const modChapters = COLONY_CHAPTERS.filter(c => c.module === moduleId && c.level <= data.level);
  const chapterList = modChapters.length > 0
    ? modChapters.map(c => `<div style="font-size:12px;padding:6px 0;border-bottom:1px solid var(--border)">📖 ${c.title}</div>`).join('')
    : '<div style="font-size:12px;color:var(--text2)">Henüz bölüm yok</div>';
  const upgradeInfo = status.upgradeLevel > 0 ? `<div style="font-size:11px;color:var(--accent);margin-top:4px">Seviye ${status.upgradeLevel} yükseltme</div>` : '';
  const modal = document.createElement('div');
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.6);z-index:9999;display:flex;align-items:center;justify-content:center;padding:20px;backdrop-filter:blur(3px)';
  modal.innerHTML = `
    <div style="background:var(--surface);border:1px solid var(--border);border-radius:18px;padding:22px 18px;width:100%;max-width:300px">
      <div style="font-size:16px;font-weight:800;margin-bottom:4px">${mod.name}</div>
      ${upgradeInfo}
      <div style="font-size:12px;color:var(--text2);margin:8px 0 14px;line-height:1.5">${mod.desc}</div>
      <div style="font-size:12px;font-weight:700;margin-bottom:8px">İlgili bölümler</div>
      ${chapterList}
      <button onclick="this.closest('div[style*=fixed]').remove()" style="width:100%;margin-top:14px;padding:10px;background:var(--surface2);border:1px solid var(--border);border-radius:10px;font-size:13px;font-weight:700;cursor:pointer;color:var(--text);font-family:'Nunito',sans-serif">Kapat</button>
    </div>`;
  modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });
  document.body.appendChild(modal);
}

function _colonyShowAllChapters() {
  const data = loadColonyData();
  const chapters = getUnlockedChapters(data.level).reverse();
  const modal = document.createElement('div');
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.6);z-index:9999;display:flex;align-items:center;justify-content:center;padding:16px;backdrop-filter:blur(3px)';
  modal.innerHTML = `
    <div style="background:var(--surface);border:1px solid var(--border);border-radius:18px;padding:18px 14px;width:100%;max-width:360px;max-height:80vh;overflow-y:auto">
      <div style="font-size:16px;font-weight:800;margin-bottom:14px">📖 Tüm Bölümler (${chapters.length})</div>
      ${chapters.map(ch => `
        <div style="padding:10px 12px;background:var(--surface2);border-radius:10px;margin-bottom:6px;cursor:pointer;border-left:3px solid var(--accent)" onclick="this.querySelector('.ch-txt').style.maxHeight=this.querySelector('.ch-txt').style.maxHeight&&this.querySelector('.ch-txt').style.maxHeight!=='0px'?'0':'500px'">
          <div style="font-size:10px;color:var(--text2)">Bölüm ${ch.level}</div>
          <div style="font-size:13px;font-weight:700">${ch.title}</div>
          <div class="ch-txt" style="max-height:0;overflow:hidden;transition:max-height 0.3s">
            <div style="font-size:12px;color:var(--text2);line-height:1.6;padding-top:6px">${ch.text}</div>
          </div>
        </div>`).join('')}
      <button onclick="this.closest('div[style*=fixed]').remove()" style="width:100%;margin-top:10px;padding:10px;background:var(--surface2);border:1px solid var(--border);border-radius:10px;font-size:13px;font-weight:700;cursor:pointer;color:var(--text);font-family:'Nunito',sans-serif">Kapat</button>
    </div>`;
  modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });
  document.body.appendChild(modal);
}
