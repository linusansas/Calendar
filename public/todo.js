function saveValues() {
  const titleInputFieldValue = document.getElementById('titleInputField').value;
  const timeInputFieldValue = document.getElementById('timeInputField').value;
  const dateFieldValue = document.getElementById('dateInputField').value;
  const textareaFieldValue = document.getElementById('textareaInputField').value;

  const todoValues = {
      titleField: titleInputFieldValue,
      timeField: timeInputFieldValue,
      dateField: dateFieldValue,
      textareaField: textareaFieldValue
  }

  const jsonStringTodo = JSON.stringify(todoValues);


  
  localStorage.setItem('todo', JSON.stringify(todoValues))
  alert('Values saved to local storage!');

  function listValues() {
    const parsedTodoValues = JSON.parse(jsonStringTodo);
    const listItem = document.createElement('li');
    listItem.textContent = `Title: ${parsedTodoValues.titleField}, Time: ${parsedTodoValues.timeField}, Date: ${parsedTodoValues.dateField}, Textarea: ${parsedTodoValues.textareaField}`;
    document.getElementById('storedItemList').appendChild(listItem);
  }

  listValues()
}

function deleteValuesAndLocalStorage() {
  document.getElementById('titleInputField').value = '';
  document.getElementById('timeInputField').value = '';
  document.getElementById('dateInputField').value = '';
  document.getElementById('textareaInputField').value = '';

  localStorage.removeItem('todo');
}
function loadLocalStorage() {
  const todoString = localStorage.getItem('todo');
  if (todoString) {
    const todoValues = JSON.parse(todoString);
    document.getElementById('titleInputField').value = todoValues.titleField || '';
    document.getElementById('timeInputField').value = todoValues.timeField || '';
    document.getElementById('dateInputField').value = todoValues.dateField || '';
    document.getElementById('textareaInputField').value = todoValues.textareaField || '';
  }
}
