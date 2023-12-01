let todo = [];

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
    }

    function saveAndCreateTodo() {
      saveValues();
      createTodo();
      storeTodo();

    }

    function deleteTodo(todoItem) {
      const index = Array.from(todoItem.parentNode.children).indexOf(todoItem);

      todo.splice(index, 1);
      todoItem.remove();
      console.log(todo);
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

      console.log(retrievedTodo)
    }