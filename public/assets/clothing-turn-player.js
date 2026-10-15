/* 369 Clothing optional canvas frame player — copyright 2026. No framework required. */
(function (global) {
  'use strict';
  class ClothingTurnPlayer {
    constructor(canvas, frames, options = {}) {
      if (!(canvas instanceof global.HTMLCanvasElement)) throw new TypeError('Expected a canvas');
      const context = canvas.getContext('2d', {alpha: true});
      if (!context) throw new Error('Canvas 2D context unavailable');
      if (!Array.isArray(frames) || frames.length < 2 || frames.length > 120) throw new TypeError('Expected 2–120 frames');
      this.canvas = canvas;
      this.ctx = context;
      this.urls = frames.slice();
      this.images = new Array(frames.length);
      this.duration = Math.max(400, Math.min(3000, Number(options.duration) || 1100));
      this.motion = !(global.matchMedia && global.matchMedia('(prefers-reduced-motion: reduce)').matches);
      this.canvas.width = this.canvas.height = Math.max(120, Math.min(1024, Number(options.size) || 480));
      this.position = 0;
      this.target = 0;
      this.ready = false;
      this.destroyed = false;
      this.raf = 0;
      this.lastTime = null;
      this.timeout = Math.max(3000, Math.min(20000, Number(options.loadTimeout) || 10000));
    }
    async preload() {
      if (this.destroyed) return false;
      const results = await Promise.all(this.urls.map((url, index) => new Promise(resolve => {
        const image = new global.Image();
        let finished = false;
        const done = okay => { if (finished) return; finished = true; clearTimeout(timer); image.onload = image.onerror = null; resolve(okay); };
        const timer = setTimeout(() => done(false), this.timeout);
        image.decoding = 'async';
        image.onload = () => { this.images[index] = image; done(true); };
        image.onerror = () => done(false);
        image.src = url;
      })));
      if (this.destroyed || !results.every(Boolean)) return false;
      this.ready = true;
      this.render();
      return true;
    }
    render() {
      if (!this.ready || this.destroyed) return;
      const index = Math.max(0, Math.min(this.images.length - 1, Math.round(this.position)));
      const image = this.images[index];
      if (!image) return;
      const w = this.canvas.width, h = this.canvas.height;
      this.ctx.clearRect(0, 0, w, h);
      const scale = Math.min(w / image.naturalWidth, h / image.naturalHeight);
      const dw = image.naturalWidth * scale, dh = image.naturalHeight * scale;
      this.ctx.drawImage(image, (w - dw) / 2, (h - dh) / 2, dw, dh);
    }
    setOpen(open) {
      if (!this.ready || this.destroyed) return;
      this.target = open ? this.images.length - 1 : 0;
      if (!this.motion) { this.position = this.target; this.render(); return; }
      if (!this.raf) { this.lastTime = null; this.raf = global.requestAnimationFrame(t => this.tick(t)); }
    }
    tick(now) {
      if (this.destroyed) return;
      const dt = this.lastTime == null ? 16 : Math.min(64, Math.max(0, now - this.lastTime));
      this.lastTime = now;
      const distance = this.target - this.position;
      const step = (this.images.length - 1) * dt / this.duration;
      this.position += Math.sign(distance) * Math.min(Math.abs(distance), step);
      this.render();
      if (Math.abs(this.target - this.position) > 0.001) this.raf = global.requestAnimationFrame(t => this.tick(t));
      else { this.raf = 0; this.lastTime = null; }
    }
    destroy() {
      this.destroyed = true;
      if (this.raf) global.cancelAnimationFrame(this.raf);
      this.raf = 0;
      this.images = [];
      this.ready = false;
    }
  }
  global.ClothingTurnPlayer = ClothingTurnPlayer;
})(window);
