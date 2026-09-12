/* =========================================================
   COUNTDOWN COMPONENT
   Exact launch: 11 February 2028, 4:15 PM IST.
   ========================================================= */
const launchTime = new Date("2028-02-11T16:15:00+05:30").getTime();

const timerElements = {
  days:document.getElementById("days"),
  hours:document.getElementById("hours"),
  minutes:document.getElementById("minutes"),
  seconds:document.getElementById("seconds")
};

function timerPad(value,width){
  return String(value).padStart(width,"0");
}

function updateCountdown(){
  const difference = launchTime - Date.now();

  if(difference <= 0){
    document.getElementById("countdown").style.display="none";
    document.getElementById("liveMessage").style.display="block";
    document.title="my trip raja | We're Live!";
    return;
  }

  const totalSeconds = Math.floor(difference/1000);

  timerElements.days.textContent =
    timerPad(Math.floor(totalSeconds/86400),3);

  timerElements.hours.textContent =
    timerPad(Math.floor((totalSeconds%86400)/3600),2);

  timerElements.minutes.textContent =
    timerPad(Math.floor((totalSeconds%3600)/60),2);

  timerElements.seconds.textContent =
    timerPad(totalSeconds%60,2);
}

updateCountdown();
setInterval(updateCountdown,250);
