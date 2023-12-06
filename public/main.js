window.addEventListener("DOMContentLoaded", main);

function main() {
  defaultDate();
  startClock();
  updateCalendar();
  retrieveTodo();
}
function clearLocalStorage() {
  localStorage.clear();
}