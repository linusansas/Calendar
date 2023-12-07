function openEditModal() {
    const editModal = document.getElementById("editModal");
    editModal.style.display = "block";
  
    const titleInput = document.getElementById("editTitle");
    const timeInput = document.getElementById("editTime");
    const textareaInput = document.getElementById("editTextarea");
  
    const todoToEdit = todos[editingTodoIndex];
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
   document.getElementById("editTitle").value = todoItem.title;
   document.getElementById("editTime").value = todoItem.time || "";
   document.getElementById("editTextarea").value = todoItem.textarea || "";

   // Show the edit modal
   const editModal = document.getElementById("editModal");
   editModal.style.display = "block";
}

  function saveEditedTodo() {
    // Retrieve values from the modal
    const editedTitle = document.getElementById("editTitle").value;
    const editedTime = document.getElementById("editTime").value;
    const editedTextarea = document.getElementById("editTextarea").value;
  
    // Update the todo data
    const editedTodo = todos[editingTodoIndex];
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
  function closeEditModal() {
    // Close the edit modal
    const editModal = document.getElementById("editModal");
    editModal.style.display = "none";
 }