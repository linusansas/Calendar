window.addEventListener("DOMContentLoaded", main);

function main() {
  defaultDate();
  startClock();
  updateCalendar();
  retrieveTodo();
  console.log(todos);
  clearLocalStorage();
}
function clearLocalStorage() {
  localStorage.clear();
}
