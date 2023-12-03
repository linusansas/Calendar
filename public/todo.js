let todo = [];
let todoCounts = {};

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

    function createTodoElement(todoData) {
      const newTodo = document.createElement("li");
      const todoText = `
        <span>${todoData.title}</span><br>
        <span>${todoData.date}</span><br>
        <span>${todoData.time}</span><br>
        <span>${todoData.textarea}</span>`;
      newTodo.innerHTML = todoText;

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
      const newTodo = createTodoElement(userInputData);

      todoList.appendChild(newTodo);
      todo.push(userInputData);
      storeTodo();

      updateTodoCount(userInputData.date);
      updateCalendarCell(userInputData.date);
    }

    function saveAndCreateTodo() {
      saveValues();
      createTodo();
      storeTodo();

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
        console.log(todo);
      } else {
        console.error("Invalid index or storedTodos is empty.");
      }
    }

    function allowUserEdit(todoItem) {
      todoItem.querySelectorAll('span').forEach(span => {
        span.setAttribute('contenteditable', 'true');
      });
    }
    function storeTodo() {
      const hasNonEmptyTodo = todo.some(item => 
        item.date !== "" || item.time !== "" || item.title !== "" || item.textarea !== ""); 
        if (hasNonEmptyTodo) {
        let todoString = JSON.stringify(todo);
        localStorage.setItem("todos", todoString);
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
      const todoCountElement = cell.parentNode.querySelector('[data-cy="calendar-cell-todos"]');
      const day = formattedDate;
      updateTodoCountForCalendarCell(todoCountElement, currentYear, currentMonth, day);
    }
  });
}

function updateTodoCountForCalendarCell(todoCountElement, year, month, day) {
  const date = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  const todoCounts = JSON.parse(localStorage.getItem("todoCounts")) || {};
  const todoCount = todoCounts[date] || 0;
  todoCountElement.textContent = todoCount > 0 ? todoCount.toString() : "";
}
