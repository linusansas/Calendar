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

    saveButton.textContent = "Update";

    saveButton.setAttribute("data-edit-id", todoData.id);
  }
}