// function allowUserEdit(todoData) {
//   // Get references to various DOM elements
//   const dateInputField = document.getElementById("dateInputField");
//   const editButton = document.getElementById("editButton");
//   saveButton = document.getElementById("saveButton");
//   // Check if the editButton exists
//   if (editButton && saveButton) {
//     // Set values in the input fields based on todoData
//     dateInputField.value = todoData.date;
//     document.getElementById("timeInputField").value = todoData.time;
//     document.getElementById("titleInputField").value = todoData.title;
//     document.getElementById("textareaInputField").value = todoData.textarea;

//     // Change the textContent of the saveButton to 'Update'
//     saveButton.textContent = "Update";

//     // Set the data-edit-id attribute on the editButton with the todoData.id
//     editButton.setAttribute("data-edit-id", todoData.id);

//     // Use the data-edit-id directly as the editId
//     const editId = editButton.getAttribute("data-edit-id");

//     // Now you can use editId instead of todoData.id in your code
//     // For example, you can use it to find the index in the todos array
//     const editingTodoIndex = todos.findIndex(
//       (todoItem) => todoItem.id === editId
//     );
//   }
// }

function allowUserEdit(todoData) {
  const dateInputField = document.getElementById("dateInputField");
  const timeInputField = document.getElementById("timeInputField");
  const titleInputField = document.getElementById("titleInputField");
  const textareaInputField = document.getElementById("textareaInputField");
  const saveButton = document.getElementById("saveButton");

  if (
    dateInputField &&
    timeInputField &&
    titleInputField &&
    textareaInputField &&
    saveButton
  ) {
    dateInputField.value = todoData.date;
    timeInputField.value = todoData.time;
    titleInputField.value = todoData.title;
    textareaInputField.value = todoData.textarea;

    // Change the textContent of the saveButton to 'Update'
    saveButton.textContent = "Update";

    // Set a custom data attribute to indicate that it's an edit
    saveButton.setAttribute("data-edit-id", todoData.id);
  }
}

// ????? this is not used anywhere
// function saveEditedTodo() {
//   // Get the edit ID from the edit button
//   const editId = document
//     .getElementById("editButton")
//     .getAttribute("data-edit-id");

//   // Find the index of the todo item being edited
//   const editingTodoIndex = todos.findIndex(
//     (todoItem) => todoItem.id === editId
//   );

//   // Get the edited todo data
//   const editedTodoData = saveValues();

//   if (editingTodoIndex !== -1) {
//     // Update the existing todo item with the edited data
//     todos[editingTodoIndex] = { ...todos[editingTodoIndex], ...editedTodoData };

//     // Store the updated todos
//     storeTodo();

//     // Update the UI
//     updateCalendar();
//     updateTodoList();
//     clearInputFields();

//     // Reset editing state
//     editingTodoIndex = -1;
//     originalTodo = null;

//     // Change the textContent of the saveButton back to 'Save'
//     saveButton.textContent = "Save";
//   } else {
//     console.error("Edited todo not found in the todo list.");
//   }
// }
