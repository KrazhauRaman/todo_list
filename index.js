const
  // local storage
  storage = localStorage,
  //control elements
  addBtn = document.querySelector("#add-task-btn"),
  closeBtn = document.querySelector("#close-btn"),
  saveTaskBtn = document.querySelector("#save-task-btn"),
  //inputs
  dateInput = document.querySelector("#date-input"),
  taskInput = document.querySelector("#task-input"),
  //new task popup
  newTaksPopup = document.querySelector("#task-box"),
  //task list
  tasklist = document.querySelector("#task-list"),
  taskArray = (loadTaskList()) ? JSON.parse(loadTaskList()) : [],
  //sorting
  dateSortBtn = document.querySelector("#sort-date-btn"),
  textSortBtn = document.querySelector("#sort-text-btn"),
  dateSortIcon = document.querySelector("#sort-date-icont"),
  textSortIcon = document.querySelector("#sort-text-icon"),
  currentSortSettings = { type: "date", direction: "up" },
  //filtering
  dateFilterInput = document.querySelector("#filter-by-date"),
  taskFIlterInput = document.querySelector("#filter-by-task"),
  dateFilterClear = document.querySelector("#clear-filter-by-date"),
  taskFIlterClear = document.querySelector("#clear-filter-by-task"),
  currentFilters = { date: "", task: "" };

let filteredTaskArray = [];

//id for tasks id
let id = 0;

//if there are tasks in storage
if (taskArray)
renderTaskList();


function popupToggle() {
  newTaksPopup.classList.toggle("appear");
  dateInput.value = "";
  taskInput.value = "";
};


addBtn.addEventListener("click", popupToggle);
closeBtn.addEventListener("click", popupToggle);


// check for inputs values. if there is nothing in input user'll see error animation
function checkInputValue(input) {
  if (!input.value) {
    input.classList.add("error");
    setTimeout(function () {
      input.classList.remove("error");
    }, 1000);
  };
};

dateInput.addEventListener("input", function () {
  if (this.value) {
    this.classList.remove("error");
  };
});

taskInput.addEventListener("input", function () {
  if (this.value) {
    this.classList.remove("error");
  };
});


//new task creating
saveTaskBtn.addEventListener("click", function () {

  checkInputValue(dateInput);
  checkInputValue(taskInput);

  if (dateInput.value && taskInput.value) {
    taskArray.push({
      id: id,
      date: dateInput.value,
      task: taskInput.value,
      completed: false
    });
    id++;
    popupToggle();

    saveTaskList();
    renderTaskList();
  };
});


// task list creating 
function renderTaskList() {

  while (tasklist.firstChild) {
    tasklist.removeChild(tasklist.firstChild);
  };

  generateFilteredTasklist();
  applySorting();

  for (let t of filteredTaskArray) {

    const { id, date, task, completed } = t;

    const
      taskDiv = document.createElement("div"),
      taskDivTop = document.createElement("div"),
      dateSpan = document.createElement("span"),
      checkDiv = document.createElement("div"),
      completedCheck = document.createElement("input"),
      completedLabel = document.createElement("label"),
      deleteBtn = document.createElement("button"),
      taskText = document.createElement("textarea");


    taskDiv.classList.add("task-div", "card", "border-primary", "mb-3");
    taskDivTop.classList.add("card-header", "task-div-top");
    if (completed) taskDivTop.classList.add("completed");
    dateSpan.classList.add("task-div-date");
    checkDiv.classList.add("custom-control", "custom-checkbox");
    completedCheck.classList.add("custom-control-input");
    completedLabel.classList.add("custom-control-label");
    deleteBtn.classList.add("btn", "btn-danger", "delete-btn");
    taskText.classList.add("task-div-text");

    taskDiv.setAttribute("id", `task-div-${id}`);
    completedCheck.setAttribute("type", "checkbox");
    completedCheck.setAttribute("id", `completedCheck-${id}`);
    completedLabel.setAttribute("for", `completedCheck-${id}`);
    taskText.setAttribute("disabled", true);

    completedCheck.dataset.id = id;

    dateSpan.innerHTML = date;
    taskText.innerHTML = task;
    completedCheck.checked = completed;
    completedLabel.innerHTML = "Completed";
    deleteBtn.innerHTML = "Delete";


    completedCheck.addEventListener("input", function () {
      taskDivTop.classList.toggle("completed");
      t.completed = !t.completed;
    });

    deleteBtn.addEventListener("click", function () {
      deleteTask(id);
    })

    taskDiv.appendChild(taskDivTop);
    taskDiv.appendChild(taskText);
    taskDivTop.appendChild(dateSpan);
    taskDivTop.appendChild(checkDiv);
    checkDiv.appendChild(completedCheck);
    checkDiv.appendChild(completedLabel);
    taskDivTop.appendChild(deleteBtn);

    tasklist.appendChild(taskDiv);

    taskDiv.classList.add("task-div-appear");
  };
};


// task deleting
function deleteTask(id) {
  let indexForDel = taskArray.findIndex(t => t.id === id);
  taskArray.splice(indexForDel, 1);

  saveTaskList();
  renderTaskList();
};


//sorting
dateSortBtn.addEventListener("click", e => setSortSettings(e));
textSortBtn.addEventListener("click", e => setSortSettings(e));

function setSortSettings(e) {

  if (e.currentTarget.dataset.type === currentSortSettings.type) {

    if (currentSortSettings.direction === "up") {
      currentSortSettings.direction = "down";
      e.currentTarget.lastChild.classList.remove("fa-angle-up");
      e.currentTarget.lastChild.classList.add("fa-angle-down");
    }
    else {
      currentSortSettings.direction = "up";
      e.currentTarget.lastChild.classList.remove("fa-angle-down");
      e.currentTarget.lastChild.classList.add("fa-angle-up");
    }
  }
  else {

    currentSortSettings.direction = "up";

    if (currentSortSettings.type === "date") {
      currentSortSettings.type = "text";

      dateSortBtn.classList.remove("btn-outline-success");
      dateSortBtn.classList.add("btn-primary");
      dateSortBtn.lastChild.classList.remove("fa-angle-up");
      dateSortBtn.lastChild.classList.remove("fa-angle-down");

      textSortBtn.classList.add("btn-outline-success");
      textSortBtn.classList.remove("btn-primary");
      textSortBtn.lastChild.classList.add("fa-angle-up");

    }
    else {
      currentSortSettings.type = "date";

      textSortBtn.classList.remove("btn-outline-success");
      textSortBtn.classList.add("btn-primary");
      textSortBtn.lastChild.classList.remove("fa-angle-up");
      textSortBtn.lastChild.classList.remove("fa-angle-down");

      dateSortBtn.classList.add("btn-outline-success");
      dateSortBtn.classList.remove("btn-primary");
      dateSortBtn.lastChild.classList.add("fa-angle-up");
    }
  }

  renderTaskList();
}


function applySorting() {
  const { type, direction } = currentSortSettings;

  if (type === "date") {

    filteredTaskArray.sort((a, b) => {

      aDate = a.date.split("-");
      bDate = b.date.split("-");

      for (let i = 0; i < 3; i = i + 1) {
        if (aDate[i] < bDate[i])
          return -1;

        if (aDate[i] > bDate[i])
          return 1;
      };
      return 0;

    });
  }
  else {

    filteredTaskArray.sort((a, b) => {
      return (a.task < b.task) ? -1 : (a.task > b.task) ? 1 : 0;
    });
  }

  if (direction === "down") {
    filteredTaskArray.reverse();
  }
}


// filtering
dateFilterInput.addEventListener("input", function () {
  currentFilters.date = this.value;
  renderTaskList();
});

dateFilterInput.addEventListener("blur", function () {
  if (!this.value) {
    this.type = "text";
  }
});

taskFIlterInput.addEventListener("input", function () {
  currentFilters.task = this.value;
  renderTaskList();
});

dateFilterClear.addEventListener("click", function () {
  dateFilterInput.value = "";
  currentFilters.date = "";
  renderTaskList();
});

taskFIlterClear.addEventListener("click", function () {
  taskFIlterInput.value = "";
  currentFilters.task = "";
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
    }
    else {
      filteredTaskArray = taskArray.filter(t => t.task.search(task) >= 0);
    }
  }
}


//local storage operations
function saveTaskList() {
  storage.setItem("tasks", JSON.stringify(taskArray));
}

function loadTaskList() {
  return storage.getItem("tasks");
}