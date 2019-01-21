const
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
  taskArray = [];

let id = 0;



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
    renderTaskList();
  };
});


function renderTaskList() {

  while (tasklist.firstChild) {
    tasklist.removeChild(tasklist.firstChild);
  };

  for (let t of taskArray) {

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



function deleteTask(id) {
  let indexForDel = taskArray.findIndex(t => t.id === id);
  taskArray.splice(indexForDel, 1);

  renderTaskList();
};