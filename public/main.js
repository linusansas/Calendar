window.addEventListener("DOMContentLoaded", main);

let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();
function main() {
  createCalendar(currentYear, currentMonth);
}

function createCalendar(year, month) {
  const monthName = document.querySelector(".month-name");
  const previousBtn = document.getElementById("previous-btn");
  const nextBtn = document.getElementById("next-btn");
  const daysGrid = document.querySelector(".grid-days");

  const firstDay = new Date(year, month, 0);
  const lastDay = new Date(year, month - 1, 0);
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const currentTimeElement = document.querySelector(".btn-clock");
  updateCurrentTime(currentTimeElement);

  const firstDayIndex = firstDay.getDay();

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  monthName.textContent = `${monthNames[month]} ${year}`;
  daysGrid.innerHTML = "";
  nextBtn.onclick = nextMonth;
  previousBtn.onclick = prevMonth;

  for (let i = 0; i < firstDayIndex; i++) {
    const dayElement = document.createElement("div");
    dayElement.className = "day";
    daysGrid.appendChild(dayElement);
  }

  for (let i = 1; i <= daysInMonth; i++) {
    const dayElement = document.createElement("div");
    dayElement.className = "day";
    dayElement.textContent = i;

    if (
      i === new Date().getDate() &&
      year === new Date().getFullYear() &&
      month === new Date().getMonth()
    ) {
      dayElement.classList.add("today");
    }
    daysGrid.appendChild(dayElement);
  }
}

function updateCalendar() {
  createCalendar(currentYear, currentMonth);
}

function nextMonth() {
  currentMonth = (currentMonth + 1) % 12;
  if (currentMonth === 0) {
    currentYear++;
  }
  updateCalendar();
}

function prevMonth() {
  currentMonth = (currentMonth - 1 + 12) % 12;
  if (currentMonth === 11) {
    currentYear--;
  }
  updateCalendar();
}

function updateCurrentTime(element) {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const timeString = `${hours}:${minutes}`;

  element.textContent = timeString;

  // Optionally, update the time every second
  setTimeout(() => updateCurrentTime(element), 1000);
}
