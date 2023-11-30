
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
  };
  const jsonStringTodo = JSON.stringify(todoValues);
  localStorage.setItem('todo', JSON.stringify(todoValues))

  function listTodoValues() {
    const parsedTodoValues = JSON.parse(jsonStringTodo);
  
    const listItem = document.createElement('li');
    listItem.textContent = `Title: ${parsedTodoValues.titleField}, Time: ${parsedTodoValues.timeField}, Date: ${parsedTodoValues.dateField}, Textarea: ${parsedTodoValues.textareaField}`;

    const newDeleteButton = document.createElement('button');
    newDeleteButton.textContent = 'Delete';
    newDeleteButton.setAttribute('data-cy', 'delete-todo-button');
    newDeleteButton.addEventListener('click', () => {
      deleteListItem(listItem);
    });
    listItem.appendChild(newDeleteButton);
    document.getElementById('storedItemList').appendChild(listItem);

    const storeLiChild = localStorage.getItem('storeLiChild')
    ? JSON.parse(localStorage.getItem('storeLiChild'))
    : [];

    storeLiChild.push(jsonStringTodo);
    localStorage.setItem('storeLiChild', JSON.stringify(storeLiChild));
}

function deleteListItem(item) {

  const readLiChildren = JSON.parse(localStorage.getItem('storeLiChild'));
  const indexToRemove = readLiChildren.findIndex((itemString) => itemString === jsonStringTodo);

  if (indexToRemove !== -1) {
    readLiChildren.splice(indexToRemove, 1);
    localStorage.setItem('storeLiChild', JSON.stringify(readLiChildren));
  }

  item.parentNode.removeChild(item);

}
  listTodoValues()
}

function deleteValuesAndLocalStorage() {
  document.getElementById('titleInputField').value = '';
  document.getElementById('timeInputField').value = '';
  document.getElementById('dateInputField').value = '';
  document.getElementById('textareaInputField').value = '';

  localStorage.removeItem('todo');
  localStorage.removeItem('storeLiChild');
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