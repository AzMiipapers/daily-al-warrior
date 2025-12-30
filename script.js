// Daily Quotes
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

// More Quotes (50+)
const moreQuotes = [
    "உழைப்பு உன்னை உயர்த்தும், கனவு உன்னை இழுத்துச் செல்லும்!",
    "தோல்வி என்பது இறுதி அல்ல – அது அடுத்த வெற்றிக்கான பயிற்சி.",
    "ஒவ்வொரு நாளும் ஒரு புதிய தொடக்கம்!",
    "Believe you can and you're halfway there.",
    "கற்றது கைமண் அளவு, கல்லாதது உலகளவு.",
    "The only way to do great work is to love what you do.",
    "நீ இன்று செய்யும் உழைப்பு நாளை உன்னை பெருமைப்படுத்தும்.",
    "Success is not final, failure is not fatal.",
    "எத்தனை தடவை தோற்றாலும் எழுந்து நிற்பவன் தான் வெற்றியாளன்.",
    "Dream big. Work hard. Stay focused.",
    "உன் கனவுகளை நோக்கி ஒவ்வொரு அடியும் எடுத்து வை!",
    "The future belongs to those who believe in their dreams.",
    "இன்று கடினமாக உழை, நாளை சிரித்து வாழ!",
    "You are never too old to set another goal.",
    "வெற்றி பெற விரும்பினால் தோல்வியை தழுவு.",
    "உன் மனதில் நம்பிக்கை இருந்தால் உலகம் உன்னை வணங்கும்.",
    "ஒரு பயணம் ஆயிரம் மைல் தொடங்குவது ஒரு அடியில் தான்.",
    "Hard work beats talent when talent doesn't work hard.",
    "எதிர்காலம் உழைப்பவர்களுக்கு சொந்தம்.",
    "Stay positive, work hard, make it happen."
];
function loadMoreQuotes() {
    const container = document.getElementById("extraQuotes");
    container.innerHTML = "";
    const shuffle = [...moreQuotes].sort(() => 0.5 - Math.random()).slice(0, 10);
    shuffle.forEach(q => {
        const p = document.createElement("p");
        p.innerHTML = `<strong>💜</strong> ${q}`;
        p.style.margin = "15px 0";
        p.style.fontStyle = "italic";
        p.style.color = "#6a1b9a";
        container.appendChild(p);
    });
}
loadMoreQuotes();

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
    const daysLeft = Math.ceil((new Date(examDate) - new Date()) / (86400000));
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

// Moving Bubbles
function createBubble() {
    const bubblesContainer = document.getElementById("bubbles");
    const bubble = document.createElement("div");
    bubble.classList.add("bubble");
    
    const size = Math.random() * 80 + 40 + "px";
    bubble.style.width = size;
    bubble.style.height = size;
    bubble.style.left = Math.random() * 100 + "vw";
    bubble.style.animationDuration = Math.random() * 20 + 15 + "s";
    bubble.style.setProperty('--drift', (Math.random() - 0.5) * 2);
    
    bubblesContainer.appendChild(bubble);
    
    setTimeout(() => bubble.remove(), 35000);
}

setInterval(createBubble, 2000);
for (let i = 0; i < 10; i++) {
    setTimeout(createBubble, i * 1000);
}
