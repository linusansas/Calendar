let todos = JSON.parse(localStorage.getItem("todos")) || [];
let nextTodoId = 1;
let todoCounts = {};

let editingTodoIndex = -1;
let originalTodo = null;

function saveValues() {
  const dateUserInput = document.getElementById("dateInputField").value;
  const timeUserInput = document.getElementById("timeInputField").value;
  const titleUserInput = document.getElementById("titleInputField").value;
  const textareaUserInput = document.getElementById("textareaInputField").value;

  return {
    date: dateUserInput,
    time: timeUserInput,
    title: titleUserInput,
    textarea: textareaUserInput
  };
}

function createTodoElement(todoData, customId) {
  const newTodo = document.createElement("li");
  const firstTodoItem = todoData.todos && todoData.todos.length > 0 ? todoData.todos[0] : {};
  const id = customId || (firstTodoItem.id || ""); // Use customId if provided, otherwise use firstTodoItem.id
  const todoText = `
    <span>Title: ${firstTodoItem.title}</span><br>
    <span>Date: ${firstTodoItem.date}</span><br>
    <span>Time: ${firstTodoItem.time}</span><br>
    <span>Textarea: ${firstTodoItem.textarea}</span>`;
  newTodo.innerHTML = todoText;
  newTodo.setAttribute("data-todo-id", id);

  const deleteButton = document.createElement("button");
  deleteButton.textContent = 'Delete';
  deleteButton.onclick = () => deleteTodo(newTodo);
  deleteButton.setAttribute("data-cy", "delete-todo-button");
  newTodo.appendChild(deleteButton);

  const editButton = document.createElement("button");
  editButton.textContent = 'Edit';
  editButton.setAttribute("data-cy", "edit-todo-button");
  editButton.onclick = () => allowUserEdit(newTodo);
  newTodo.appendChild(editButton);
  return newTodo;
}

function createTodo() {
  const userInputData = saveValues();
  const selectedDate = userInputData.date;

  // Retrieve todos from localStorage
  let todos = JSON.parse(localStorage.getItem("todos")) || [];

  // Assign the id and increment the nextTodoId for the next item
  const newTodo = { ...userInputData, id: nextTodoId.toString() };
  todos.push(newTodo);
  nextTodoId++;  // Increment nextTodoId for the next todo

  // Store the updated todos
  localStorage.setItem("todos", JSON.stringify(todos));

  updateTodoCount(selectedDate);
  updateCalendarCell(selectedDate);

  clearInputFields();

  // Update the todo list
  updateTodoList();
}


function saveAndCreateTodo() {
  const dateInputField = document.getElementById("dateInputField");
  const selectedDate = dateInputField.value;
  const todoItemId = dateInputField.getAttribute("data-todo-id");

  if (todoItemId && !dateInputField.disabled) {
    // Editing mode, save the edited todo
    saveEditedTodo();
  } else {
    // Creating a new todo
    const userInputData = saveValues();
    const id = nextTodoId.toString();
    nextTodoId++;

    const newTodo = createTodoElement(userInputData, id);

    const todosForSelectedDateIndex = todos.findIndex((todoItem) => todoItem.date === selectedDate);

    if (todosForSelectedDateIndex !== -1) {
      // If todos array exists for the selected date
      const existingTodoIndex = todos[todosForSelectedDateIndex].todos.findIndex((item) => item.id === id);

      if (existingTodoIndex !== -1) {
        // If todo with the same ID exists, create a new one with a unique ID
        const uniqueId = getNextUniqueId();
        newTodo.setAttribute("data-todo-id", uniqueId);
        todos[todosForSelectedDateIndex].todos.push({ ...userInputData, id: uniqueId });
      } else {
        // Add the new todo to the existing todos
        todos[todosForSelectedDateIndex].todos.push({ ...userInputData, id });
      }
    } else {
      // Add a new entry for the date
      todos.push({ date: selectedDate, todos: [{ ...userInputData, id }] });
    }

    localStorage.setItem("todos", JSON.stringify(todos));
    injectTodosForSelectedDate(selectedDate);
    updateTodoCount(userInputData.date);
    updateCalendarCell(userInputData.date);

    clearInputFields();

    console.log(todos)
  }

  // Update the todo list for the selected date
  updateTodoList(selectedDate);

  editingTodoIndex = -1;
  originalTodo = null;

  // Ensure that edit mode is exited
  exitEditMode();
}

function getNextUniqueId() {
  // This function generates a unique ID for a new todo
  return (nextTodoId++).toString();
}


function deleteTodo(todoItem) {
  const todoItemId = todoItem.getAttribute("data-todo-id");
  console.log("Deleting Todo with ID:", todoItemId);
  console.log("Stored Todos:", todos);

  // Find the index of the todo item with the matching ID
  const todoIndex = todos.findIndex((item) => {
    // Check if the todo item has the nested structure and matches the ID
    if (item.id === todoItemId) {
      return true;
    } else if (item.todos && Array.isArray(item.todos)) {
      // Check nested todos for the matching ID
      return item.todos.some((nestedItem) => nestedItem.id === todoItemId);
    }

    return false;
  });

  if (todoIndex !== -1) {
    // Splice the array to remove the todo item at the found index
    const deletedTodo = todos.splice(todoIndex, 1)[0];

    console.log("Deleted Todo:", deletedTodo);

    localStorage.setItem("todos", JSON.stringify(todos));
    todoItem.remove();

    updateTodoCount(deletedTodo.date);
    updateCalendarCell(deletedTodo.date);

    // ... (rest of the function)
  } else {
    console.error("Todo item not found in storedTodos.");
  }
}


function allowUserEdit(todoItem) {
  const dateInputField = document.getElementById("dateInputField");
  const todoItemId = todoItem.getAttribute("data-todo-id");
  let existingTodoIndex = -1;

  for (let i = 0; i < todos.length; i++) {
    const topLevelTodo = todos[i];
    if (topLevelTodo.id === todoItemId) {
      existingTodoIndex = i;
      break;
    } else if (topLevelTodo.todos && Array.isArray(topLevelTodo.todos)) {
      existingTodoIndex = topLevelTodo.todos.findIndex((nestedItem) => nestedItem.id === todoItemId);
      if (existingTodoIndex !== -1) {
        break;
      }
    }
  }

  if (existingTodoIndex !== -1) {
    editingTodoIndex = existingTodoIndex;
    originalTodo = { ...todos[editingTodoIndex] };

    const userInputData = todos[existingTodoIndex];
    document.getElementById("titleInputField").value = userInputData.title;
    
    // Check if the time exists before setting the value
    if (userInputData.time) {
      document.getElementById("timeInputField").value = userInputData.time;
    }
    
    document.getElementById("textareaInputField").value = userInputData.textarea;

    dateInputField.value = userInputData.date;
    dateInputField.setAttribute("data-todo-id", todoItemId);
  } else {
    console.error("Selected todo item not found in the todo list.");
  }
}


function saveEditedTodo() {
  const dateInputField = document.getElementById("dateInputField");
  const todoItemId = dateInputField.getAttribute("data-todo-id");

  const editedTodo = findTodoById(todoItemId);

  if (editedTodo) {
    const editedTodoData = saveValues();
    editedTodo.id = todoItemId;

    // Update the properties of the found todo
    Object.assign(editedTodo, editedTodoData);

    // Update the displayed element if needed
    const editedTodoElement = createTodoElement(editedTodo, todoItemId);
    const existingTodoElement = document.querySelector(`[data-todo-id="${todoItemId}"]`);

    if (existingTodoElement) {
      existingTodoElement.innerHTML = editedTodoElement.innerHTML;
    } else {
      console.error("Existing todo element not found.");
    }

    storeTodo();

    updateTodoCount(editedTodo.date);
    updateCalendarCell(editedTodo.date);

    updateTodoList();

    clearInputFields();

    // Reset editing state
    editingTodoIndex = -1;
    originalTodo = null;
  } else {
    console.error("Edited todo not found in the todo list.");
  }
}
function storeTodo(callback) {
  if (todos && Array.isArray(todos)) {
    // Check if there are non-empty todos
    const hasNonEmptyTodo = todos.some(item =>
      item.date !== "" || item.time !== "" || item.title !== "" || item.textarea !== "");

    // Store todos in localStorage
    let todoString = JSON.stringify(todos);
    localStorage.setItem("todos", todoString);

    if (callback && typeof callback === 'function') {
      callback();
    }
  } else {
    // Handle the case where todos is null or not an array
    console.error("Invalid or uninitialized todos");
  }
}



function retrieveTodo() {
  let retString = localStorage.getItem("todos");
  todos = JSON.parse(retString) || []; // Ensure todos is always an array

  console.log("Retrieved todos:", todos); // Add this line for debugging

  if (Array.isArray(todos) && todos.length > 0) {
    const todoListElement = document.getElementById("todoList");
    todos.forEach(todoItem => {
      const injectTodo = createTodoElement(todoItem);
      todoListElement.appendChild(injectTodo);
    });
  }
}


function injectTodosForSelectedDate(selectedDate) {
  const todoListElement = document.getElementById("todoList");

  // Clear the existing todoList items
  while (todoListElement.firstChild) {
    todoListElement.removeChild(todoListElement.firstChild);
  }

  if (selectedDate) {
    const todosForSelectedDate = todos.filter((todoItem) => todoItem.date === selectedDate);

    if (todosForSelectedDate.length > 0) {
      // Set the value of the date input field to the selected date
      document.getElementById("dateInputField").value = selectedDate;

      todosForSelectedDate.forEach((todoItem) => {
        // Pass the target date to the createTodoElement function
        const injectTodo = createTodoElement(todoItem, todoItem.id, selectedDate);
        if (injectTodo) {
          todoListElement.appendChild(injectTodo);
        }
      });
    }
  }
}

function clearTodoList() {
  const todoListElement = document.getElementById("todoList");

  while (todoListElement.firstChild) {
    todoListElement.removeChild(todoListElement.firstChild);
  }

  injectTodosForSelectedDate();
  retrieveTodo();
}
function updateTodoCount(date) {
  const storedTodos = JSON.parse(localStorage.getItem("todos")) || [];
  const todosForDate = storedTodos.filter((todoItem) => todoItem.date === date);
  const todoCount = todosForDate.length;

  const todoCounts = JSON.parse(localStorage.getItem("todoCounts")) || {};
  todoCounts[date] = todoCount;
  localStorage.setItem("todoCounts", JSON.stringify(todoCounts));
}


function updateCalendarCell(date) {
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
}  

function updateTodoCountForCalendarCell(todoCountElement, year, month, day) {
  const date = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  const todoCounts = JSON.parse(localStorage.getItem("todoCounts")) || {};
  const todoCount = todoCounts[date] || 0;
  todoCountElement.textContent = todoCount > 0 ? todoCount.toString() : "";
}

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
function exitEditMode() {
  const dateInputField = document.getElementById("dateInputField");
  dateInputField.disabled = false;
}

function updateTodoList(selectedDate) {
  const todoListElement = document.getElementById("todoList");

  // Clear the existing todos in the list
  todoListElement.innerHTML = '';

  // Get the todos for the selected date
  const todosForSelectedDate = todos.filter((todoItem) => todoItem.date === selectedDate);

  // Inject todos into the list
  todosForSelectedDate.forEach((todoItem) => {
    const injectTodo = createTodoElement(todoItem, todoItem.id);
    todoListElement.appendChild(injectTodo);
  });
}


function findTodoById(todoItemId) {
  // Recursive function to find a todo by ID in the nested todos structure
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

  // Call the recursive function starting from the top-level todos
  return findTodo(todos);
}