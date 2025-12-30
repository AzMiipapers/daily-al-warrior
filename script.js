// Motivational Quotes
const quotes = [
    "வெற்றி என்பது தோல்வியில் இருந்து எழுந்து நிற்பதுதான்!",
    "கனவு காண்பவன் மட்டுமே அதை நிஜமாக்க முடியும்.",
    "இன்று கற்றது நாளை வெற்றி தரும்!",
    "உழைப்புக்கு ஈடு இணை இல்லை.",
    "A/L என்பது ஒரு படி மட்டுமே – உன் பயணம் இன்னும் தொடங்கவில்லை!",
    "தோல்வி என்பது வெற்றிக்கான முதல் படி!"
];
function newQuote() {
    const random = Math.floor(Math.random() * quotes.length);
    document.getElementById("quote").innerText = quotes[random];
}

// Dark/Light Mode
const themeToggle = document.getElementById("themeToggle");
themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    themeToggle.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
    localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
});
if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
    themeToggle.textContent = "☀️";
}

// Login (temporary)
document.getElementById("loginBtn").addEventListener("click", () => {
    alert("Google Login coming soon! 🚀");
});

// Pomodoro Timer
let timerTime = 25 * 60;
let interval;
function startTimer() {
    clearInterval(interval);
    interval = setInterval(() => {
        timerTime--;
        let m = String(Math.floor(timerTime / 60)).padStart(2, '0');
        let s = String(timerTime % 60).padStart(2, '0');
        document.getElementById("timer").innerText = m + ":" + s;
        if (timerTime <= 0) {
            clearInterval(interval);
            alert("Break time! 5 minutes rest 😊");
            timerTime = 5 * 60;
        }
    }, 1000);
}
function resetTimer() {
    clearInterval(interval);
    timerTime = 25 * 60;
    document.getElementById("timer").innerText = "25:00";
}

// To-Do List
function addTask() {
    let input = document.getElementById("taskInput");
    if (input.value === "") return;
    let li = document.createElement("li");
    li.innerText = input.value;
    li.onclick = () => li.classList.toggle("completed");
    document.getElementById("taskList").appendChild(li);
    input.value = "";
    saveData();
}
function saveData() {
    localStorage.setItem("tasks", document.getElementById("taskList").innerHTML);
}
function loadTasks() {
    document.getElementById("taskList").innerHTML = localStorage.getItem("tasks") || "";
}
loadTasks();

// Syllabus Progress
let subjects = [];
function addSubject() {
    let input = document.getElementById("subjectInput");
    if (input.value === "") return;
    subjects.push({name: input.value, completed: 0, total: 10});
    input.value = "";
    updateSubjects();
}
function updateSubjects() {
    let list = document.getElementById("subjectsList");
    list.innerHTML = "";
    let totalComplete = 0;
    subjects.forEach((sub, i) => {
        let div = document.createElement("div");
        div.innerHTML = `<strong>${sub.name}</strong>: ${sub.completed}/${sub.total} chapters 
            <button onclick="subjects[${i}].completed++; updateSubjects(); saveSubjects();">+1</button>`;
        list.appendChild(div);
        totalComplete += sub.completed;
    });
    let overall = subjects.length ? Math.round(totalComplete / (subjects.length * 10) * 100) : 0;
    document.getElementById("overallPercent").innerText = overall + "%";
    document.getElementById("progressFill").style.width = overall + "%";
    saveSubjects();
}
function saveSubjects() {
    localStorage.setItem("subjects", JSON.stringify(subjects));
}
if (localStorage.getItem("subjects")) {
    subjects = JSON.parse(localStorage.getItem("subjects"));
    updateSubjects();
}

// Study Streak
function updateStreak() {
    const lastCheck = localStorage.getItem("lastCheckIn");
    const streak = parseInt(localStorage.getItem("streak") || "0");
    const today = new Date().toDateString();
    document.getElementById("streakCount").innerText = (lastCheck === today ? streak + " days 🔥" : streak + " days");
}
function checkInToday() {
    const today = new Date().toDateString();
    const lastCheck = localStorage.getItem("lastCheckIn");
    let streak = parseInt(localStorage.getItem("streak") || "0");
    if (lastCheck !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        if (lastCheck === yesterday.toDateString()) streak++;
        else streak = 1;
        localStorage.setItem("streak", streak);
        localStorage.setItem("lastCheckIn", today);
        alert("Super! உங்க streak " + streak + " days ஆகிடுச்சு! 💪");
    } else {
        alert("இன்னைக்கு ஏற்கனவே check-in பண்ணிட்டீங்க!");
    }
    updateStreak();
}
updateStreak();

// Exam Countdown
function updateCountdown() {
    const examDate = localStorage.getItem("examDate");
    if (!examDate) {
        document.getElementById("countdown").innerText = "Exam date set பண்ணுங்க!";
        return;
    }
    const daysLeft = Math.ceil((new Date(examDate) - new Date()) / (1000 * 60 * 60 * 24));
    document.getElementById("countdown").innerText = daysLeft > 0 ? daysLeft + " days left 🔥" : "Exam முடிஞ்சிடுச்சு! Best wishes!";
}
function setExamDate() {
    const date = document.getElementById("examDateInput").value;
    if (date) {
        localStorage.setItem("examDate", date);
        updateCountdown();
    }
}
updateCountdown();

// Daily Reflection
function saveReflection() {
    const text = document.getElementById("reflectionInput").value.trim();
    const today = new Date().toDateString();
    if (text) {
        localStorage.setItem("reflection_" + today, text);
        document.getElementById("todayReflection").innerText = "இன்னைக்கு: " + text;
        document.getElementById("reflectionInput").value = "";
    }
}
function loadReflection() {
    const today = new Date().toDateString();
    const saved = localStorage.getItem("reflection_" + today);
    if (saved) document.getElementById("todayReflection").innerText = "இன்னைக்கு: " + saved;
}
loadReflection();
