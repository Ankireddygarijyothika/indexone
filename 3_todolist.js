document.getElementById('todoform').addEventListener('submit', function (e) {
    e.preventDefault();
    let username = document.getElementById('box1').value.trim();
    let password = document.getElementById('secret').value.trim();
    let purpose = document.getElementById('works').value.trim().toLowerCase();
    if (!username || !password || !purpose) {
        alert("Please enter all the details");
        return;
    }
    let users = JSON.parse(localStorage.getItem("users")) || {};
    if (users[username]) {
        const storedUser = users[username];
        if (storedUser.purpose === purpose && storedUser.password === password) {
            localStorage.setItem("currentuser", username);
            redirectToPurposePage(purpose);
        } else if (storedUser.purpose === purpose && storedUser.password !== password) {
            alert("Incorrect password. Please try again.");
        } else {
            users[username] = {
                password: password,
                purpose: purpose,
                tasks: []
            };
            localStorage.setItem("users", JSON.stringify(users));
            localStorage.setItem("currentuser", username);
            redirectToPurposePage(purpose);
        }
    } else {
        users[username] = {
            password: password,
            purpose: purpose,
            tasks: []
        };
        localStorage.setItem("users", JSON.stringify(users));
        localStorage.setItem("currentuser", username);
        redirectToPurposePage(purpose);
    }
});
function redirectToPurposePage(purpose) {
    if (purpose.includes("study")) {
        window.location.href = "study.html";
    } else if (purpose.includes("health")) {
        window.location.href = "healthcare.html";
    } else {
        window.location.href = "dailyactivities.html";
    }
}
