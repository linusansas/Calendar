function allowUserEdit(todoData) {
  const dateInputField = document.getElementById("dateInputField");
  const editButton = document.getElementById("editButton");
  saveButton = document.getElementById("saveButton");
  if (editButton && saveButton) {
    dateInputField.value = todoData.date;
    document.getElementById("timeInputField").value = todoData.time;
    document.getElementById("titleInputField").value = todoData.title;
    document.getElementById("textareaInputField").value = todoData.textarea;

    saveButton.textContent = "Update";

    editButton.setAttribute("data-edit-id", todoData.id);

    const editId = editButton.getAttribute("data-edit-id");

    const editingTodoIndex = todos.findIndex(
      (todoItem) => todoItem.id === editId
    );
  }
}
