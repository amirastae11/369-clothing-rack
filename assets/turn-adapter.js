/* 369 Clothing — lazy, opt-in animation adapter.
   The original Mkurugenzi CSS rack is never hidden before every frame has loaded.
   No third-party requests, no fake photos, and zero frame downloads for an empty manifest. */
(function (global) {
  'use strict';
  const MANIFEST_URL = '/assets/turn-manifest.json';
  const states = new Map();
  let manifest = new Map();
  let observer = null;
  let rackEl = null;
  let root = null;
  let generation = 0;
  let disposed = false;
  const style = document.createElement('style');
  style.id = 'mkr-turn-style';
  style.textContent = [
    '.mkr-slot.has-canvas-turn .mkr-face{visibility:hidden!important}',
    '.mkr-slot .mkr-turn-canvas{position:absolute;top:0;left:50%;transform:translateX(-50%);display:block;width:100%;height:auto;aspect-ratio:1/1;pointer-events:none}',
    '.mkr-slot.has-canvas-turn .mkr-garment{overflow:visible}',
    '@media(prefers-reduced-motion:reduce){.mkr-slot.has-canvas-turn .mkr-swing{animation:none!important}}'
  ].join('');
  function valid(item) {
    return !!item && item.verified === true && typeof item.name === 'string' &&
      Array.isArray(item.frames) && item.frames.length >= 2 && item.frames.length <= 120 &&
      item.frames.every(url => typeof url === 'string' &&
        /^\/assets\/turns\/[a-zA-Z0-9_-]+\/\d{3}\.webp$/.test(url));
  }
  function disposeStates() {
    for (const item of states.values()) {
      item.destroyed = true;
      item.button.removeEventListener('pointerenter', item.enter);
      item.button.removeEventListener('pointerleave', item.leave);
      item.button.removeEventListener('focus', item.enter);
      item.button.removeEventListener('blur', item.leave);
      item.button.removeEventListener('pointerdown', item.enter);
      item.player?.destroy();
      item.canvas?.remove();
      item.slot?.classList.remove('has-canvas-turn');
    }
    states.clear();
  }
  function attach(slot, button, entry, version) {
    if (!slot || !button || states.has(button)) return;
    const target = button.querySelector('.mkr-garment');
    if (!target) return;
    const item = {slot, button, target, entry, version, player:null, canvas:null,
      started:false, ready:false, active:false, hovering:false, destroyed:false};
    const isCurrent = () => !disposed && !item.destroyed && version === generation &&
      button.isConnected && slot.isConnected;
    function activate() {
      if (!isCurrent() || item.active || !item.ready || item.hovering) return;
      item.target.appendChild(item.canvas);
      item.slot.classList.add('has-canvas-turn');
      item.active = true;
      item.player.setOpen(false);
    }
    function startLoad() {
      if (item.started || !isCurrent()) return;
      item.started = true;
      const canvas = document.createElement('canvas');
      canvas.className = 'mkr-turn-canvas';
      canvas.setAttribute('aria-hidden','true');
      item.canvas = canvas;
      item.player = new global.ClothingTurnPlayer(canvas, entry.frames, {size:480, duration:1100});
      item.player.preload().then(ok => {
        if (!isCurrent()) { item.player.destroy(); return; }
        if (!ok) { item.player.destroy(); return; }
        item.ready = true;
        // First hover stays on original CSS; swap only once the pointer/focus exits.
        if (!item.hovering) global.requestAnimationFrame(activate);
      }).catch(() => {item.player?.destroy();});
    }
    item.enter = () => {
      item.hovering = true;
      if (!item.started) startLoad();
      if (item.active) item.player.setOpen(true);
    };
    item.leave = () => {
      item.hovering = false;
      if (item.active) item.player.setOpen(false);
      else if (item.ready) global.requestAnimationFrame(activate);
    };
    button.addEventListener('pointerenter', item.enter);
    button.addEventListener('pointerleave', item.leave);
    button.addEventListener('focus', item.enter);
    button.addEventListener('blur', item.leave);
    button.addEventListener('pointerdown', item.enter);
    states.set(button,item);
  }
  function sync() {
    ++generation;
    disposeStates();
    if (!rackEl || !root?.__rack || !global.ClothingTurnPlayer || disposed) return;
    const products = root.__rack.visible || [];
    for (const button of rackEl.querySelectorAll('.mkr-item[data-i]')) {
      const product = products[Number(button.getAttribute('data-i'))];
      const entry = product && manifest.get(product.name);
      if (entry) attach(button.closest('.mkr-slot'),button,entry,generation);
    }
  }
  async function boot() {
    try {
      if (disposed || !global.ClothingTurnPlayer) return;
      root = document.querySelector('.mkr[data-mkr-ready]');
      if (!root?.__rack?.rackEl) return;
      rackEl = root.__rack.rackEl;
      const response = await fetch(MANIFEST_URL,{credentials:'same-origin',cache:'no-cache'});
      if (!response.ok) return;
      const data = await response.json();
      if (data?.version !== 1 || !Array.isArray(data.garments)) return;
      manifest = new Map(data.garments.filter(valid).map(item=>[item.name,item]));
      if (!manifest.size) return;
      if (!style.isConnected) document.head.appendChild(style);
      sync();
      observer = new MutationObserver(changes=>{
        if(changes.some(change=>change.type==='childList' && change.target===rackEl)) sync();
      });
      observer.observe(rackEl,{childList:true});
      document.addEventListener('visibilitychange',()=>{
        if(document.hidden) for(const state of states.values()) state.player?.setOpen(false);
      });
    } catch(error){ console.warn('[369 rack] Optional Canvas unavailable; original rack remains active.',error); }
  }
  global.MKRCanvasAdapter = {
    get activeCount(){return Array.from(states.values()).filter(item=>item.active).length;},
    get configuredCount(){return manifest.size;},
    get preloadedCount(){return Array.from(states.values()).filter(item=>item.ready).length;},
    stop(){disposed=true;observer?.disconnect();++generation;disposeStates();style.remove();}
  };
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot);
  else boot();
})(window);
