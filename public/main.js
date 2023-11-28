window.addEventListener("DOMContentLoaded", main);

function main() {
  // Display the day name when the page loads
  getDayName();
  startClock();
  updateCalendar();
}

/**
 * Updates the current time display and run every second.
 */
function startClock() {
  // console.log(currentDate.getSeconds());
  setInterval(tick, 1000);
}
// this function gets executed every second by setInterval()
function tick() {
  getDayName();
  const currentDate = new Date();
  const currentTimeElement = document.querySelector(".btn-clock");
  //format the hours, minutes and seconds to always have two digits using padStart(2, "0").
  const hours = currentDate.getHours().toString().padStart(2, "0");
  const minutes = currentDate.getMinutes().toString().padStart(2, "0");
  const seconds = currentDate.getSeconds().toString().padStart(2, "0");
  const timeString = `${hours}:${minutes}:${seconds}`;

  currentTimeElement.textContent = timeString;
}

/**
 * Updates the element displaying the current day name.
 * Uses the options to format the date string.
 */
function getDayName() {
  const currentDate = new Date();
  const currentDayName = document.getElementById("current-day");
  const options = {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  };
  const currentDayString = currentDate.toLocaleDateString("en-US", options);
  currentDayName.textContent = currentDayString;
}
