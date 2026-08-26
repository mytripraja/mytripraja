/* ---------------------------------------------------------
   CONFIG — edit these two values for your setup
--------------------------------------------------------- */
// Launch target: 11 Feb 2028, 4:15 PM IST (India Standard Time, UTC+5:30)
const TARGET_DATE = new Date("2028-02-11T16:15:00+05:30");

// Your backend endpoint that saves {email, subscribed_at} to Postgres.
// Point this at your mytripraja-backend deployment, e.g.:
// "https://mytripraja-backend.onrender.com/api/coming-soon/subscribe"
const SUBSCRIBE_API_URL = "https://your-backend.onrender.com/api/coming-soon/subscribe";
/* --------------------------------------------------------- */

// Starfield generation (with 3D depth)
(function generateStars(){
  const container = document.getElementById('stars');
  const count = 140;
  for(let i=0;i<count;i++){
    const s = document.createElement('div');
    s.className = 'star';
    const depth = Math.random(); // 0 = far, 1 = near
    const size = depth*2.4 + 0.8;
    s.style.width = size+'px';
    s.style.height = size+'px';
    s.style.top = Math.random()*100+'vh';
    s.style.left = Math.random()*100+'vw';
    s.style.opacity = (Math.random()*0.7+0.3).toFixed(2);
    s.style.transform = `translateZ(${(depth*300 - 150).toFixed(0)}px)`;
    s.style.animationDelay = (Math.random()*3).toFixed(2)+'s';
    s.dataset.depth = depth.toFixed(2);
    container.appendChild(s);
  }
})();

// 3D parallax: scene tilts toward pointer / device tilt
(function initParallax(){
  const scene = document.getElementById('scene');
  let targetX = 0, targetY = 0, curX = 0, curY = 0;

  function apply(){
    curX += (targetX - curX) * 0.06;
    curY += (targetY - curY) * 0.06;
    scene.style.transform = `rotateX(${curY}deg) rotateY(${curX}deg) translateZ(0)`;
    requestAnimationFrame(apply);
  }
  requestAnimationFrame(apply);

  window.addEventListener('mousemove', (e) => {
    const nx = (e.clientX / window.innerWidth) - 0.5;
    const ny = (e.clientY / window.innerHeight) - 0.5;
    targetX = nx * 14;   // rotateY range
    targetY = -ny * 10;  // rotateX range
  });

  window.addEventListener('touchmove', (e) => {
    if(!e.touches || !e.touches[0]) return;
    const t = e.touches[0];
    const nx = (t.clientX / window.innerWidth) - 0.5;
    const ny = (t.clientY / window.innerHeight) - 0.5;
    targetX = nx * 14;
    targetY = -ny * 10;
  }, { passive:true });

  window.addEventListener('deviceorientation', (e) => {
    if(e.gamma == null || e.beta == null) return;
    targetX = Math.max(-16, Math.min(16, e.gamma / 3));
    targetY = Math.max(-12, Math.min(12, (e.beta - 45) / 4));
  });

  window.addEventListener('mouseleave', () => { targetX = 0; targetY = 0; });
})();

// Countdown logic
const els = {
  days: document.getElementById('days'),
  hours: document.getElementById('hours'),
  minutes: document.getElementById('minutes'),
  seconds: document.getElementById('seconds'),
};
const ringCore = document.getElementById('ringCore');
let countdownFinished = false;

function pad(n){ return String(n).padStart(2,'0'); }

function tick(){
  const now = new Date();
  const diff = TARGET_DATE.getTime() - now.getTime();

  if(diff <= 0){
    if(!countdownFinished){
      countdownFinished = true;
      clearInterval(timer);
      ringCore.innerHTML = '<div class="live-msg">We\'re live!</div><div class="target-date" style="margin-top:10px;">Thank you for waiting 🎉</div>';
    }
    return;
  }

  const days = Math.floor(diff / (1000*60*60*24));
  const hours = Math.floor((diff / (1000*60*60)) % 24);
  const minutes = Math.floor((diff / (1000*60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  els.days.textContent = pad(days);
  els.hours.textContent = pad(hours);
  els.minutes.textContent = pad(minutes);
  els.seconds.textContent = pad(seconds);
}
tick();
const timer = setInterval(tick, 1000);

// Email capture
const form = document.getElementById('notifyForm');
const emailInput = document.getElementById('emailInput');
const notifyBtn = document.getElementById('notifyBtn');
const statusMsg = document.getElementById('statusMsg');
const LOCAL_KEY = 'mytripraja_notify_subscribers';

function saveLocally(email, ts){
  try{
    const list = JSON.parse(localStorage.getItem(LOCAL_KEY) || '[]');
    list.push({ email, subscribed_at: ts });
    localStorage.setItem(LOCAL_KEY, JSON.stringify(list));
  }catch(e){ /* localStorage unavailable, ignore */ }
}

form.addEventListener('submit', async function(e){
  e.preventDefault();
  const email = emailInput.value.trim();
  if(!email) return;

  notifyBtn.disabled = true;
  notifyBtn.textContent = 'Sending...';
  statusMsg.textContent = '';
  statusMsg.className = 'status-msg';

  const payload = {
    email: email,
    subscribed_at: new Date().toISOString()
  };

  try{
    const res = await fetch(SUBSCRIBE_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if(!res.ok) throw new Error('Server error');

    saveLocally(payload.email, payload.subscribed_at);
    statusMsg.textContent = "You're on the list — we'll email you at launch!";
    statusMsg.classList.add('ok');
    emailInput.value = '';
  }catch(err){
    // Backend not reachable yet — still keep the email locally so nothing is lost
    saveLocally(payload.email, payload.subscribed_at);
    statusMsg.textContent = "Saved on this device. We'll sync it once you're online.";
    statusMsg.classList.add('err');
  }finally{
    notifyBtn.disabled = false;
    notifyBtn.textContent = 'Notify Me';
  }
});
