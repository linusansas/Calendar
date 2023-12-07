function openEditModal() {
    const editModal = document.getElementById("editModal");
    editModal.style.display = "block";

    const dateInput = document.getElementById("dateInputField");
    const titleInput = document.getElementById("editTitle");
    const timeInput = document.getElementById("editTime");
    const textareaInput = document.getElementById("editTextarea");
    
  
    const todoToEdit = findTodoById(editingTodoId); // Use findTodoById to get the todo by id
    dateInput.value = todoToEdit.date;
    titleInput.value = todoToEdit.title;
    timeInput.value = todoToEdit.time || "";
    textareaInput.value = todoToEdit.textarea;
}

function closeEditModal() {
    const editModal = document.getElementById("editModal");
    editModal.style.display = "none";
}

function allowUserEdit(todoItem) {

    // Populate modal fields with todoItem data
    document.getElementById("dateInputField");
    document.getElementById("editTitle").value = todoItem.title;
    document.getElementById("editTime").value = todoItem.time || "";
    document.getElementById("editTextarea").value = todoItem.textarea || "";

    // Set the editingTodoId to the id of the todoItem
    editingTodoId = todoItem.id;

    // Set the date input field to the date of the selected todoItem
    const dateInputField = document.getElementById("dateInputField");
    dateInputField.value = todoItem.date;

    // Show the edit modal
    openEditModal();
}


function saveEditedTodo() {
    // Retrieve values from the modal
    const editedDate = document.getElementById("editDate").value;
    const editedTitle = document.getElementById("editTitle").value;
    const editedTime = document.getElementById("editTime").value;
    const editedTextarea = document.getElementById("editTextarea").value;
    
  
    // Update the todo data
    const editedTodo = findTodoById(editingTodoId); // Use findTodoById to get the todo by id
    editedDate.date = editedDate;
    editedTodo.title = editedTitle;
    editedTodo.time = editedTime;
    editedTodo.textarea = editedTextarea;
  
    // Save changes to local storage
    storeTodo();
  
    // Update the calendar and todo list
    updateCalendar();
    updateTodoList();
  
    // Close the edit modal
    closeEditModal();
}

// Declare a global variable for storing the id of the todo being edited
let editingTodoId = null;

function findTodoById(todoItemId) {
    // Function to find a todo by its id
    for (const todo of todos) {
        if (todo.id === todoItemId) {
            return todo;
        } else if (todo.todos && Array.isArray(todo.todos)) {
            const nestedTodo = findTodoById(todo.todos, todoItemId);
            if (nestedTodo) {
                return nestedTodo;
            }
        }
    }
    return null;
}
