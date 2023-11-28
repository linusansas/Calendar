function saveValues() {
  const titleInputFieldValue = document.getElementById('titleInputField').value;
  const timeInputFieldValue = document.getElementById('timeInputField').value;
  const descriptionFieldValue = document.getElementById('descriptionInputField').value;

  const todoValues = {
      titleField: titleInputFieldValue,
      timeField: timeInputFieldValue,
      descriptionField: descriptionFieldValue
  }
  localStorage.setItem('todo', JSON.stringify(todoValues))
alert('Values saved to local storage!');
}

function deleteValuesAndLocalStorage() {
  document.getElementById('titleInputField').value = '';
  document.getElementById('timeInputField').value = '';
  document.getElementById('descriptionInputField').value = '';

  localStorage.removeItem('todo');
}
function openTodoList(year, month, day) {
  const key = `${year}-${month + 1}-${day}`;
  const todoListForDay = todoLists[key] || [];
  console.log(`Todo List for ${key}:`, todoListForDay);
}