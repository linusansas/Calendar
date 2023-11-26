window.addEventListener("DOMContentLoaded", main);

let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();
let currentDay = new Date();

function main() {
  getDayName();
  updateCurrentTime();
  createCalendar(currentYear, currentMonth);
}

function createCalendar(year, month) {
  const monthName = document.querySelector(".month-name");
  const previousBtn = document.getElementById("previous-btn");
  const nextBtn = document.getElementById("next-btn");
  const daysGrid = document.querySelector(".grid-days");
  const imageElement = document.querySelector(".month-img");

  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Adjusting the starting index to make Monday the first day of the week
  let firstDayIndex = (firstDay.getDay() + 6) % 7;

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

  changeMonthImage(imageElement, month);

  monthName.textContent = `${monthNames[month]} ${year}`;
  daysGrid.innerHTML = "";
  nextBtn.onclick = nextMonth;
  previousBtn.onclick = prevMonth;

  //add empty div elements to represent the days of the previous month
  for (let i = 0; i < firstDayIndex; i++) {
    const dayElement = document.createElement("div");
    dayElement.className = "empty-day";
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

/**
 * Updates the calendar to reflect the current month and year.
 */
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

/**
 * Updates the current time display and run every second.
 */
function updateCurrentTime() {
  const currentDate = new Date();
  const currentTimeElement = document.querySelector(".btn-clock");
  const hours = currentDate.getHours().toString().padStart(2, "0");
  const minutes = currentDate.getMinutes().toString().padStart(2, "0");
  const seconds = currentDate.getSeconds().toString().padStart(2, "0");
  const timeString = `${hours}:${minutes}:${seconds}`;

  currentTimeElement.textContent = timeString;
  // console.log(currentDate.getSeconds());

  setTimeout(() => updateCurrentTime(), 1000);
}

/**
 * Updates the element displaying the current day name.
 * Uses the options to format the date string.
 */
function getDayName() {
  const currentDayName = document.getElementById("current-day");
  const options = {
    weekday: "long",
    day: "numeric",
    month: "long",
    // year: "numeric",
  };
  const currentDayString = currentDay.toLocaleDateString("en-US", options);
  currentDayName.textContent = currentDayString;
}
/**
 * change the calendar image depending on the month
 * @param {*} imageElement
 * @param {*} month
 */
function changeMonthImage(imageElement, month) {
  const monthImg = [
    "./images/january-img.png",
    "./images/february-img.jpeg",
    "./images/march-img.webp",
    "./images/april-img.jpeg",
    "./images/may-img.webp",
    "./images/june-img.jpeg",
    "./images/july-img.jpeg",
    "./images/august-img.jpeg",
    "./images/september-img.jpeg",
    "./images/october-img.jpeg",
    "./images/november-img.jpeg",
    "./images/december-img.jpeg",
  ];

  const indexImg = month;
  imageElement.setAttribute("src", monthImg[indexImg]);
}
