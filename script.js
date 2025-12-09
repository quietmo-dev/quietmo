/* ============================================================
   AUTO-MATCH SCREEN SHAPE FOR ANY DEVICE
============================================================ */
function updateCenterBlock() {
  const block = document.querySelector(".center-block");

  const W = window.innerWidth;
  const H = window.innerHeight;

  // Rounded radius based on device size
  const radius = Math.min(W, H) * 0.09;

  block.style.width = W + "px";
  block.style.height = H + "px";
  block.style.borderRadius = radius + "px";
}

updateCenterBlock();
window.addEventListener("resize", updateCenterBlock);


/* ============================================================
   GRADIENT MOTION (pointer + accelerometer)
============================================================ */

function setGradientByPercent(px, py) {
  document.documentElement.style.setProperty("--hx", px + "%");
  document.documentElement.style.setProperty("--hy", py + "%");
}

setGradientByPercent(50,50);

let motionActive = false;

function trackPointer(x,y){
  if (motionActive) return;
  setGradientByPercent((x/innerWidth)*100, (y/innerHeight)*100);
}

window.addEventListener("mousemove", e => trackPointer(e.clientX, e.clientY));
window.addEventListener("touchmove", e => {
  const t = e.touches[0];
  if (t) trackPointer(t.clientX, t.clientY);
},{ passive: true });

/* ACCELEROMETER */
let baseAx=0, baseAy=0, filteredDx=0, filteredDy=0;
let baselineSet=false, motionAttached=false;

const motionBtn=document.getElementById("motionBtn");

function attachMotion(){
  if (motionAttached) return;
  motionAttached=true;

  window.addEventListener("devicemotion", e=>{
    const acc=e.accelerationIncludingGravity;
    if (!acc) return;

    let ax = acc.x || 0;
    let ay = acc.y || 0;

    if (!baselineSet){
      baselineSet=true;
      baseAx=ax;
      baseAy=ay;
      return;
    }

    let dx=ax-baseAx;
    let dy=ay-baseAy;

    const smoothing=0.15;
    filteredDx+=(dx-filteredDx)*smoothing;
    filteredDy+=(dy-filteredDy)*smoothing;

    const maxDelta=5;
    let nx=Math.max(-1,Math.min(1, filteredDx/maxDelta));
    let ny=Math.max(-1,Math.min(1, filteredDy/maxDelta));

    motionActive=true;

    const px=(nx+1)*50;
    const py=(1-(ny+1)/2)*100;

    setGradientByPercent(px,py);
  });
}

async function requestMotion(){
  if (typeof DeviceMotionEvent==="undefined") return;

  try{
    if (typeof DeviceMotionEvent.requestPermission==="function"){
      const res = await DeviceMotionEvent.requestPermission();
      if (res==="granted"){
        attachMotion();
        motionBtn.classList.remove("visible");
      } else {
        motionBtn.textContent="Motion Denied";
      }
    } else {
      attachMotion();
      motionBtn.classList.remove("visible");
    }
  } catch(e){
    motionBtn.textContent="Motion Error";
  }
}

if (typeof DeviceMotionEvent!=="undefined")
  motionBtn.classList.add("visible");

motionBtn.addEventListener("click", requestMotion);


/* ============================================================
   SUNFLOWER HOLES — MULTIPLE SIZES
============================================================ */

function drawMask() {
  const canvas=document.getElementById("mask");
  const ctx=canvas.getContext("2d");
  canvas.width=innerWidth;
  canvas.height=innerHeight;

  ctx.fillStyle="#000";
  ctx.fillRect(0,0,canvas.width,canvas.height);

  const count=2000;
  const spacing=10.5;
  const phi=Math.PI*(3-Math.sqrt(5));
  const cx=canvas.width/2;
  const cy=canvas.height/2;

  const sizes = [
    { holeR: 3.0, rimR: 5.0 },
    { holeR: 4.2, rimR: 6.5 },
    { holeR: 5.0, rimR: 7.8 }
  ];

  function pickSize(n){
    if(n % 7 === 0) return sizes[2];
    if(n % 3 === 0) return sizes[1];
    return sizes[0];
  }

  ctx.globalCompositeOperation="destination-out";

  for (let n=0; n<count; n++){
    const r=spacing*Math.sqrt(n);
    const t=n*phi;

    const x=cx+r*Math.cos(t);
    const y=cy+r*Math.sin(t);

    const jx=(Math.random()-0.5)*1.2;
    const jy=(Math.random()-0.5)*1.2;

    const sz=pickSize(n);

    ctx.beginPath();
    ctx.arc(x+jx, y-jy, sz.holeR, 0, Math.PI*2);
    ctx.fill();
  }

  ctx.globalCompositeOperation="source-over";

  for (let n=0; n<count; n++){
    const r=spacing*Math.sqrt(n);
    const t=n*phi;

    const x=cx+r*Math.cos(t);
    const y=cy+r*Math.sin(t);

    const jx=(Math.random()-0.5)*1.2;
    const jy=(Math.random()-0.5)*1.2;

    const sz=pickSize(n);

    const grad=ctx.createRadialGradient(
      x+jx, y+jy, sz.holeR*0.8,
      x+jx, y+jy, sz.rimR
    );

    grad.addColorStop(0.0,"rgba(255,255,255,0.25)");
    grad.addColorStop(0.4,"rgba(90,90,90,0.20)");
    grad.addColorStop(1.0,"rgba(0,0,0,0)");

    ctx.fillStyle=grad;
    ctx.beginPath();
    ctx.arc(x+jx, y+jy, sz.rimR, 0, Math.PI*2);
    ctx.fill();
  }
}

drawMask();