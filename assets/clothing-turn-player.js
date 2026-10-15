/* Optional canvas turn player. No frames => existing CSS 3D rack remains unchanged. */
(function(global){
'use strict';
class ClothingTurnPlayer {
 constructor(canvas, frames, options={}) {
  if (!(canvas instanceof HTMLCanvasElement)) throw new TypeError('Canvas required');
  this.canvas=canvas;this.ctx=canvas.getContext('2d',{alpha:true});
  this.urls=Array.isArray(frames)?frames.slice():[];
  this.images=new Array(this.urls.length);
  this.loaded=new Set();this.target=0;this.position=0;
  this.duration=Math.max(250,options.duration||1100);
  this.motion=!(global.matchMedia&&global.matchMedia('(prefers-reduced-motion: reduce)').matches);
  this.raf=0;this.last=0;this.destroyed=false;
  this.canvas.width=options.size||480;this.canvas.height=options.size||480;
 }
 async preload(){
  if(!this.urls.length) return false;
  const results=await Promise.all(this.urls.map((url,i)=>new Promise(resolve=>{
   const img=new Image();img.decoding='async';
   img.onload=()=>{this.images[i]=img;this.loaded.add(i);resolve(true)};
   img.onerror=()=>resolve(false);img.src=url;
  })));
  if(this.destroyed)return false;
  if(!results.every(Boolean))return false; // Never hide the CSS fallback on partial downloads
  this.render();return true;
 }
 render(){
  const i=Math.max(0,Math.min(this.images.length-1,Math.round(this.position)));
  const img=this.images[i];if(!img)return;
  const c=this.ctx,w=this.canvas.width,h=this.canvas.height;
  c.clearRect(0,0,w,h);c.drawImage(img,0,0,w,h);
 }
 setOpen(open){
  if(this.destroyed||this.loaded.size!==this.urls.length)return;
  this.target=open?this.images.length-1:0;
  if(!this.motion){this.position=this.target;this.render();return;}
  if(!this.raf){this.last=0;this.raf=requestAnimationFrame(t=>this.tick(t));}
 }
 tick(now){
  if(this.destroyed)return;
  const dt=this.last?Math.min(64,now-this.last):16;this.last=now;
  const delta=(this.images.length-1)*dt/this.duration;
  this.position+=Math.sign(this.target-this.position)*Math.min(Math.abs(this.target-this.position),delta);
  this.render();
  if(Math.abs(this.target-this.position)>0.01)this.raf=requestAnimationFrame(t=>this.tick(t));
  else {this.raf=0;this.last=0;}
 }
 destroy(){this.destroyed=true;if(this.raf)cancelAnimationFrame(this.raf);this.images=[];this.loaded.clear();}
}
global.ClothingTurnPlayer=ClothingTurnPlayer;
})(window);
