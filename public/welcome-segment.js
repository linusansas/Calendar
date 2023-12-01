let options = {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
};
/**
 * Updates the current time display and run every second.
 */
function startClock() {
  // console.log(currentDate.getSeconds());
  setInterval(tick, 1000);
}
// this function gets executed every second by setInterval()
function tick() {
  const currentDate = new Date();
  const currentTimeElement = document.querySelector(".btn-clock");
  // Format the hours, minutes, and seconds to always have two digits using padStart(2, "0").
  const hours = currentDate.getHours().toString().padStart(2, "0");
  const minutes = currentDate.getMinutes().toString().padStart(2, "0");
  const seconds = currentDate.getSeconds().toString().padStart(2, "0");
  const timeString = `${hours}:${minutes}:${seconds}`;

  currentTimeElement.textContent = timeString;
}
function defaultDate() {
  const defaultDate = new Date(); // You can set a specific default date if needed
  getDayName(defaultDate.getDate(), defaultDate.getMonth(), defaultDate.getFullYear());
}

/**
 * Updates the element displaying the current day name.
 * Uses the options to format the date string.
 */
function getDayName(day, month, year) {
  const currentDate = new Date(year, month, day);
  const currentDayName = document.getElementById("current-day");
  const currentDayString = currentDate.toLocaleDateString("en-US", options);
  currentDayName.textContent = currentDayString;
}
function selectDayTodo(event) {
  clearTodoList()
  const selectedDay = event.target.textContent;
  const selectedMonth = currentMonth; // Assuming currentMonth is a global variable
  const selectedYear = currentYear; // Assuming currentYear is a global variable
  getDayName(selectedDay, selectedMonth, selectedYear);
  currentMonth = selectedMonth;
  currentYear = selectedYear;
  updateCalendar();
  console.log(selectedDay);
}