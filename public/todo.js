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
  newTodo.setAttribute("data-todo-id", id); // Set the data-todo-id attribute

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
  const id = new Date().getTime().toString(); // or use any suitable method to generate an ID
  const newTodo = createTodoElement(userInputData, id);

  // Check if dateInputField is disabled (editing mode)
  const dateInputField = document.getElementById("dateInputField");
  if (dateInputField.disabled) {
    // If in editing mode, find the existing todo and replace it
    const existingTodoId = dateInputField.getAttribute("data-todo-id");
    const existingTodo = todoList.querySelector(`[data-todo-id="${existingTodoId}"]`);
    if (existingTodo) {
      existingTodo.replaceWith(newTodo);

      // Update or add the todo to the array
      const existingTodoIndex = todo.findIndex((item) => item.id === existingTodoId);
      if (existingTodoIndex !== -1) {
        // If the todo already exists, replace it
        todo[existingTodoIndex] = { ...userInputData, id: existingTodoId };
      }
    }
  } else {
    // If not in editing mode, proceed with creating a new todo
    console.log("New Todo:", newTodo);
    todoList.appendChild(newTodo);
    // Update or add the todo to the array
    todo.push({ ...userInputData, id: id });
  }

  // Store the updated todo
  storeTodo();

  // Update todo count and calendar cell
  updateTodoCount(userInputData.date);
  updateCalendarCell(userInputData.date);

  // Clear input fields
  clearInputFields();
}

    
function saveAndCreateTodo() {
  const dateInputField = document.getElementById("dateInputField");
  const todoItemId = dateInputField.getAttribute("data-todo-id");
  const id = new Date().getTime().toString(); // or use any suitable method to generate an ID

  if (todoItemId && !dateInputField.disabled) {
    // If an existing todo is being edited, save the edited todo
    saveEditedTodo(todoItemId); // Pass todoItemId as a parameter
  } else {
    // If not in editing mode, save values and create a new todo
    const userInputData = saveValues();
    createTodoElement(userInputData, id); // Pass id as a parameter
    createTodo();
  }

  // Always store the updated todo
  storeTodo();
  console.log(todo);

  // Reset the editingTodoIndex and originalTodo
  editingTodoIndex = -1;
  originalTodo = null;
}



    
    
    
    
    
    

    function deleteTodo(todoItem) {
      const index = Array.from(todoItem.parentNode.children).indexOf(todoItem);
      let storedTodos = JSON.parse(localStorage.getItem("todos")) || [];
    
      if (storedTodos.length > index) {
        const deletedTodo = storedTodos.splice(index, 1)[0];
    
        // Log information about the deletedTodo
        console.log("Deleted Todo:", deletedTodo);
    
        localStorage.setItem("todos", JSON.stringify(storedTodos));
        todoItem.remove();
    
        updateTodoCount(deletedTodo.date);
        updateCalendarCell(deletedTodo.date);
    
        // Find the parent calendar cell based on the date
        const calendarCells = document.querySelectorAll('[data-cy="calendar-cell-date"]');
        const formattedDate = new Date(deletedTodo.date).getDate();
    
        calendarCells.forEach((cell) => {
          if (cell.textContent === formattedDate.toString()) {
            const calendarCell = cell.closest('[data-cy="calendar-cell"]');
            if (calendarCell) {
              // Find and remove the todo count element
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
        console.error("Invalid index or storedTodos is empty.");
      }
    }
    
    
    
    
    
    
    function allowUserEdit(todoItem) {
      const dateInputField = document.getElementById("dateInputField");
      const todoItemId = todoItem.getAttribute("data-todo-id");
    
      // Find the existing todo based on the ID
      const existingTodoIndex = todo.findIndex((item) => item.id === todoItemId);
    
      if (existingTodoIndex !== -1) {
        // Store the index for later use
        editingTodoIndex = existingTodoIndex;
    
        // Store the original todo item
        originalTodo = { ...todo[editingTodoIndex] };
    
        // Set the current todo values in the input fields
        const userInputData = todo[existingTodoIndex];
        document.getElementById("titleInputField").value = userInputData.title;
        document.getElementById("timeInputField").value = userInputData.time;
        document.getElementById("textareaInputField").value = userInputData.textarea;
    
        // Set the date input field value
        dateInputField.value = userInputData.date;
        dateInputField.setAttribute("data-todo-id", todoItemId);
    
        // Log information for debugging
        console.log("Allowing user to edit todo with ID:", todoItemId);
        console.log("Original todo:", originalTodo);
        console.log("Data attributes set for date input field:", dateInputField.dataset);
      } else {
        console.error("Selected todo item not found in the todo list.");
      }
    }
    
    function saveEditedTodo(todoItemId) {
      // Add your implementation to save the edited todo
      const editedTodoIndex = todo.findIndex((item) => item.id === todoItemId);
      
      if (editedTodoIndex !== -1) {
        // Assuming saveValues returns an object with properties (date, time, title, textarea)
        const editedTodoData = saveValues();
        todo[editedTodoIndex] = { ...editedTodoData, id: todoItemId };
        
        // Replace the existing todo element with the updated one
        const editedTodoElement = createTodoElement(editedTodoData, todoItemId);
        const existingTodoElement = document.querySelector(`[data-todo-id="${todoItemId}"]`);
        
        if (existingTodoElement) {
          // Replace the content of the existing todo element
          existingTodoElement.innerHTML = editedTodoElement.innerHTML;
        } else {
          console.error("Existing todo element not found.");
        }
        
        // Store the updated todo
        storeTodo();
        
        // Update todo count and calendar cell
        updateTodoCount(editedTodoData.date);
        updateCalendarCell(editedTodoData.date);
    
        // Clear input fields or perform any additional actions as needed
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
    
        // Call the callback if provided
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
    
      // Clear the todo list
      while (todoList.firstChild) {
        todoList.removeChild(todoList.firstChild);
      }
    
      if (selectedDate) {
        const storedTodos = JSON.parse(localStorage.getItem("todos")) || [];
    
        // Filter todos for the selected date
        const todosForSelectedDate = storedTodos.filter((todoItem) => {
          return todoItem.date === selectedDate;
        });
    
        // If there are todos for the selected date, display them
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
    
      // Update todo count in local storage
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
    
          // Ensure that cell has a parent node before attempting to append
          if (cell.parentNode) {
            let todoCountElement = cell.parentNode.querySelector('[data-cy="calendar-cell-todos"]');
    
            // Check if todoCountElement exists, if not, create and append it
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
  const id = new Date().getTime().toString(); // or use any suitable method to generate an ID

  // Save the edited todo if in editing mode, else create a new todo
  if (todoItemId && !dateInputField.disabled) {
    saveEditedTodo(todoItemId);
  } else {
    // If not in editing mode, save values and create a new todo
    const userInputData = saveValues();
    const newTodo = createTodoElement(userInputData, id);

    console.log("TodoList:", todoList);
    console.log("New Todo:", newTodo);

    if (todoItemId) {
      // If in editing mode, replace the existing todo
      const existingTodo = todoList.querySelector(`[data-todo-id="${todoItemId}"]`);
      if (existingTodo) {
        existingTodo.replaceWith(newTodo);

        // Update or add the todo to the array
        const existingTodoIndex = todo.findIndex((item) => item.id === todoItemId);
        if (existingTodoIndex !== -1) {
          // If the todo already exists, replace it
          todo[existingTodoIndex] = { ...userInputData, id: todoItemId };
        }
      }
    } else {
      // If not in editing mode, directly append the new todo to the list
      console.log("Appending new todo to the list:", newTodo);
      console.log("TodoList Element:", todoList);
      todoList.appendChild(newTodo);
      // Update or add the todo to the array
      todo.push({ ...userInputData, id: id });
    }

    // Store the updated todo
    storeTodo();

    // Update todo count and calendar cell
    updateTodoCount(userInputData.date);
    updateCalendarCell(userInputData.date);

    // Clear input fields
    clearInputFields();
  }

  // Always store the updated todo
  storeTodo();
  console.log(todo);

  // Reset the editingTodoIndex and originalTodo
  editingTodoIndex = -1;
  originalTodo = null;
}






function clearInputFields() {
  const dateInputField = document.getElementById("dateInputField");
  const timeInputField = document.getElementById("timeInputField");
  const titleInputField = document.getElementById("titleInputField");
  const textareaInputField = document.getElementById("textareaInputField");

  // Check if the elements are found before accessing their properties
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
  // You can perform any necessary actions to exit the editing mode
  // For example, enable input fields, reset flags, etc.
  const dateInputField = document.getElementById("dateInputField");
  dateInputField.disabled = false;
  // You might need additional logic depending on your specific requirements
}
