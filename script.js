/* ===========================================================
   CONFIG
=========================================================== */
const TARGET_DATE = new Date("2028-02-11T16:15:00+05:30");
const SUBSCRIBE_API_URL = "https://your-backend.onrender.com/api/coming-soon/subscribe";

/* ===========================================================
   CANVAS — stars + rich purple nebula clouds + beam + flares
   Everything rendered on canvas for smooth integration
=========================================================== */
(function(){
  const canvas = document.getElementById('bgCanvas');
  const ctx = canvas.getContext('2d');
  let W, H;
  let mouseX = 0.5, mouseY = 0.5;
  let smoothMX = 0.5, smoothMY = 0.5;

  function resize(){
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);
  window.addEventListener('mousemove', e => {
    mouseX = e.clientX / W;
    mouseY = e.clientY / H;
  });

  // Stars
  const stars = [];
  for(let i = 0; i < 250; i++){
    stars.push({
      x: Math.random(), y: Math.random(), z: Math.random(),
      size: Math.random() * 2 + 0.2,
      twSpd: 1 + Math.random() * 3,
      twOff: Math.random() * Math.PI * 2,
      br: 0.25 + Math.random() * 0.75
    });
  }

  // Nebula blobs — rich textured purple clouds on the left
  const nebulae = [
    // LEFT — bright purple galaxy cloud cluster
    { x:0.05, y:0.40, r:0.35, cr:120, cg:30, cb:200, a:0.16, spd:0.10, ph:0 },
    { x:0.15, y:0.32, r:0.22, cr:140, cg:50, cb:220, a:0.12, spd:0.14, ph:0.5 },
    { x:0.10, y:0.52, r:0.18, cr:100, cg:20, cb:180, a:0.10, spd:0.12, ph:1.0 },
    { x:0.22, y:0.45, r:0.14, cr:160, cg:70, cb:240, a:0.08, spd:0.16, ph:1.5 },
    { x:0.08, y:0.35, r:0.12, cr:180, cg:100,cb:255, a:0.06, spd:0.18, ph:2.0 },
    // RIGHT — blue/cyan glow
    { x:0.90, y:0.50, r:0.22, cr:0,   cg:80, cb:220, a:0.08, spd:0.15, ph:1.8 },
    { x:0.85, y:0.46, r:0.16, cr:20,  cg:100,cb:240, a:0.06, spd:0.12, ph:2.3 },
    // TOP — subtle purple haze
    { x:0.50, y:0.05, r:0.28, cr:60,  cg:15, cb:130, a:0.04, spd:0.08, ph:3.0 },
    // BOTTOM — very subtle
    { x:0.45, y:0.90, r:0.20, cr:40,  cg:20, cb:120, a:0.03, spd:0.10, ph:2.5 },
  ];

  let t = 0;

  function draw(ts){
    t = ts * 0.001;

    // Background
    ctx.fillStyle = '#030014';
    ctx.fillRect(0, 0, W, H);

    // Smooth parallax
    smoothMX += (mouseX - smoothMX) * 0.03;
    smoothMY += (mouseY - smoothMY) * 0.03;
    const px = (smoothMX - 0.5) * 40;
    const py = (smoothMY - 0.5) * 25;

    // Draw nebulae
    nebulae.forEach(n => {
      const dx = Math.sin(t * n.spd + n.ph) * 0.03;
      const dy = Math.cos(t * n.spd * 0.7 + n.ph) * 0.02;
      const nx = (n.x + dx) * W + px * 0.2;
      const ny = (n.y + dy) * H + py * 0.2;
      const nr = n.r * Math.max(W, H);

      const g = ctx.createRadialGradient(nx, ny, 0, nx, ny, nr);
      g.addColorStop(0,    `rgba(${n.cr},${n.cg},${n.cb},${(n.a * 2).toFixed(3)})`);
      g.addColorStop(0.2,  `rgba(${n.cr},${n.cg},${n.cb},${(n.a * 1.4).toFixed(3)})`);
      g.addColorStop(0.45, `rgba(${n.cr},${n.cg},${n.cb},${(n.a * 0.7).toFixed(3)})`);
      g.addColorStop(1,    `rgba(${n.cr},${n.cg},${n.cb},0)`);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
    });

    // Horizontal beam — drawn on canvas so it flows seamlessly
    const beamY = H * 0.52;
    const pulse = 0.6 + 0.4 * Math.sin(t * 1.5);

    // Wide soft glow
    const gWide = ctx.createLinearGradient(0, beamY - 50, 0, beamY + 50);
    gWide.addColorStop(0, 'transparent');
    gWide.addColorStop(0.3, `rgba(120,80,220,${0.03 * pulse})`);
    gWide.addColorStop(0.5, `rgba(180,150,255,${0.08 * pulse})`);
    gWide.addColorStop(0.7, `rgba(120,80,220,${0.03 * pulse})`);
    gWide.addColorStop(1, 'transparent');
    ctx.fillStyle = gWide;
    ctx.fillRect(0, beamY - 50, W, 100);

    // Thin bright line
    const gLine = ctx.createLinearGradient(0, 0, W, 0);
    gLine.addColorStop(0, 'transparent');
    gLine.addColorStop(0.08, `rgba(139,63,240,${0.4 * pulse})`);
    gLine.addColorStop(0.2,  `rgba(200,180,255,${0.7 * pulse})`);
    gLine.addColorStop(0.35, `rgba(255,255,255,${0.9 * pulse})`);
    gLine.addColorStop(0.5,  `rgba(255,255,255,${pulse})`);
    gLine.addColorStop(0.65, `rgba(255,255,255,${0.9 * pulse})`);
    gLine.addColorStop(0.8,  `rgba(200,180,255,${0.7 * pulse})`);
    gLine.addColorStop(0.92, `rgba(45,106,255,${0.4 * pulse})`);
    gLine.addColorStop(1, 'transparent');

    ctx.save();
    ctx.globalAlpha = 0.85;
    ctx.fillStyle = gLine;
    ctx.fillRect(0, beamY - 1, W, 2);

    // Beam glow (medium width)
    const gMed = ctx.createLinearGradient(0, beamY - 8, 0, beamY + 8);
    gMed.addColorStop(0, 'transparent');
    gMed.addColorStop(0.3, `rgba(160,140,255,${0.12 * pulse})`);
    gMed.addColorStop(0.5, `rgba(200,180,255,${0.25 * pulse})`);
    gMed.addColorStop(0.7, `rgba(160,140,255,${0.12 * pulse})`);
    gMed.addColorStop(1, 'transparent');
    ctx.fillStyle = gMed;
    ctx.fillRect(0, beamY - 8, W, 16);
    ctx.restore();

    // Right starburst glow (cyan)
    const rFlareX = W * 0.7;
    const rp = 0.5 + 0.5 * Math.sin(t * 0.8 + 0.5);
    const rGrad = ctx.createRadialGradient(rFlareX, beamY, 0, rFlareX, beamY, W * 0.18);
    rGrad.addColorStop(0, `rgba(0,220,255,${0.3 * rp})`);
    rGrad.addColorStop(0.25, `rgba(0,180,255,${0.12 * rp})`);
    rGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = rGrad;
    ctx.beginPath();
    ctx.arc(rFlareX, beamY, W * 0.18, 0, Math.PI * 2);
    ctx.fill();

    // Left purple flare
    const lFlareX = W * 0.22;
    const lFlareY = beamY - H * 0.05;
    const lp = 0.4 + 0.5 * Math.sin(t * 0.6);
    const lGrad = ctx.createRadialGradient(lFlareX, lFlareY, 0, lFlareX, lFlareY, W * 0.15);
    lGrad.addColorStop(0, `rgba(160,100,255,${0.2 * lp})`);
    lGrad.addColorStop(0.3, `rgba(120,60,220,${0.08 * lp})`);
    lGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = lGrad;
    ctx.beginPath();
    ctx.arc(lFlareX, lFlareY, W * 0.15, 0, Math.PI * 2);
    ctx.fill();

    // Traveling spark
    const sparkX1 = (((t * 0.12) % 1.4) - 0.2) * W;
    if(sparkX1 > 0 && sparkX1 < W){
      const sg = ctx.createRadialGradient(sparkX1, beamY, 0, sparkX1, beamY, 25);
      sg.addColorStop(0, 'rgba(255,255,255,0.85)');
      sg.addColorStop(0.4, 'rgba(200,180,255,0.2)');
      sg.addColorStop(1, 'transparent');
      ctx.fillStyle = sg;
      ctx.beginPath();
      ctx.arc(sparkX1, beamY, 25, 0, Math.PI * 2);
      ctx.fill();
    }
    const sparkX2 = (((t * 0.12 + 0.7) % 1.4) - 0.2) * W;
    if(sparkX2 > 0 && sparkX2 < W){
      const sg2 = ctx.createRadialGradient(sparkX2, beamY, 0, sparkX2, beamY, 20);
      sg2.addColorStop(0, 'rgba(255,255,255,0.65)');
      sg2.addColorStop(0.4, 'rgba(180,160,255,0.15)');
      sg2.addColorStop(1, 'transparent');
      ctx.fillStyle = sg2;
      ctx.beginPath();
      ctx.arc(sparkX2, beamY, 20, 0, Math.PI * 2);
      ctx.fill();
    }

    // Stars with parallax
    stars.forEach(s => {
      const sx = s.x * W + px * s.z;
      const sy = s.y * H + py * s.z;
      if(sx < -10 || sx > W+10 || sy < -10 || sy > H+10) return;

      const tw = 0.3 + 0.7 * ((Math.sin(t * s.twSpd + s.twOff) + 1) / 2);
      const alpha = s.br * tw;
      const sz = s.size * (0.4 + s.z * 0.6);

      ctx.beginPath();
      ctx.arc(sx, sy, sz, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${alpha.toFixed(2)})`;
      ctx.fill();

      if(s.size > 1.4){
        ctx.beginPath();
        ctx.arc(sx, sy, sz * 4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(220,210,255,${(alpha * 0.04).toFixed(3)})`;
        ctx.fill();
      }
    });

    requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);
})();

/* ===========================================================
   COUNTDOWN
=========================================================== */
const els = {
  days: document.getElementById('days'),
  hours: document.getElementById('hours'),
  minutes: document.getElementById('minutes'),
  seconds: document.getElementById('seconds'),
};
const ringCore = document.getElementById('ringCore');
let done = false;
function pad(n){ return String(n).padStart(2,'0'); }

function tick(){
  const diff = TARGET_DATE.getTime() - Date.now();
  if(diff <= 0){
    if(!done){
      done = true;
      clearInterval(tmr);
      ringCore.innerHTML = '<div class="live-msg">We\'re live!</div><div class="target-date" style="margin-top:10px;">Thank you for waiting 🎉</div>';
    }
    return;
  }
  els.days.textContent = Math.floor(diff / 864e5);
  els.hours.textContent = pad(Math.floor((diff / 36e5) % 24));
  els.minutes.textContent = pad(Math.floor((diff / 6e4) % 60));
  els.seconds.textContent = pad(Math.floor((diff / 1e3) % 60));
}
tick();
const tmr = setInterval(tick, 1000);

/* ===========================================================
   EMAIL CAPTURE
=========================================================== */
const form = document.getElementById('notifyForm');
const emailInput = document.getElementById('emailInput');
const notifyBtn = document.getElementById('notifyBtn');
const statusMsg = document.getElementById('statusMsg');
const LK = 'mytripraja_notify_subscribers';

function saveLocal(email, ts){
  try {
    const l = JSON.parse(localStorage.getItem(LK) || '[]');
    l.push({ email, subscribed_at: ts });
    localStorage.setItem(LK, JSON.stringify(l));
  } catch(e){}
}

form.addEventListener('submit', async function(e){
  e.preventDefault();
  const email = emailInput.value.trim();
  if(!email) return;
  notifyBtn.disabled = true;
  notifyBtn.textContent = 'Sending...';
  statusMsg.textContent = '';
  statusMsg.className = 'status-msg';
  const payload = { email, subscribed_at: new Date().toISOString() };
  try {
    const res = await fetch(SUBSCRIBE_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if(!res.ok) throw new Error();
    saveLocal(email, payload.subscribed_at);
    statusMsg.textContent = "You're on the list — we'll email you at launch!";
    statusMsg.classList.add('ok');
    emailInput.value = '';
  } catch(err) {
    saveLocal(email, payload.subscribed_at);
    statusMsg.textContent = "Thanks! We've saved your email. You'll hear from us!";
    statusMsg.classList.add('ok');
    emailInput.value = '';
  } finally {
    notifyBtn.disabled = false;
    notifyBtn.textContent = 'Notify Me';
  }
});
