let todos = JSON.parse(localStorage.getItem("todos")) || [];

let editingTodoIndex = -1;
let originalTodo = null;

// User input storage

function saveValues() {
  const dateUserInput = document.getElementById("dateInputField").value;
  const timeUserInput = document.getElementById("timeInputField").value;
  const titleUserInput = document.getElementById("titleInputField").value;
  const textareaUserInput = document.getElementById("textareaInputField").value;

  return {
    date: dateUserInput,
    time: timeUserInput,
    title: titleUserInput,
    textarea: textareaUserInput,
  };
}

// Create and display todos with edit button, delete button and <li> text element

function createTodoElement(todoData) {
  const newTodo = document.createElement("li");
  newTodo.className = "activity-card";

  const todoText = `
  <span class="dateField" >${todoData.date}</span><br>
  <span class="timeField"> ${todoData.time}</span><br>
  <span class="todo-title" >${todoData.title}</span><br>
    <span class="textarea">${todoData.textarea}</span>`;

  newTodo.innerHTML = todoText;

  // Actions Section
  const actionsSection = document.createElement("div");
  actionsSection.className = "activity-actions";

  const deleteButton = document.createElement("button");
  deleteButton.setAttribute("data-cy", "delete-todo-button");
  deleteButton.textContent = "Delete";
  deleteButton.onclick = () => deleteTodo(todoData.date, todoData.id);
  actionsSection.appendChild(deleteButton);

  const editButton = document.createElement("button");
  editButton.textContent = "Edit";
  editButton.setAttribute("data-cy", "edit-todo-button");
  editButton.onclick = () => allowUserEdit(todoData);
  editButton.setAttribute("data-edit-id", todoData.id);
  actionsSection.appendChild(editButton);
  editButton.setAttribute("id", "editButton");

  newTodo.appendChild(actionsSection);

  return newTodo;
}

// onclick function to edit, update and create todo to local storage

function createTodo() {
  const userInputData = saveValues();
  const editButton = document.getElementById("editButton");
  const editId = editButton ? editButton.getAttribute("data-edit-id") : null;

  const saveButton = document.getElementById("saveButton");

  if (editId) {
    const editingTodoIndex = todos.findIndex(
      (todoItem) => todoItem.id === editId
    );

    if (editingTodoIndex !== -1) {
      todos[editingTodoIndex] = { ...userInputData, id: editId };
      localStorage.setItem("todos", JSON.stringify(todos));
      updateCalendar();
      clearInputFields();
      updateTodoList();

      saveButton.textContent = "Save";
    } else {
      console.error("Todo not found for the given id:", editId);
    }
  } else {
    const newTodoId = getNextUniqueId();
    const newTodo = { ...userInputData, id: newTodoId };

    todos.push(newTodo);
    localStorage.setItem("todos", JSON.stringify(todos));
    updateCalendar();
    clearInputFields();
    updateTodoList();
    const todoElement = createTodoElement(newTodo);
    document.getElementById("todoList").appendChild(todoElement);
  }

  console.log(todos);
}

// Creates unique ID for each todo

function getNextUniqueId() {
  const existingTodo = todos.find((todo) => todo.id === todos.length + 1);
  if (existingTodo) {
    return existingTodo.id.toString();
  }

  return (todos.length + 1).toString();
}

// Delete from local storage based on ID and date

function deleteTodo(date, todoId) {
  const todoIndex = todos.findIndex(
    (todoItem) => todoItem.date === date && todoItem.id === todoId
  );

  if (todoIndex !== -1) {
    todos.splice(todoIndex, 1);
    localStorage.setItem("todos", JSON.stringify(todos));
    updateCalendar();

    clearTodoList();

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

function clearTodoList() {
  const todoListElement = document.getElementById("todoList");

  while (todoListElement.firstChild) {
    todoListElement.removeChild(todoListElement.firstChild);
  }
}

// Select the elements and clear values after saving or updating todos

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

// Filter todos based on selected date

function updateTodoList(selectedDate) {
  const todoListElement = document.getElementById("todoList");
  todoListElement.innerHTML = "";
  const existingTodos = todos.filter(
    (todoItem) => todoItem.date === selectedDate
  );
  existingTodos.forEach((todoItem) => {
    const injectTodo = createTodoElement(todoItem, todoItem.id);
    todoListElement.appendChild(injectTodo);
  });
}

// Toggle behavior: if the same day is clicked again, show todos for the current day. If no specific day clicked, display the current day´s todos

let lastClickedDay = null;

function selectDayTodo(event) {
  const selectedDayElement = event.target.closest(".day");
  const activitiesDate = document.getElementById("activities");

  let selectedDate;

  if (selectedDayElement) {
    const selectedDayId = selectedDayElement.id;
    const selectedDayNumber = parseInt(selectedDayId.replace("day", ""), 10);

    const selectedMonth = currentMonth;
    const selectedYear = currentYear;

    selectedDate = `${selectedYear}-${(selectedMonth + 1)
      .toString()
      .padStart(2, "0")}-${selectedDayNumber.toString().padStart(2, "0")}`;

    if (selectedDate === lastClickedDay) {
      selectedDate = new Date().toISOString().split("T")[0];
      lastClickedDay = null;
    } else {
      lastClickedDay = selectedDate;
    }
  } else {
    selectedDate = new Date().toISOString().split("T")[0];
    lastClickedDay = null;
  }

  const dateInputField = document.getElementById("dateInputField");

  dateInputField.value = "";

  activitiesDate.textContent = `Actitivities for: ${selectedDate}`;

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
