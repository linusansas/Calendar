window.addEventListener("DOMContentLoaded", main);

function main() {
  defaultDate();
  startClock();
  updateCalendar();
  clearLocalStorage();
}
function clearLocalStorage() {
  localStorage.clear();
}
