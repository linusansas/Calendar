window.addEventListener("DOMContentLoaded", main);

function main() {
  // Display the day name when the page loads
  getDayName();
  startClock();
  updateCalendar();
  loadLocalStorage();
}
