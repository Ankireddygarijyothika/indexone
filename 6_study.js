console.log("Study JS Loaded");
const studyTaskInput = document.getElementById('taskadd');
const studyDateInput = document.getElementById('studydate');
const taskList = document.getElementById('listoftasks');
const currentUser = localStorage.getItem("currentuser");
if (!currentUser) {
  alert("No user logged in!");
  window.location.href = "todolist.html";
}
let users = JSON.parse(localStorage.getItem("users")) || {};
let userData = users[currentUser];
function formatDate(date) {
  return new Date(date).toISOString().split('T')[0];
}
window.addEventListener('DOMContentLoaded', () => {
  if (userData && userData.tasks && userData.tasks.length > 0) {
    userData.tasks.forEach(task => {
      const li = document.createElement('li');
      li.textContent = `${task.text} - ${task.date}`;
      taskList.appendChild(li);
    });
  }
  checkTasksDueToday();
  cleanUpOldTasks();
});
document.getElementById('studyform').addEventListener('submit', (e) => {
  e.preventDefault();
  const taskText = studyTaskInput.value.trim();
  const taskDate = studyDateInput.value;
  if (!taskText || !taskDate) return;
  const li = document.createElement('li');
  li.textContent = `${taskText} - ${taskDate}`;
  taskList.appendChild(li);
  if (userData) {
    userData.tasks.push({ text: taskText, date: taskDate });
    users[currentUser] = userData;
    localStorage.setItem("users", JSON.stringify(users));
  }
  studyTaskInput.value = '';
  studyDateInput.value = '';
});
function checkTasksDueToday() {
  const today = formatDate(new Date());
  const tasksDueToday = userData.tasks.filter(task => task.date === today);
  if (tasksDueToday.length > 0) {
    alert(`You have ${tasksDueToday.length} task(s) due today!`);
  }
}
function cleanUpOldTasks() {
  const today = formatDate(new Date());
  let updatedTasks = [];
  userData.tasks.forEach(task => {
    if (task.date < today) {
      const confirmDelete = confirm(`The task "${task.text}" was due on ${task.date}. Can I delete this task?`);
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
