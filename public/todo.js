let todo = JSON.parse(localStorage.getItem("todos")) || [];
let todoCounts = {};

let editingTodoIndex = -1;
let originalTodo = null;

function saveValues() {
  const dateUserInput = document.getElementById("dateInputField").value;
  const timeUserInput = document.getElementById("timeInputField").value;
  const titleUserInput = document.getElementById("titleInputField").value;
  const textareaUserInput = document.getElementById("textareaInputField").value;
  console.log(todo)

  return {
    date: dateUserInput,
    time: timeUserInput,
    title: titleUserInput,
    textarea: textareaUserInput
  };
}

function createTodoElement(todoData, id) {
  const newTodo = document.createElement("li");
  const todoText = `
    <span>Title: ${todoData.title}</span><br>
    <span>Date: ${todoData.date}</span><br>
    <span>Time: ${todoData.time}</span><br>
    <span>Textarea: ${todoData.textarea}</span>`;
  newTodo.innerHTML = todoText;
  newTodo.setAttribute("data-todo-id", id);

  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'Delete';
  deleteButton.onclick = () => deleteTodo(newTodo);
  deleteButton.setAttribute("data-cy", "delete-todo-button")
  newTodo.appendChild(deleteButton);

  const editButton = document.createElement('button');
  editButton.textContent = 'Edit';
  editButton.setAttribute("data-cy", "edit-todo-button")
  editButton.onclick = () => allowUserEdit(newTodo);
  newTodo.appendChild(editButton);
  return newTodo;
}


function createTodo() {
  const userInputData = saveValues();
  const todoList = document.getElementById("todoList");
  const id = new Date().getTime().toString();
  const newTodo = createTodoElement(userInputData, id);

  const dateInputField = document.getElementById("dateInputField");
  if (dateInputField.disabled) {
    const existingTodoId = dateInputField.getAttribute("data-todo-id");
    const existingTodo = todoList.querySelector(`[data-todo-id="${existingTodoId}"]`);
    if (existingTodo) {
      existingTodo.replaceWith(newTodo);

      const existingTodoIndex = todo.findIndex((item) => item.id === existingTodoId);
      if (existingTodoIndex !== -1) {
        todo[existingTodoIndex] = { ...userInputData, id: existingTodoId };
      }
    }
  } else {
    console.log("New Todo:", newTodo);
    todoList.appendChild(newTodo);
    todo.push({ ...userInputData, id: id });
  }

  storeTodo();

  updateTodoCount(userInputData.date);
  updateCalendarCell(userInputData.date);

  clearInputFields();
}

    
function saveAndCreateTodo() {
  const dateInputField = document.getElementById("dateInputField");
  const selectedDate = dateInputField.value;
  const todoItemId = dateInputField.getAttribute("data-todo-id");
  const id = new Date().getTime().toString();

  const userInputData = saveValues();
  const newTodo = createTodoElement(userInputData, id);

  const storedTodos = JSON.parse(localStorage.getItem("todos")) || [];
  const todosForSelectedDate = storedTodos.filter((todoItem) => todoItem.date === selectedDate);

  if (todoItemId && !dateInputField.disabled) {
    saveEditedTodo(todoItemId);
  } else {
    console.log("New Todo:", newTodo);

    if (todosForSelectedDate.length > 0) {
      storedTodos.push({ ...userInputData, id });
    } else {
      storedTodos.push({ date: selectedDate, todos: [{ ...userInputData, id }] });
    }

    localStorage.setItem("todos", JSON.stringify(storedTodos));

    updateTodoCount(userInputData.date);
    updateCalendarCell(userInputData.date);

    clearInputFields();
  }

  storeTodo();
  console.log(todo);

  editingTodoIndex = -1;
  originalTodo = null;
}
function deleteTodo(todoItem) {
  const todoItemId = todoItem.getAttribute("data-todo-id");
  let storedTodos = JSON.parse(localStorage.getItem("todos")) || [];

  console.log("Deleting Todo with ID:", todoItemId);
  console.log("Stored Todos:", storedTodos);

  // Find the index of the todo item with the matching ID
  const todoIndex = storedTodos.findIndex((item) => item.id === todoItemId);

  if (todoIndex !== -1) {
    // Splice the array to remove the todo item at the found index
    const deletedTodo = storedTodos.splice(todoIndex, 1)[0];

    console.log("Deleted Todo:", deletedTodo);

    localStorage.setItem("todos", JSON.stringify(storedTodos));
    todoItem.remove();

    // Update the todo array in memory
    todo = storedTodos;

    updateTodoCount(deletedTodo.date);
    updateCalendarCell(deletedTodo.date);

    const calendarCells = document.querySelectorAll('[data-cy="calendar-cell-date"]');
    const formattedDate = new Date(deletedTodo.date).getDate();

    calendarCells.forEach((cell) => {
      if (cell.textContent === formattedDate.toString()) {
        const calendarCell = cell.closest('[data-cy="calendar-cell"]');
        if (calendarCell) {
          const todoCountElement = calendarCell.querySelector('[data-cy="calendar-cell-todos"]');
          if (todoCountElement) {
            todoCountElement.remove();
          }
        } else {
          console.error("Calendar cell not found.");
        }
      }
      updateCalendar();
    });

    console.log(todo);
  } else {
    console.error("Todo item not found in storedTodos.");
  }
}

function allowUserEdit(todoItem) {
  const dateInputField = document.getElementById("dateInputField");
  const todoItemId = todoItem.getAttribute("data-todo-id");
  const existingTodoIndex = todo.findIndex((item) => item.id === todoItemId);

  if (existingTodoIndex !== -1) {
    editingTodoIndex = existingTodoIndex;

    originalTodo = { ...todo[editingTodoIndex] };

    const userInputData = todo[existingTodoIndex];
    document.getElementById("titleInputField").value = userInputData.title;
    document.getElementById("timeInputField").value = userInputData.time;
    document.getElementById("textareaInputField").value = userInputData.textarea;

    dateInputField.value = userInputData.date;
    dateInputField.setAttribute("data-todo-id", todoItemId);

    console.log("Allowing user to edit todo with ID:", todoItemId);
    console.log("Original todo:", originalTodo);
    console.log("Data attributes set for date input field:", dateInputField.dataset);

    // Add additional logging to check todo array
    console.log("Current todo array:", todo);
    console.log("Todo item in array:", todo[existingTodoIndex]);
  } else {
    console.error("Selected todo item not found in the todo list.");
  }
}
    function saveEditedTodo(todoItemId) {
      const editedTodoIndex = todo.findIndex((item) => item.id === todoItemId);
      
      if (editedTodoIndex !== -1) {
        const editedTodoData = saveValues();
        todo[editedTodoIndex] = { ...editedTodoData, id: todoItemId };
        
        const editedTodoElement = createTodoElement(editedTodoData, todoItemId);
        const existingTodoElement = document.querySelector(`[data-todo-id="${todoItemId}"]`);
        
        if (existingTodoElement) {
          existingTodoElement.innerHTML = editedTodoElement.innerHTML;
        } else {
          console.error("Existing todo element not found.");
        }
        
        storeTodo();
        
        updateTodoCount(editedTodoData.date);
        updateCalendarCell(editedTodoData.date);
    
        clearInputFields();
      } else {
        console.error("Edited todo not found in the todo list.");
      }
    }

    function storeTodo(callback) {
      const hasNonEmptyTodo = todo.some(item => 
        item.date !== "" || item.time !== "" || item.title !== "" || item.textarea !== ""); 
    
      if (hasNonEmptyTodo) {
        let todoString = JSON.stringify(todo);
        localStorage.setItem("todos", todoString);
  
        if (callback && typeof callback === 'function') {
          callback();
        }
      }
    }
    
    function retrieveTodo() {
      let retString = localStorage.getItem("todos");
      let retrievedTodo = JSON.parse(retString);

      if (retrievedTodo && retrievedTodo.length > 0 ) {
        const todoList = document.getElementById("todoList");
        retrievedTodo.forEach(todoItem => {
          const injectTodo = createTodoElement(todoItem);
          todoList.appendChild(injectTodo);
        })
      }

    }
    function injectTodosForSelectedDate() {
      const todoList = document.getElementById("todoList");
      const selectedDate = document.getElementById("dateInputField").value;
  
      while (todoList.firstChild) {
        todoList.removeChild(todoList.firstChild);
      }
    
      if (selectedDate) {
        const storedTodos = JSON.parse(localStorage.getItem("todos")) || [];
    
        const todosForSelectedDate = storedTodos.filter((todoItem) => {
          return todoItem.date === selectedDate;
        });
    
        if (todosForSelectedDate.length > 0) {
          todosForSelectedDate.forEach((todoItem) => {
            const injectTodo = createTodoElement(todoItem);
            todoList.appendChild(injectTodo);
          });
        }
      }
    }
    
    function clearTodoList() {
      const todoList = document.getElementById("todoList");

      while (todoList.firstChild) {
        todoList.removeChild(todoList.firstChild);
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



function saveAndCreateTodo() {
  const dateInputField = document.getElementById("dateInputField");
  const todoItemId = dateInputField.getAttribute("data-todo-id");
  const id = new Date().getTime().toString();

  if (todoItemId && !dateInputField.disabled) {
    saveEditedTodo(todoItemId);
  } else {
    const userInputData = saveValues();
    const newTodo = createTodoElement(userInputData, id);

    console.log("TodoList:", todoList);
    console.log("New Todo:", newTodo);

    if (todoItemId) {
      const existingTodo = todoList.querySelector(`[data-todo-id="${todoItemId}"]`);
      if (existingTodo) {
        existingTodo.replaceWith(newTodo);

        const existingTodoIndex = todo.findIndex((item) => item.id === todoItemId);
        if (existingTodoIndex !== -1) {
          todo[existingTodoIndex] = { ...userInputData, id: todoItemId };
        }
      }
    } else {
      console.log("Appending new todo to the list:", newTodo);
      console.log("TodoList Element:", todoList);
      todoList.appendChild(newTodo);
      todo.push({ ...userInputData, id: id });
    }

    storeTodo();

    updateTodoCount(userInputData.date);
    updateCalendarCell(userInputData.date);

    clearInputFields();
  }
  storeTodo();
  console.log(todo);

  editingTodoIndex = -1;
  originalTodo = null;
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
