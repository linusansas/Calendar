let todos = JSON.parse(localStorage.getItem("todos")) || [];
/* let nextTodoId = 1; */
/* let todoCounts = {}; */

let editingTodoIndex = -1;
let originalTodo = null;

function saveValues() {
   const dateUserInput = document.getElementById("dateInputField").value;
   const timeUserInput = document.getElementById("timeInputField").value;
   const titleUserInput = document.getElementById("titleInputField").value;
   const textareaUserInput =
      document.getElementById("textareaInputField").value;

   return {
      date: dateUserInput,
      time: timeUserInput,
      title: titleUserInput,
      textarea: textareaUserInput,
   };
}

function createTodoElement(todoData) {
   const newTodo = document.createElement("li");

   const todoText = `
    <span>Title: ${todoData.title}</span><br>
    <span>Date: ${todoData.date}</span><br>
    <span>Time: ${todoData.time}</span><br>
    <span>Textarea: ${todoData.textarea}</span>`;

   newTodo.innerHTML = todoText;

   const deleteButton = document.createElement("button");
   deleteButton.textContent = "Delete";
   deleteButton.onclick = () => deleteTodo(todoData.date, todoData.id);
   deleteButton.setAttribute("data-cy", "delete-todo-button");
   newTodo.appendChild(deleteButton);

   const editButton = document.createElement("button");
   editButton.textContent = "Edit";
   editButton.setAttribute("data-cy", "edit-todo-button");
   editButton.onclick = () => allowUserEdit(todoData);
   newTodo.appendChild(editButton);

   return newTodo;
}

function createTodo() {
   const userInputData = saveValues();

   const newTodoId = getNextUniqueId();
   const newTodo = { ...userInputData, id: newTodoId };

   todos.push(newTodo);

   localStorage.setItem("todos", JSON.stringify(todos));

   updateCalendar();
   clearInputFields();
   updateTodoList();
   const todoElement = createTodoElement(newTodo);
   document.getElementById("todoList").appendChild(todoElement);

   console.log(todos);
}
/* function injectTodosForSelectedDate(selectedDate) {
  const todoListElement = document.getElementById("todoList");
 
  while (todoListElement.firstChild) {
    todoListElement.removeChild(todoListElement.firstChild);
  }
 
  if (selectedDate) {
    const todosForSelectedDate = todos.filter((todoItem) => todoItem.date === selectedDate);
 
    if (todosForSelectedDate.length > 0) {
      document.getElementById("dateInputField").value = selectedDate;
 
      todosForSelectedDate.forEach((todoItem) => {
        const injectTodo = createTodoElement(todoItem, todoItem.id, selectedDate);
        if (injectTodo) {
          todoListElement.appendChild(injectTodo);
        }
      });
    }
  }
} */
/*
 
function saveAndCreateTodo() {
  const dateInputField = document.getElementById("dateInputField");
  const selectedDate = dateInputField.value;
  const todoItemId = dateInputField.getAttribute("data-todo-id");
 
  if (todoItemId && !dateInputField.disabled) {
    saveEditedTodo();
  } else {
    const userInputData = saveValues();
    const id = nextTodoId.toString();
    nextTodoId++;
 
    const newTodo = createTodoElement(userInputData, id);
 
    const todosForSelectedDateIndex = todos.findIndex((todoItem) => todoItem.date === selectedDate);
 
    if (todosForSelectedDateIndex !== -1) {
      const existingTodoIndex = todos[todosForSelectedDateIndex].todos.findIndex((item) => item.id === id);
 
      if (existingTodoIndex !== -1) {
        const uniqueId = getNextUniqueId();
        newTodo.setAttribute("data-todo-id", uniqueId);
        todos[todosForSelectedDateIndex].todos.push({ ...userInputData, id: uniqueId });
      } else {
        todos[todosForSelectedDateIndex].todos.push({ ...userInputData, id });
      }
    } else {
      todos.push({ date: selectedDate, todos: [{ ...userInputData, id }] });
    }
 
    localStorage.setItem("todos", JSON.stringify(todos));
    injectTodosForSelectedDate(selectedDate);
    updateCalendar();
 
    clearInputFields();
 
    console.log(todos)
  }
 
  updateTodoList(selectedDate);
 
  editingTodoIndex = -1;
  originalTodo = null;
 
  exitEditMode();
}
 
function getNextUniqueId() {
  return (nextTodoId++).toString();
}
 */
function deleteTodo(date, todoId) {
   const todoIndex = todos.findIndex(
      (todoItem) => todoItem.date === date && todoItem.id === todoId
   );

   if (todoIndex !== -1) {
      todos.splice(todoIndex, 1);
      localStorage.setItem("todos", JSON.stringify(todos));
      updateCalendar();

      // Clear the entire todoList
      clearTodoList();

      // Re-render todos for the specific date
      const todosForSelectedDate = todos.filter(
         (todoItem) => todoItem.date === date
      );
      todosForSelectedDate.forEach((todoItem) => {
         const todoElement = createTodoElement(todoItem);
         document.getElementById("todoList").appendChild(todoElement);
      });
   } else {
      console.error("Todo not found for the given date and id:", date, todoId);
   }
} 

/* function saveEditedTodo() {
   const dateInputField = document.getElementById("dateInputField");
   const todoItemId = dateInputField.getAttribute("data-todo-id");

   const editedTodo = findTodoById(todoItemId);

   if (editedTodo) {
      const editedTodoData = saveValues();
      editedTodo.id = todoItemId;

      Object.assign(editedTodo, editedTodoData);

      const editedTodoElement = createTodoElement(editedTodo, todoItemId);
      const existingTodoElement = document.querySelector(
         `[data-todo-id="${todoItemId}"]`
      );

      if (existingTodoElement) {
         existingTodoElement.innerHTML = editedTodoElement.innerHTML;
      } else {
         console.error("Existing todo element not found.");
      }

      storeTodo();
      updateCalendar();
      updateTodoList();
      clearInputFields();

      editingTodoIndex = -1;
      originalTodo = null;
   } else {
      console.error("Edited todo not found in the todo list.");
   }
} */
function storeTodo(callback) {
   if (todos && Array.isArray(todos)) {
      const hasNonEmptyTodo = todos.some(
         (item) =>
            item.date !== "" ||
            item.time !== "" ||
            item.title !== "" ||
            item.textarea !== ""
      );

      let todoString = JSON.stringify(todos);
      localStorage.setItem("todos", todoString);

      if (callback && typeof callback === "function") {
         callback();
      }
   } else {
      console.error("Invalid or uninitialized todos");
   }
}

/* function retrieveTodo() {
  let retString = localStorage.getItem("todos");
  todos = JSON.parse(retString) || [];
 
  console.log("Retrieved todos:", todos);
 
  if (Array.isArray(todos) && todos.length > 0) {
    const todoListElement = document.getElementById("todoList");
    todos.forEach(todoItem => {
      const injectTodo = createTodoElement(todoItem);
      todoListElement.appendChild(injectTodo);
    });
  }
}
 */

function clearTodoList() {
   const todoListElement = document.getElementById("todoList");

   while (todoListElement.firstChild) {
      todoListElement.removeChild(todoListElement.firstChild);
   }

   /*   injectTodosForSelectedDate(); */
   /*   retrieveTodo(); */
}
/* function updateTodoCount(date) {
  const storedTodos = JSON.parse(localStorage.getItem("todos")) || [];
  const todosForDate = storedTodos.filter((todoItem) => todoItem.date === date);
  const todoCount = todosForDate.length;
 
  const todoCounts = JSON.parse(localStorage.getItem("todoCounts")) || {};
  todoCounts[date] = todoCount;
  localStorage.setItem("todoCounts", JSON.stringify(todoCounts));
}
 */

/* function updateCalendarCell(date) {
  const calendarCells = document.querySelectorAll('[data-cy="calendar-cell-date"]');
  const formattedDate = new Date(date).getDate();
 
  calendarCells.forEach((cell) => {
    if (cell.textContent === formattedDate.toString()) {
      console.log('Cell Text Content:', cell.textContent);
 
      if (cell.parentNode) {
        let todoCountElement = cell.parentNode.querySelector('[data-cy="calendar-cell-todos"]');
 
        if (!todoCountElement) {
          todoCountElement = document.createElement("div");
          todoCountElement.setAttribute("data-cy", "calendar-cell-todos");
          cell.parentNode.appendChild(todoCountElement);
        }
 
        console.log('Todo Count Element:', todoCountElement);
        const day = formattedDate;
        updateTodoCountForCalendarCell(todoCountElement, currentYear, currentMonth, day);
      }
    }
  });
}   */

/* function updateTodoCountForCalendarCell(todoCountElement, year, month, day) {
  const date = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  const todoCounts = JSON.parse(localStorage.getItem("todoCounts")) || {};
  const todoCount = todoCounts[date] || 0;
  todoCountElement.textContent = todoCount > 0 ? todoCount.toString() : "";
}
 */
function clearInputFields() {
   const dateInputField = document.getElementById("dateInputField");
   const timeInputField = document.getElementById("timeInputField");
   const titleInputField = document.getElementById("titleInputField");
   const textareaInputField = document.getElementById("textareaInputField");

   if (dateInputField) {
      dateInputField.value = "";
   } else {
      console.error("dateInputField not found in the DOM");
   }

   if (timeInputField) {
      timeInputField.value = "";
   } else {
      console.error("timeInputField not found in the DOM");
   }

   if (titleInputField) {
      titleInputField.value = "";
   } else {
      console.error("titleInputField not found in the DOM");
   }

   if (textareaInputField) {
      textareaInputField.value = "";
   } else {
      console.error("textareaInputField not found in the DOM");
   }
}
/* function exitEditMode() {
   const dateInputField = document.getElementById("dateInputField");
   dateInputField.disabled = false;
}
 */
function updateTodoList(selectedDate) {
   const todoListElement = document.getElementById("todoList");

   // Clear the existing todo list
   todoListElement.innerHTML = "";

   // Get the existing todos for the selected date
   const existingTodos = todos.filter(
      (todoItem) => todoItem.date === selectedDate
   );

   // Append the updated todos
   existingTodos.forEach((todoItem) => {
      const injectTodo = createTodoElement(todoItem, todoItem.id);
      todoListElement.appendChild(injectTodo);
   });
}


function findTodoById(todoItemId) {
   function findTodo(todoList) {
      for (const todo of todoList) {
         if (todo.id === todoItemId) {
            return todo;
         } else if (todo.todos && Array.isArray(todo.todos)) {
            const nestedTodo = findTodo(todo.todos);
            if (nestedTodo) {
               return nestedTodo;
            }
         }
      }
      return null;
   }

   return findTodo(todos);
}

function selectDayTodo(event) {
   const selectedDayElement = event.target.closest(".day");
   if (!selectedDayElement) return;

   const selectedDayId = selectedDayElement.id;
   const selectedDayNumber = parseInt(selectedDayId.replace("day", ""), 10);

   const selectedMonth = currentMonth;
   const selectedYear = currentYear;
   const selectedDate = `${selectedYear}-${(selectedMonth + 1)
      .toString()
      .padStart(2, "0")}-${selectedDayNumber.toString().padStart(2, "0")}`;

   const dateInputField = document.getElementById("dateInputField");
   dateInputField.value = selectedDate;

   getDayName(selectedDayNumber, selectedMonth, selectedYear);
   currentMonth = selectedMonth;
   currentYear = selectedYear;

   clearTodoList();

   updateCalendar();

   const todosForSelectedDate = todos.filter(
      (todoItem) => todoItem.date === selectedDate
   );
   if (todosForSelectedDate.length > 0) {
      todosForSelectedDate.forEach((todoItem) => {
         const injectTodo = createTodoElement(todoItem, todoItem.id);
         document.getElementById("todoList").appendChild(injectTodo);
      });
   } else {
      updateTodoList(selectedDate);
   }

   console.log(todos);
}


function getNextUniqueId() {
   return (todos.length + 1).toString();
}