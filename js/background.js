/* =========================================================
   BACKGROUND ANIMATION COMPONENT
   Realistic procedural stars + subtle twinkle.
   ========================================================= */
const canvas = document.getElementById("starCanvas");
const ctx = canvas.getContext("2d");

let stars = [];
let width = 0;
let height = 0;
let pixelRatio = 1;

function resizeStarField(){
  pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
  width = window.innerWidth;
  height = window.innerHeight;

  canvas.width = width * pixelRatio;
  canvas.height = height * pixelRatio;
  ctx.setTransform(pixelRatio,0,0,pixelRatio,0,0);

  const count = Math.min(1100, Math.floor(width * height / 1450));

  stars = Array.from({length:count}, () => ({
    x:Math.random()*width,
    y:Math.random()*height,
    radius:Math.random() < .96
      ? Math.random()*.75+.15
      : Math.random()*1.55+.65,
    alpha:Math.random()*.65+.18,
    phase:Math.random()*Math.PI*2,
    speed:Math.random()*.018+.002,
    drift:(Math.random()-.5)*.025
  }));
}

function animateStars(){
  ctx.clearRect(0,0,width,height);

  for(const star of stars){
    star.phase += star.speed;
    star.x += star.drift;

    if(star.x < 0) star.x = width;
    if(star.x > width) star.x = 0;

    const alpha = star.alpha * (.68 + .32*Math.sin(star.phase));

    ctx.beginPath();
    ctx.arc(star.x,star.y,star.radius,0,Math.PI*2);
    ctx.fillStyle = `rgba(255,255,255,${alpha})`;
    ctx.fill();

    /* Tiny natural-looking sparkle on the brighter stars */
    if(star.radius > 1.2){
      ctx.strokeStyle = `rgba(190,155,255,${alpha*.30})`;
      ctx.lineWidth = .5;
      ctx.beginPath();
      ctx.moveTo(star.x-3,star.y);
      ctx.lineTo(star.x+3,star.y);
      ctx.moveTo(star.x,star.y-3);
      ctx.lineTo(star.x,star.y+3);
      ctx.stroke();
    }
  }

  requestAnimationFrame(animateStars);
}

window.addEventListener("resize",resizeStarField);
resizeStarField();
animateStars();
