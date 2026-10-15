/* 369 Clothing tooling — authentic-source photo cutouts, not AI-generated views.
   Run only on 369clothing.ir origin so pixels are readable without CORS bypass. */
window.generate369Cutout = async function(url, opts = {}) {
  const img = new Image(); img.src = url; await img.decode();
  const W = 320, H = 420;
  const canvas = document.createElement('canvas'); canvas.width=W; canvas.height=H;
  const cx=canvas.getContext('2d',{willReadFrequently:true});
  cx.fillStyle='#ffffff';cx.fillRect(0,0,W,H);
  const fit=Math.min(W/img.naturalWidth,H/img.naturalHeight);
  const drawW=img.naturalWidth*fit,drawH=img.naturalHeight*fit;
  cx.drawImage(img,(W-drawW)/2,(H-drawH)/2,drawW,drawH);
  const fr=cx.getImageData(0,0,W,H),px=fr.data,bg=[];
  for(let y=0;y<H;y++){
    let r=0,g=0,b=0,n=0;
    for(let k=0;k<8;k++)for(const x of [k,W-1-k]){
      const i=(y*W+x)*4;r+=px[i];g+=px[i+1];b+=px[i+2];n++;
    }
    bg.push([r/n,g/n,b/n]);
  }
  const bits=new Uint8Array(W*H);
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){
    const i=(y*W+x)*4,R=px[i],G=px[i+1],B=px[i+2];
    const [br,bg0,bb]=bg[y];
    const lum=.22*R+.7*G+.08*B,bglum=.22*br+.7*bg0+.08*bb;
    const dist=Math.hypot(R-br,G-bg0,B-bb),chroma=Math.max(R,G,B)-Math.min(R,G,B);
    bits[y*W+x]=Math.max((bglum-lum)*1.3,dist*.8)+(chroma>22?6:0)>32?1:0;
  }
  const seen=new Uint8Array(W*H),q=new Int32Array(W*H);
  let best=[];
  for(let i=0;i<W*H;i++){
    if(!bits[i]||seen[i])continue;
    let head=0,tail=0,component=[];q[tail++]=i;seen[i]=1;
    while(head<tail){
      const id=q[head++];component.push(id);
      const x=id%W,y=Math.floor(id/W);
      const ns=[];if(x>0)ns.push(id-1);if(x<W-1)ns.push(id+1);
      if(y>0)ns.push(id-W);if(y<H-1)ns.push(id+W);
      for(const ni of ns)if(bits[ni]&&!seen[ni]){seen[ni]=1;q[tail++]=ni;}
    }
    if(component.length>best.length)best=component;
  }
  const occupancy=best.length/(W*H);
  if(occupancy<.13||occupancy>.75)throw Error('unreliable foreground occupancy '+occupancy.toFixed(3));
  const mask=new Uint8Array(W*H);
  let minX=W,minY=H,maxX=0,maxY=0;
  for(const i of best){
    mask[i]=1;const x=i%W,y=Math.floor(i/W);
    minX=Math.min(minX,x);maxX=Math.max(maxX,x);minY=Math.min(minY,y);maxY=Math.max(maxY,y);
  }
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){
    const idx=y*W+x;
    let m=0,n=0;
    for(let yy=Math.max(0,y-1);yy<=Math.min(H-1,y+1);yy++)
      for(let xx=Math.max(0,x-1);xx<=Math.min(W-1,x+1);xx++){
        m+=mask[yy*W+xx];n++;
      }
    px[idx*4+3]=Math.round(m/n*255);
  }
  cx.putImageData(fr,0,0);
  const out=document.createElement('canvas');out.width=280;out.height=375;
  const ox=out.getContext('2d');
  const sx=Math.max(0,minX-4),sy=Math.max(0,minY-4);
  const sw=Math.min(W-sx,maxX-minX+9),sh=Math.min(H-sy,maxY-minY+9);
  const scale=Math.min(265/sw,335/sh);
  const dw=sw*scale,dh=sh*scale;
  ox.drawImage(canvas,sx,sy,sw,sh,(280-dw)/2,20+(335-dh)*.34,dw,dh);
  return {data:out.toDataURL('image/webp',opts.quality||.65),occupancy:Number(occupancy.toFixed(3)),width:280,height:375,original:url,bounds:[minX,minY,maxX,maxY]};
};
