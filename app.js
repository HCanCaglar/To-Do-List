/*
2- delete todo
3-filter todo
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

eventListeners();

function eventListeners() {
  submitTodobtn.addEventListener("click", addTodo);
  document.addEventListener("DOMContentLoaded", showTodos);
  delAllbtn.addEventListener("click", deleteAllTodos);
  allTodos.addEventListener("click", deleteTodo);
  filteredTodos.addEventListener("keyup", filterTodos);
  formEnterTodo.addEventListener("keyup", function (e) {
    if (e.key === "Enter") {
      e.preventDefault();
      addTodo(e);
    }
  });
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

  let todos;
  /*<li class="list-group-item" id="single-todo">
              example todo
              <a href="#" class="delete-item">
                <i class="fa fa-remove"></i>
              </a>
            </li> */

  if (originaltodo === "") {
    showAlert("danger", "Please add a Todo.");
  } else if (checkDuplicates(newtodo)) {
    showAlert("danger", "This todo already exists.");
  } else {
    const listItem = document.createElement("li");
    const link = document.createElement("a");
    link.href = "#";
    link.className = "delete-item";
    link.innerHTML = "<i class='fa fa-remove'></i>";
    listItem.className = "list-group-item";
    listItem.id = "single-todo";
    listItem.appendChild(document.createTextNode(originaltodo));

    listItem.appendChild(link);
    allTodos.appendChild(listItem);
    e.preventDefault();

    if (localStorage.getItem("todos") === null) {
      todos = [];
    } else {
      todos = JSON.parse(localStorage.getItem("todos"));
    }
    todos.push(originaltodo);

    localStorage.setItem("todos", JSON.stringify(todos));
    formEnterTodo.value = "";
  }
}

function showTodos() {
  let todos;

  if (localStorage.getItem("todos") === null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.getItem("todos"));
  }

  todos.forEach(function (todos) {
    const listItem = document.createElement("li");
    const link = document.createElement("a");
    link.href = "#";
    link.className = "delete-item";
    link.innerHTML = "<i class='fa fa-remove'></i>";
    listItem.className = "list-group-item";
    listItem.id = "single-todo";
    listItem.appendChild(document.createTextNode(todos));

    listItem.appendChild(link);
    allTodos.appendChild(listItem);
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
    if (todo == newtodo) {
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
        todoItem !==
        e.target.parentElement.parentElement.textContent.trim().toLowerCase()
      );
    });
    localStorage.setItem("todos", JSON.stringify(todos));
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
