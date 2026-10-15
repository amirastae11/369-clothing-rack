/* Opt-in adapter for original Mkurugenzi rack. Existing CSS rack remains the fallback. */
(function (global) {
  'use strict';
  const MANIFEST_URL = '/assets/turn-manifest.json';
  const instances = new Map();
  let manifest = new Map();
  let railObserver = null;
  let root = null;
  let rackEl = null;
  let syncVersion = 0;
  const css = '.mkr-slot.has-canvas-turn .mkr-face{visibility:hidden!important}' +
    '.mkr-slot .mkr-turn-canvas{position:absolute;top:0;left:50%;transform:translateX(-50%);display:block;width:100%;height:auto;aspect-ratio:1/1;pointer-events:none}' +
    '.mkr-slot.has-canvas-turn .mkr-garment{overflow:visible}' +
    '@media(prefers-reduced-motion:reduce){.mkr-slot.has-canvas-turn .mkr-swing{animation:none!important}}';
  const style = document.createElement('style');
  style.id = 'mkr-turn-style';
  style.textContent = css;

  function allowed(entry) {
    if (!entry || entry.verified !== true || typeof entry.name !== 'string' || !Array.isArray(entry.frames)) return false;
    if (entry.frames.length < 2 || entry.frames.length > 120) return false;
    return entry.frames.every(path => typeof path === 'string' && /^\/assets\/turns\/[a-zA-Z0-9_-]+\/\d{3}\.webp$/.test(path));
  }
  function clean() {
    for (const value of instances.values()) {
      value.player.destroy();
      value.detach();
    }
    instances.clear();
  }
  function show(slot, button, entry, version) {
    if (instances.has(button) || !button.isConnected || !slot.isConnected) return;
    const target = button.querySelector('.mkr-garment');
    if (!target) return;
    const canvas = document.createElement('canvas');
    canvas.className = 'mkr-turn-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    const player = new global.ClothingTurnPlayer(canvas, entry.frames, {size:480, duration:1100});
    player.preload().then(ok => {
      if (!ok || version !== syncVersion || !button.isConnected) { player.destroy(); return; }
      target.appendChild(canvas);
      slot.classList.add('has-canvas-turn');
      const onEnter = () => player.setOpen(true);
      const onLeave = () => player.setOpen(false);
      button.addEventListener('mouseenter', onEnter);
      button.addEventListener('mouseleave', onLeave);
      button.addEventListener('focus', onEnter);
      button.addEventListener('blur', onLeave);
      button.addEventListener('pointerdown', onEnter);
      const detach = () => {
        button.removeEventListener('mouseenter', onEnter);
        button.removeEventListener('mouseleave', onLeave);
        button.removeEventListener('focus', onEnter);
        button.removeEventListener('blur', onLeave);
        button.removeEventListener('pointerdown', onEnter);
      };
      instances.set(button, {player, detach});
      if (slot.classList.contains('is-active')) onEnter();
    }).catch(() => player.destroy());
  }
  function sync() {
    ++syncVersion;
    clean();
    if (!rackEl || !root || !root.__rack || !global.ClothingTurnPlayer) return;
    const products = root.__rack.visible || [];
    for (const button of rackEl.querySelectorAll('.mkr-item[data-i]')) {
      const product = products[Number(button.getAttribute('data-i'))];
      const entry = product && manifest.get(product.name);
      if (entry) show(button.closest('.mkr-slot'), button, entry, syncVersion);
    }
  }
  async function boot() {
    try {
      if (!global.ClothingTurnPlayer) return;
      root = document.querySelector('.mkr[data-mkr-ready]');
      if (!root || !root.__rack || !root.__rack.rackEl) return;
      rackEl = root.__rack.rackEl;
      const response = await fetch(MANIFEST_URL, {credentials:'same-origin', cache:'no-cache'});
      if (!response.ok) return;
      const data = await response.json();
      if (!data || data.version !== 1 || !Array.isArray(data.garments)) return;
      manifest = new Map(data.garments.filter(allowed).map(entry => [entry.name, entry]));
      if (!manifest.size) return; // Zero downloaded frames -> zero changes to live rack.
      document.head.appendChild(style);
      sync();
      railObserver = new MutationObserver(records => {
        if (records.some(record => record.type === 'childList' && record.target === rackEl)) sync();
      });
      railObserver.observe(rackEl, {childList:true});
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) for (const instance of instances.values()) instance.player.setOpen(false);
      });
    } catch(error) { console.warn('[369 rack] Optional Canvas unavailable; CSS fallback remains active.', error); }
  }
  global.MKRCanvasAdapter = {get activeCount(){return instances.size;},get configuredCount(){return manifest.size;},stop(){if(railObserver)railObserver.disconnect();++syncVersion;clean();}};
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})(window);
