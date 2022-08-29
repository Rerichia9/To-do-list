(function () {
  let listArray = [],
    listName = ''

  function createAppTitle(title) {
    let appTitle = document.createElement('h2');
    appTitle.innerHTML = title;
    return appTitle;
  }


  // создаем и возврат формы создания дела
  function createTodoItemForm() {
    let form = document.createElement('form');
    let input = document.createElement('input');
    let buttonWrapper = document.createElement('div');
    let button = document.createElement('button');

    form.classList.add('input-group', 'mb-3');
    input.classList.add('form-control', 'form__input');
    input.placeholder = 'Введите название нового дела';
    buttonWrapper.classList.add('input-group-append');
    button.classList.add('btn', 'btn-primary');
    button.textContent = 'Добавить дело';

    button.disabled = true;

    buttonWrapper.append(button);
    form.append(input);
    form.append(buttonWrapper);

    // проверяем, если у нас есть что-то в input, то разблокируем кнопку
    input.addEventListener('input', function () {
      if (input.value !== "") {
        button.disabled = false
      } else {
        button.disabled = true
      }
    })

    return {
      form,
      input,
      button,
    };
  }

  // создаем список заданий
  function createTodoList() {
    let list = document.createElement('ul');
    list.classList.add('list-group');
    return list;
  }

  // создаем элемент
  function createTodoItem(obj) {
    let item = document.createElement('li');
    let buttonGroup = document.createElement('div');
    let doneButton = document.createElement('button');
    let deleteButton = document.createElement('button');

    // Стили для элемента списка, а также для размещения кнопок
    item.classList.add('list__item', 'list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
    item.textContent = obj.name;

    buttonGroup.classList.add('btn-group', 'btn-group-sm');
    doneButton.classList.add('btn', 'btn-success');
    doneButton.textContent = 'Готово';
    deleteButton.classList.add('btn', 'btn-danger');
    deleteButton.textContent = 'Удалить';

    // меняем статус объекта
    if (obj.done == true) item.classList.add('list-group-item-success');

    doneButton.addEventListener('click', function () {
      item.classList.toggle('list-group-item-success')
      // Получаем первое текстовое значение у объекта (в нашем случае имя)

      // Проходим по массиву, ищем такое же имя как у объекта и сравниваем статус done
      for (const listItem of listArray) {
        if (listItem.id == obj.id) listItem.done = !listItem.done
      }
      saveList(listArray, listName)
    })
    deleteButton.addEventListener('click', function () {
      if (confirm('Вы уверены?')) {
        item.remove();

        // удаляем из массива удаленные дела
        for (let i = 0; i < listArray.length; i++) {
          if (listArray[i].id == obj.id) listArray.splice(i, 1)
        }
        saveList(listArray, listName)
      }
    })

    // Вкладываем кновки в див
    buttonGroup.append(doneButton);
    buttonGroup.append(deleteButton);
    item.append(buttonGroup);

    // Доступ приложению к элементу и кнопкам, чтобы обрабатывать события нажатия
    return {
      item,
      doneButton,
      deleteButton,
    }
  }

  // Задаем каждому новому делу уникальный идентификатор
  function getNewId(arr) {
    let max = 0;
    for (const item of arr) {
      if (item.id > max) max = item.id
    }
    return max + 1;
  }

  function saveList(arr, keyName) {
    // Преобразовываем массив в строчку, потому-что локал стрэдж не может хранить массивы
    localStorage.setItem(keyName, JSON.stringify(arr));
  }

  function createTodoApp(container, title = 'Список дел', keyName, def = []) {
    let todoAppTitle = createAppTitle(title);
    let todoItemForm = createTodoItemForm();
    let todoList = createTodoList();

    // Чтобы кейнейм был для глобального доступа
    listName = keyName;
    listArray = def;

    container.append(todoAppTitle);
    container.append(todoItemForm.form);
    container.append(todoList);

    let localData = localStorage.getItem(listName)

    if (localData !== null && localData !== '') listArray = JSON.parse(localData)

    for (let itemList of listArray) {
      let todoItem = createTodoItem(itemList);
      todoList.append(todoItem.item);
    }

    // submit чтобы можно было отправлять фотрму нажатием на Enter
    todoItemForm.form.addEventListener('submit', function (e) {

      // чтобы страница не обновлялась при отправке формы
      e.preventDefault();

      if (!todoItemForm.input.value) {
        return;
      }

      let newItem = {
        id: getNewId(listArray),
        name: todoItemForm.input.value,
        done: false
      }

      let todoItem = createTodoItem(newItem);

      listArray.push(newItem)

      saveList(listArray, listName)

      todoList.append(todoItem.item);

      // после того как ввели дело, кнопка становится недоступна
      todoItemForm.button.disabled = true;

      todoItemForm.input.value = '';
    })
  }

  window.createTodoApp = createTodoApp;

})();
