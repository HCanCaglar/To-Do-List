/*
add check to localstorage
make check affect css
*/
const cardEnterTodo = document.querySelector("#card-enter");
const formEnterTodo = document.querySelector("#enter-todo");
const submitTodobtn = document.querySelector("#submit-todo");
const firstCardBody = document.querySelectorAll(".card-body")[0];

const delAllbtn = document.querySelector("#clear-all");
const filteredTodos = document.querySelector("#filter");
const allTodos = document.querySelector("#all-todos");
const todoList = document.querySelector(".list-group");
const modalElement = document.getElementById("exampleModal");
const checkStatus = document.querySelectorAll(".checkStatus");
const priorityBtn = document.querySelector("#priority");
eventListeners();

let isPrioritized = false;

function eventListeners() {
  submitTodobtn.addEventListener("click", addTodo);
  document.addEventListener("DOMContentLoaded", showTodos);
  delAllbtn.addEventListener("click", deleteAllTodos);
  allTodos.addEventListener("click", deleteTodo);
  filteredTodos.addEventListener("keyup", filterTodos);
  allTodos.addEventListener("change", completeTodo);
  priorityBtn.addEventListener("click", prioritizeTodo);
  formEnterTodo.addEventListener("keyup", function (e) {
    if (e.key === "Enter") {
      e.preventDefault();
      addTodo(e);
    }
  });
}

function prioritizeTodo(e) {
  if (
    e.target.id == "priority" &&
    formEnterTodo.value.trim().toLowerCase() != ""
  ) {
    isPrioritized = true;
    showAlert("success", "Next todo will be prioritized!");
  } else {
    showAlert("danger", "Please enter a todo first.");
  }
}

function showAlert(type, message) {
  const alert = document.createElement("div");

  alert.className = `alert alert-${type}`;
  alert.textContent = message;

  firstCardBody.appendChild(alert);

  window.setTimeout(function () {
    alert.remove();
  }, 1000);
}

function addTodo(e) {
  const newtodo = formEnterTodo.value.trim().toLowerCase();
  const originaltodo = formEnterTodo.value.trim();
  const priorityValue = isPrioritized ? 1 : 0;

  let todos;
  if (localStorage.getItem("todos") === null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.getItem("todos"));
  }
  if (originaltodo === "") {
    showAlert("danger", "Please add a Todo.");
  } else if (checkDuplicates(newtodo)) {
    showAlert("danger", "This todo already exists.");
  } else {
    const listItem = document.createElement("li");
    const link = document.createElement("a");
    const label = document.createElement("label");
    const index = todos.length;

    link.href = "#";
    link.className = "delete-item";
    link.innerHTML = "<i class='fa fa-remove'></i>";
    link.setAttribute("data-index", todos.length);
    link.setAttribute("data-priority", 0);

    label.id = "done";
    label.innerHTML = `<input type="checkbox" class="checkStatus" data-index="${index}">`;

    label.innerHTML += "<span class='checkmark'></span>";

    listItem.className = "list-group-item";
    listItem.id = "single-todo";
    listItem.appendChild(document.createTextNode(originaltodo));

    listItem.appendChild(link);
    listItem.appendChild(label);

    allTodos.appendChild(listItem);
    e.preventDefault();

    //todos.push(originaltodo);

    todos.push({
      text: originaltodo,
      completed: false,
      index: index,
      priority: priorityValue,
    });
    //link.setAttribute("data-index", todos.length - 1);
    if (priorityValue === 1) {
      allTodos.insertBefore(listItem, allTodos.firstChild);
      listItem.style.color = "red";
    } else {
      allTodos.appendChild(listItem);
    }

    localStorage.setItem("todos", JSON.stringify(todos));
    formEnterTodo.value = "";
    isPrioritized = false;
  }
}

function showTodos() {
  let todos;

  if (localStorage.getItem("todos") === null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.getItem("todos"));
  }

  todos.forEach(function (todo, index) {
    const listItem = document.createElement("li");
    const link = document.createElement("a");
    const label = document.createElement("label");

    link.href = "#";
    link.className = "delete-item";
    link.innerHTML = "<i class='fa fa-remove'></i>";
    link.setAttribute("data-index", todos.length);
    link.setAttribute("data-priority", 0);

    label.id = "done";
    label.innerHTML = `<input type="checkbox" class="checkStatus" data-index="${index}" ${
      todo.completed ? "checked" : ""
    }>`;
    label.innerHTML += "<span class='checkmark'></span>";

    listItem.className = "list-group-item";
    listItem.className = "list-group-item";
    listItem.id = "single-todo";
    listItem.appendChild(document.createTextNode(todo.text));
    if (todo.completed) {
      listItem.classList.add("completed");
    }

    listItem.appendChild(link);
    listItem.appendChild(label);

    if (todo.priority === 1) {
      allTodos.insertBefore(listItem, allTodos.firstChild);
      listItem.style.color = "red";
    } else {
      allTodos.appendChild(listItem);
    }
  });
}

function checkDuplicates(todo) {
  const newtodo = formEnterTodo.value.trim().toLowerCase();
  let todos;

  if (localStorage.getItem("todos") === null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.getItem("todos"));
  }

  for (var todo of todos) {
    if (todo.text.toLowerCase() == newtodo) {
      return true;
    }
  }
  return false;
}

function deleteTodo(e) {
  let todos;

  if (localStorage.getItem("todos") === null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.getItem("todos"));
  }

  if (e.target.className == "fa fa-remove") {
    e.target.parentElement.parentElement.remove();
    todos = todos.filter(function (todoItem) {
      return (
        todoItem.text.trim().toLowerCase() !==
        e.target.parentElement.parentElement.textContent.trim().toLowerCase()
      );
    });
    localStorage.setItem("todos", JSON.stringify(todos));
  }
}

function completeTodo(e) {
  todos = JSON.parse(localStorage.getItem("todos"));

  if (e.target.className == "checkStatus") {
    const index = parseInt(e.target.getAttribute("data-index"));
    let todos = JSON.parse(localStorage.getItem("todos"));

    if (!isNaN(index)) {
      todos[index].completed = e.target.checked; // true or false
      localStorage.setItem("todos", JSON.stringify(todos));
    }
  }
  if (e.target.checked) {
    e.target.parentElement.parentElement.classList.add("completed");
  } else {
    e.target.parentElement.parentElement.classList.remove("completed");
  }
}

function deleteAllTodos() {
  const modalInstance = bootstrap.Modal.getInstance(modalElement);

  while (todoList.firstElementChild != null) {
    todoList.removeChild(todoList.firstElementChild);
  }
  modalInstance.hide();

  localStorage.removeItem("todos");
}

function filterTodos(e) {
  const searchValue = e.target.value.toLowerCase();
  const listItem = document.querySelectorAll(".list-group-item");

  listItem.forEach(function (listItem) {
    const serchFor = listItem.textContent.trim().toLowerCase();
    if (serchFor.indexOf(searchValue) === -1) {
      listItem.setAttribute("style", "display : none !important");
    } else {
      listItem.setAttribute("style", "display : block");
    }
  });
}
