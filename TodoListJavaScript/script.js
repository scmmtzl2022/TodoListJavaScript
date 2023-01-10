/**
 * query selector
 */
const addTodo = document.querySelector(".task-input input"),
    filters = document.querySelectorAll(".filters span"),
    clearCompleted = document.querySelector(".clear-btn"),
    taskBox = document.querySelector(".task-box");
/**
 * variable
 */
let escElement,
    todos = JSON.parse(localStorage.getItem("todo-list")) || [];
/**
 * filter
 */
filters.forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelector("span.active").classList.remove("active");
        btn.classList.add("active");
        showTodo(btn.id);
    });
});
/**
 * filter function
 * @param {param} filter 
 */
function showTodo(filter) {
    let liTag = "";
    if (todos) {
        todos.forEach((todo, id) => {
            let completed = todo.status == "completed" ? "checked" : "";
            if (filter == todo.status || filter == "all") {
                liTag += `         
                        <li class="task">                    
                            <input onclick="updateStatus(this)" type="checkbox" id="${id}" ${completed}>                                
                            <span ondblclick="editTodo(event)" class = "${completed} ">${todo.name}</span>
                            <form onsubmit="updateTodo(event, ${todo.id})"> 
                            <input type="text" value="${todo.name}" style="display: none;" id="${id}" onkeydown onblur="checkBlur(event)">              
                            </form>
                        <div class="settings">
                            <i onclick='deleteTodo(${id}, "${filter}")' class="uil uil-trash"></i>
                        </div>
                        </li>
                        `;
            }
        });
    }
    taskBox.innerHTML = liTag || `<span>No tasks for today.</span>`;
    let checkTask = taskBox.querySelectorAll(".task");
    !checkTask.length ? clearCompleted.classList.remove("active") : clearCompleted.classList.add("active");
    taskBox.offsetHeight >= 300 ? taskBox.classList.add("overflow") : taskBox.classList.remove("overflow");
}
showTodo("all");
remainingCount();
/**
 * check blur
 * @param {*} el 
 */
function checkBlur(el) {
    el.target.style.display = "none";
    el.target.parentElement.parentElement.children[1].style.display = "block";
}
/**
 * remaining count
 */
function remainingCount() {
    if (todos !== null) {
        const result = todos.filter((a) => a.status == 'pending');
        document.getElementById("itemLeft").innerHTML = result.length;
    } else {
        document.getElementById("itemLeft").innerHTML = 0;
    }
}
/**
 * completed item  update status
 * @param {*} selectedTask 
 */
function updateStatus(selectedTask) {
    if (selectedTask.checked) {
        selectedTask.parentElement.children[1].classList.add("checked");
        todos[selectedTask.id].status = "completed";
    } else {
        selectedTask.parentElement.children[1].classList.remove("checked");
        todos[selectedTask.id].status = "pending";
    }
    localStorage.setItem("todo-list", JSON.stringify(todos));
    remainingCount();
}
/**
 * edit todo item
 * @param {*} e 
 */
function editTodo(e) {
    e.preventDefault();
    escElement = e;
    e.target.style.display = "none";
    e.target.parentElement.children[2].children[0].style.display = "block";
    const input = e.target.parentElement.children[2].children[0];
    input.setSelectionRange(0, 0);
    input.focus();
}
/**
 * finilized Update item
 * @param {*} e 
 * @param {*} todoId 
 */
function updateTodo(e, todoId) {
    e.preventDefault();
    let updateData = todos.map(todo => {
        if (todoId == todo.id) {
            todo.name = e.target.querySelector('input').value;
            todo.isEdit = false;
        }
        return todo;
    });
    todos.splice(0, todos.length);
    todos = updateData;
    localStorage.setItem("todo-list", JSON.stringify(todos));
    showTodo("all");
}
/**
 * escapse
 * @param {*} evt 
 */
document.onkeydown = function (evt) {
    evt = evt || window.event;
    var isEscape = false;
    if ("key" in evt) {
        isEscape = (evt.key === "Escape" || evt.key === "Esc");
    } else {
        isEscape = (evt.keyCode === 27);
    }
    if (isEscape) {
        escElement.target.parentElement.children[2].children[0].style.display = "none";
        escElement.target.style.display = "block";
    }
};
/**
 * delete item
 * @param {*} deleteId 
 * @param {*} filter 
 */
function deleteTodo(deleteId, filter) {
    todos.splice(deleteId, 1);
    localStorage.setItem("todo-list", JSON.stringify(todos));
    showTodo(filter);
    remainingCount();
}
/**
 * delete completed item
 */
clearCompleted.addEventListener("click", () => {
    const result = todos.filter((a) => a.status == 'pending');
    todos.splice(0, todos.length);
    todos = result;
    localStorage.setItem("todo-list", JSON.stringify(todos));
    showTodo("all")
    remainingCount();
});
/**
 * add todo item
 */
addTodo.addEventListener("keyup", e => {
    let userTask = addTodo.value.trim();
    if (e.key == "Enter" && userTask) {
        let taskInfo = { id: todos.length > 0 ? todos[todos.length - 1].id + 1 : 0, name: userTask, status: "pending", isEdit: "false" };
        todos.push(taskInfo);
        addTodo.value = "";
        localStorage.setItem("todo-list", JSON.stringify(todos));
        showTodo("all");
    }
    remainingCount();
}
);