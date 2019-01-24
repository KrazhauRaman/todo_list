/* eslint-disable no-param-reassign */
/* eslint-disable no-use-before-define */
/* eslint-disable no-undef */

// local storage
const storage = localStorage;

// control elements
const addBtn = document.querySelector('#add-task-btn');
const closeBtn = document.querySelector('#close-btn');
const saveTaskBtn = document.querySelector('#save-task-btn');

// inputs
const dateInput = document.querySelector('#date-input');
const taskInput = document.querySelector('#task-input');

// new task popup
const newTaksPopup = document.querySelector('#task-box');

// task list
const tasklist = document.querySelector('#task-list');
const taskArray = (loadTaskList()) ? JSON.parse(loadTaskList()) : [];

// sorting
const dateSortBtn = document.querySelector('#sort-date-btn');
const textSortBtn = document.querySelector('#sort-text-btn');
const currentSortSettings = { type: 'date', direction: 'up' };

// filtering
const dateFilterInput = document.querySelector('#filter-by-date');
const taskFIlterInput = document.querySelector('#filter-by-task');
const dateFilterClear = document.querySelector('#clear-filter-by-date');
const taskFIlterClear = document.querySelector('#clear-filter-by-task');
const currentFilters = { date: '', task: '' };

let filteredTaskArray = [];

// id for tasks id
let id = 0;

// if there are tasks in storage
if (taskArray) {
  renderTaskList();
}


function popupToggle() {
  newTaksPopup.classList.toggle('appear');
  dateInput.value = '';
  taskInput.value = '';
}


addBtn.addEventListener('click', popupToggle);
closeBtn.addEventListener('click', popupToggle);


// check for inputs values. if there is nothing in input user'll see error animation
function checkInputValue(input) {
  if (!input.value) {
    input.classList.add('error');
    setTimeout(() => {
      input.classList.remove('error');
    }, 1000);
  }
}

dateInput.addEventListener('input', () => {
  if (this.value) {
    this.classList.remove('error');
  }
});

taskInput.addEventListener('input', () => {
  if (this.value) {
    this.classList.remove('error');
  }
});


// new task creating
saveTaskBtn.addEventListener('click', () => {
  checkInputValue(dateInput);
  checkInputValue(taskInput);

  if (dateInput.value && taskInput.value) {
    const newTask = {
      id,
      date: dateInput.value,
      task: taskInput.value,
      completed: false,
    };
    taskArray.push(newTask);
    id += 1;
    popupToggle();

    saveTaskList();
    renderTaskList();
  }
});


// task list creating
function renderTaskList() {
  while (tasklist.firstChild) {
    tasklist.removeChild(tasklist.firstChild);
  }

  generateFilteredTasklist();
  applySorting();

  function generateTaskHtml(task) {
    const taskDiv = document.createElement('div');
    const taskDivTop = document.createElement('div');
    const dateSpan = document.createElement('span');
    const checkDiv = document.createElement('div');
    const completedCheck = document.createElement('input');
    const completedLabel = document.createElement('label');
    const deleteBtn = document.createElement('button');
    const taskText = document.createElement('textarea');

    taskDiv.classList.add('task-div', 'card', 'border-primary', 'mb-3');
    taskDivTop.classList.add('card-header', 'task-div-top');
    if (task.completed) {
      taskDivTop.classList.add('completed');
    }
    dateSpan.classList.add('task-div-date');
    checkDiv.classList.add('custom-control', 'custom-checkbox');
    completedCheck.classList.add('custom-control-input');
    completedLabel.classList.add('custom-control-label');
    deleteBtn.classList.add('btn', 'btn-danger', 'delete-btn');
    taskText.classList.add('task-div-text');

    taskDiv.setAttribute('id', `task-div-${task.id}`);
    completedCheck.setAttribute('type', 'checkbox');
    completedCheck.setAttribute('id', `completedCheck-${task.id}`);
    completedLabel.setAttribute('for', `completedCheck-${task.id}`);
    taskText.setAttribute('disabled', true);

    completedCheck.dataset.id = task.id;

    dateSpan.innerHTML = task.date;
    taskText.innerHTML = task.task;
    completedCheck.checked = task.completed;
    completedLabel.innerHTML = 'Completed';
    deleteBtn.innerHTML = 'Delete';


    completedCheck.addEventListener('input', () => {
      taskDivTop.classList.toggle('completed');
      task.completed = !task.completed;
    });

    deleteBtn.addEventListener('click', () => {
      deleteTask(task.id);
    });

    taskDiv.appendChild(taskDivTop);
    taskDiv.appendChild(taskText);
    taskDivTop.appendChild(dateSpan);
    taskDivTop.appendChild(checkDiv);
    checkDiv.appendChild(completedCheck);
    checkDiv.appendChild(completedLabel);
    taskDivTop.appendChild(deleteBtn);

    return (taskDiv) ;
  }

  for (let task of filteredTaskArray) {
    tasklist.appendChild(generateTaskHtml(task));
    tasklist.lastChild.classList.add('task-div-appear');
  }
}


// task deleting
function deleteTask(taskId) {
  const indexForDel = taskArray.findIndex(t => t.id === taskId);
  taskArray.splice(indexForDel, 1);

  saveTaskList();
  renderTaskList();
}


// sorting
dateSortBtn.addEventListener('click', e => setSortSettings(e));
textSortBtn.addEventListener('click', e => setSortSettings(e));

function setSortSettings(e) {
  if (e.currentTarget.dataset.type === currentSortSettings.type) {
    if (currentSortSettings.direction === 'up') {
      currentSortSettings.direction = 'down';
      e.currentTarget.querySelector('i').classList.remove('fa-angle-up');
      e.currentTarget.querySelector('i').classList.add('fa-angle-down');
    } else {
      currentSortSettings.direction = 'up';
      e.currentTarget.querySelector('i').classList.remove('fa-angle-down');
      e.currentTarget.querySelector('i').classList.add('fa-angle-up');
    }
  } else {
    currentSortSettings.direction = 'up';

    if (currentSortSettings.type === 'date') {
      currentSortSettings.type = 'text';

      dateSortBtn.classList.remove('btn-outline-success');
      dateSortBtn.classList.add('btn-primary');
      dateSortBtn.querySelector('i').classList.remove('fa-angle-up');
      dateSortBtn.querySelector('i').classList.remove('fa-angle-down');

      textSortBtn.classList.add('btn-outline-success');
      textSortBtn.classList.remove('btn-primary');
      textSortBtn.querySelector('i').classList.add('fa-angle-up');
    } else {
      currentSortSettings.type = 'date';

      textSortBtn.classList.remove('btn-outline-success');
      textSortBtn.classList.add('btn-primary');
      textSortBtn.querySelector('i').classList.remove('fa-angle-up');
      textSortBtn.querySelector('i').classList.remove('fa-angle-down');

      dateSortBtn.classList.add('btn-outline-success');
      dateSortBtn.classList.remove('btn-primary');
      dateSortBtn.querySelector('i').classList.add('fa-angle-up');
    }
  }

  renderTaskList();
}


function applySorting() {
  const { type, direction } = currentSortSettings;

  if (type === 'date') {
    filteredTaskArray.sort((a, b) => {
      aDate = a.date.split('-');
      bDate = b.date.split('-');

      for (let i = 0; i < 3; i += 1) {
        if (aDate[i] < bDate[i]) { return -1; }

        if (aDate[i] > bDate[i]) { return 1; }
      }
      return 0;
    });
  } else {
    filteredTaskArray.sort(
      (a, b) => a.task.localeCompare(b.task),
    );
  }

  if (direction === 'down') {
    filteredTaskArray.reverse();
  }
}


// filtering
dateFilterInput.addEventListener('input', (e) => {
  currentFilters.date = e.currentTarget.value;
  renderTaskList();
});

dateFilterInput.addEventListener('blur', (e) => {
  if (!e.currentTarget.value) {
    e.currentTarget.type = 'text';
  }
});

taskFIlterInput.addEventListener('input', (e) => {
  currentFilters.task = e.currentTarget.value;
  renderTaskList();
});

dateFilterClear.addEventListener('click', () => {
  dateFilterInput.value = '';
  currentFilters.date = '';
  renderTaskList();
});

taskFIlterClear.addEventListener('click', () => {
  taskFIlterInput.value = '';
  currentFilters.task = '';
  renderTaskList();
});


function generateFilteredTasklist() {
  const { date, task } = currentFilters;

  if (!date && !task) {
    filteredTaskArray = taskArray;
    return;
  }

  if (date) {
    filteredTaskArray = taskArray.filter(t => t.date === date);
  }

  if (task) {
    if (date) {
      filteredTaskArray = filteredTaskArray.filter(t => t.task.search(task) >= 0);
    } else {
      filteredTaskArray = taskArray.filter(t => t.task.search(task) >= 0);
    }
  }
}


// local storage operations
function saveTaskList() {
  storage.setItem('tasks', JSON.stringify(taskArray));
}

function loadTaskList() {
  return storage.getItem('tasks');
}
