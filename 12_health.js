console.log("Health JS Loaded");
const taskInput = document.getElementById('taskadder');
const dateInput = document.getElementById('healthdate');
const taskList = document.getElementById('taskslist');
const currentUser = localStorage.getItem("currentuser");
if (!currentUser) {
    alert("No user logged in. Redirecting to login page.");
    window.location.href = "index.html";
}
let users = JSON.parse(localStorage.getItem("users")) || {};
let userData = users[currentUser];
if (!userData || userData.purpose !== 'health care') {
    alert("Access denied or purpose mismatch. Redirecting...");
    window.location.href = "todolist.html";
}
function formatDate(date) {
    return new Date(date).toISOString().split('T')[0];
}
window.addEventListener('DOMContentLoaded', () => {
    if (userData.tasks && userData.tasks.length > 0) {
        userData.tasks.forEach(task => {
            const li = document.createElement('li');
            li.textContent = `${task.text} - ${task.date}`;
            taskList.appendChild(li);
        });
    }
    checkTasksDueToday();
    cleanUpOldTasks();
});
document.getElementById('healthform').addEventListener('submit', (e) => {
    e.preventDefault();
    const taskText = taskInput.value.trim();
    const taskDate = dateInput.value;
    if (!taskText || !taskDate) {
        alert("Please enter both a task and a date.");
        return;
    }
    const li = document.createElement('li');
    li.textContent = `${taskText} - ${taskDate}`;
    taskList.appendChild(li);
    userData.tasks.push({ text: taskText, date: taskDate });
    users[currentUser] = userData;
    localStorage.setItem("users", JSON.stringify(users));
    taskInput.value = '';
    dateInput.value = '';
});
function checkTasksDueToday() {
    const today = formatDate(new Date());
    const dueToday = userData.tasks.filter(task => task.date === today);
    if (dueToday.length > 0) {
        alert(`You have ${dueToday.length} health task(s) due today!`);
    }
}
function cleanUpOldTasks() {
    const today = formatDate(new Date());
    let updatedTasks = [];
    userData.tasks.forEach(task => {
        if (task.date < today) {
            const confirmDelete = confirm(`The health task "${task.text}" was due on ${task.date}. Can I delete this task?`);
            if (!confirmDelete) {
                updatedTasks.push(task);
            }
        } else {
            updatedTasks.push(task);
        }
    });
    if (updatedTasks.length !== userData.tasks.length) {
        userData.tasks = updatedTasks;
        users[currentUser] = userData;
        localStorage.setItem("users", JSON.stringify(users));
        location.reload();
    }
}
