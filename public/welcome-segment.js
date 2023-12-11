let options = {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
};

function startClock() {
  setInterval(tick, 1000);
}
function tick() {
  defaultDate();
  // updateCalendar();
  const currentDate = new Date();
  const currentTimeElement = document.querySelector(".btn-clock");
  const hours = currentDate.getHours().toString().padStart(2, "0");
  const minutes = currentDate.getMinutes().toString().padStart(2, "0");
  const seconds = currentDate.getSeconds().toString().padStart(2, "0");
  const timeString = `${hours}:${minutes}:${seconds}`;

  currentTimeElement.textContent = timeString;
}

function defaultDate() {
  const defaultDate = new Date();
  getDayName(
    defaultDate.getDate(),
    defaultDate.getMonth(),
    defaultDate.getFullYear()
  );
}

function getDayName(day, month, year) {
  const currentDate = new Date(year, month, day);
  const currentDayName = document.getElementById("current-day");
  const currentDayString = currentDate.toLocaleDateString("en-US", options);
  currentDayName.textContent = currentDayString;
}
