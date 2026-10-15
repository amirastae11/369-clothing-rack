/* 369 Clothing enhanced garment motion.
   Genuine photos are segmented to transparent imagery; side view remains a CSS approximation.
   The existing Mkurugenzi CSS 3D engine and UI remain the fallback. */
(function(){
'use strict';
const keys=['369-01','369-02','369-04'];
const base=(window.H369CutoutBase||'/garments/').replace(/\/$/,'')+'/';
const images=new Map();
let patched=false;
const root=document.querySelector('.mkr');
function upgrade(){
  if(patched)return;
  const rack=root&&root.__rack;
  if(!rack)return;
  patched=true;
  const originalImg=rack.imgTag,originalRail=rack.renderRail;
  rack.imgTag=function(p,cls,side){
    if(cls==='mkr-img'&&images.has(p.key)){
      return '<img class="mkr-rack-cutout" src="'+images.get(p.key)+'" alt="'+String(p.name||'').replace(/"/g,'&quot;')+'" draggable="false" decoding="async">';
    }
    return originalImg.call(this,p,cls,side);
  };
  rack.renderRail=function(){
    originalRail.apply(this,arguments);
    Array.from(this.rackEl.children).forEach((slot,i)=>{
      const p=this.visible&&this.visible[i];
      slot.classList.add('is-photo-turn');
      slot.classList.toggle('is-photo-3d',!!p&&images.has(p.key));
    });
  };
  rack.renderRail();
  let selectedTouchKey=null,touchKey=null;
  rack.rackEl.addEventListener('pointerdown',e=>{
    if(e.pointerType!=='touch')return;
    const btn=e.target.closest('.mkr-item');
    touchKey=btn?btn.getAttribute('data-i'):null;
  },true);
  rack.rackEl.addEventListener('click',e=>{
    if(touchKey===null)return;
    const btn=e.target.closest('.mkr-item');
    if(!btn)return;
    const idx=btn.getAttribute('data-i');
    touchKey=null;
    if(idx!==selectedTouchKey){
      selectedTouchKey=idx;
      e.preventDefault();e.stopImmediatePropagation();
      rack.setActive(Number(idx));
      return false;
    }
    selectedTouchKey=null;
  },true);
  root.addEventListener('click',e=>{
    if(e.target.closest('.mkr-tab'))selectedTouchKey=null;
  },true);
}
function start(){
 if(!root)return;
 upgrade();
 Promise.all(keys.map(key=>new Promise(resolve=>{
   const url=base+key+'.webp',test=new Image();
   test.onload=()=>{images.set(key,url);resolve(true)};
   test.onerror=()=>resolve(false);
   test.src=url;
 }))).then(()=>{const rack=root.__rack;if(rack)rack.renderRail();});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);
else start();
})();
