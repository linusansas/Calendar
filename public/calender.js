let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

function createCalendar(year, month) {
   const monthName = document.querySelector(".month-name");
   const previousBtn = document.getElementById("previous-btn");
   const nextBtn = document.getElementById("next-btn");
   const daysGrid = document.querySelector(".grid-days");
   const imageElement = document.querySelector(".month-img");

   const firstDay = new Date(year, month, 1);
   const daysInMonth = new Date(year, month + 1, 0).getDate();

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

   //   changeMonthImage(imageElement, month);

   monthName.textContent = `${monthNames[month]} ${year}`;
   daysGrid.innerHTML = "";
   nextBtn.onclick = nextMonth;
   previousBtn.onclick = prevMonth;

   for (let i = 0; i < firstDayIndex; i++) {
      const dayElement = document.createElement("p");
      dayElement.className = "day";
      daysGrid.appendChild(dayElement);
      dayElement.setAttribute("data-cy", "calendar-cell");
      const textElement = document.createElement("div");
      dayElement.appendChild(textElement);
      textElement.setAttribute("data-cy", "calendar-cell-date");
   }

   for (let i = 1; i <= daysInMonth; i++) {
      const dayElement = document.createElement("div");
      dayElement.className = "day";
      dayElement.setAttribute("data-cy", "calendar-cell");
      dayElement.setAttribute("onclick", "selectDayTodo(event)");
      dayElement.setAttribute("id", `day${i}`);

      const textElement = document.createElement("div");
      textElement.textContent = i;
      textElement.setAttribute("data-cy", "calendar-cell-date");
      textElement.setAttribute("onclick", "selectDayTodo(event)");
      dayElement.appendChild(textElement);

      if (
         i === new Date().getDate() &&
         year === new Date().getFullYear() &&
         month === new Date().getMonth()
      ) {
         dayElement.classList.add("today");
      }

      const cellDate = new Date(year, month, i + 1);
      const cellDateString = cellDate.toISOString().split("T")[0];
      const todosForDate = todos.filter(
         (todoItem) => todoItem.date === cellDateString
      );

      if (todosForDate.length) {
         const todoCountElement = document.createElement("div");
         todoCountElement.setAttribute("data-cy", "calendar-cell-todos");
         todoCountElement.textContent = todosForDate.length;
         dayElement.appendChild(todoCountElement);
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

// /**
//  * Change the calendar image depending on the month
//  * @param {*} imageElement
//  * @param {*} month
//  */
// function changeMonthImage(imageElement, month) {
//   const monthImg = [
//     "./images/january-img.png",
//     "./images/february-img.jpeg",
//     "./images/march-img.webp",
//     "./images/april-img.jpeg",
//     "./images/may-img.webp",
//     "./images/june-img.jpeg",
//     "./images/july-img.jpeg",
//     "./images/august-img.jpeg",
//     "./images/september-img.jpeg",
//     "./images/october-img.jpeg",
//     "./images/november-img.jpeg",
//     "./images/december-img.jpeg",
//   ];

//   const indexImg = month;
//   imageElement.setAttribute("src", monthImg[indexImg]);
// }

function handleDateChange() {
   const selectedDate = document.getElementById("dateInputField").value;

   const parsedDate = new Date(selectedDate);

   currentMonth = parsedDate.getMonth();
   currentYear = parsedDate.getFullYear();

   getDayName(parsedDate.getDate(), currentMonth, currentYear);

   updateCalendar();
   clearTodoList();
   updateTodoList();
}
