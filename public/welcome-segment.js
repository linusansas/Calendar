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
  const selectedDay = event.target.textContent.trim();
  const selectedMonth = currentMonth;
  const selectedYear = currentYear;
  const selectedDate = `${selectedYear}-${(selectedMonth + 1).toString().padStart(2, '0')}-${selectedDay.toString().padStart(2, '0')}`;

  const dateInputField = document.getElementById("dateInputField");
  dateInputField.value = selectedDate;

  getDayName(selectedDay, selectedMonth, selectedYear);
  currentMonth = selectedMonth;
  currentYear = selectedYear;

  updateCalendar();

  // Set the correct data-todo-id for the selected date
  const todosForSelectedDate = todos.filter((todoItem) => todoItem.date === selectedDate);
  if (todosForSelectedDate.length > 0) {
    dateInputField.setAttribute("data-todo-id", todosForSelectedDate[0].id);
  } else {
    dateInputField.setAttribute("data-todo-id", "");  // Reset if no todos for the selected date
  }

  // Update the todo list for the selected date
  updateTodoList(selectedDate);

  console.log(todosForSelectedDate);
}