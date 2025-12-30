// --- Language & Theme Logic ---
const languages = {
    en: { siteTitle: "Daily A/L Warrior", taskPlaceholder: "Add a task...", timerLabel: "Focus Time" },
    ta: { siteTitle: "தினசரி A/L போர்வீரன்", taskPlaceholder: "வேலையைச் சேர்க்கவும்...", timerLabel: "கவன நேரம்" }
};

let currentLang = localStorage.getItem("language") || "en";

function toggleTheme() {
    document.body.classList.toggle("dark");
}

document.getElementById("themeToggle").onclick = toggleTheme;

// --- Pomodoro Timer ---
let timeLeft = 25 * 60;
let timerId = null;

function updateTimer() {
    const mins = Math.floor(timeLeft / 60);
    const secs = timeLeft % 60;
    document.getElementById("timer").innerText = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

function startTimer() {
    if (timerId) return;
    timerId = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            updateTimer();
        } else {
            clearInterval(timerId);
            alert("Break Time!");
        }
    }, 1000);
}

function resetTimer() {
    clearInterval(timerId);
    timerId = null;
    timeLeft = 25 * 60;
    updateTimer();
}

// --- Tasks Logic ---
function addTask() {
    const val = document.getElementById("taskInput").value;
    if (!val) return;
    const li = document.createElement("li");
    li.innerHTML = `${val} <span onclick="this.parentElement.remove()" style="cursor:pointer;color:red"> ❌</span>`;
    document.getElementById("taskList").appendChild(li);
    document.getElementById("taskInput").value = "";
}

// --- Syllabus Progress ---
let totalSubjects = 0;
let completedSubjects = 0;

function addSubject() {
    const name = document.getElementById("subjectInput").value;
    if (!name) return;
    totalSubjects++;
    const div = document.createElement("div");
    div.innerHTML = `<input type="checkbox" onchange="updateProgress(this)"> ${name}`;
    document.getElementById("subjectsList").appendChild(div);
    document.getElementById("subjectInput").value = "";
    calculatePercent();
}

function updateProgress(cb) {
    cb.checked ? completedSubjects++ : completedSubjects--;
    calculatePercent();
}

function calculatePercent() {
    const percent = totalSubjects === 0 ? 0 : Math.round((completedSubjects / totalSubjects) * 100);
    document.getElementById("overallPercent").innerText = percent + "%";
    document.getElementById("progressFill").style.width = percent + "%";
}

// --- Exam Countdown (Fixing the logic) ---
function setExamDate() {
    const dateInput = document.getElementById("examDateInput").value;
    if (dateInput) {
        localStorage.setItem("examDate", dateInput);
        startCountdown();
    }
}

function startCountdown() {
    const target = localStorage.getItem("examDate");
    if (!target) return;

    setInterval(() => {
        const now = new Date().getTime();
        const dist = new Date(target).getTime() - now;
        
        if (dist < 0) {
            document.getElementById("countdown").innerText = "Exam Started!";
            return;
        }

        const d = Math.floor(dist / (1000 * 60 * 60 * 24));
        const h = Math.floor((dist % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((dist % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((dist % (1000 * 60)) / 1000);
        
        document.getElementById("countdown").innerText = `${d}d ${h}h ${m}m ${s}s left`;
    }, 1000);
}

// --- Reflection & Quotes ---
function saveReflection() {
    const text = document.getElementById("reflectionInput").value;
    document.getElementById("todayReflection").innerText = "Saved: " + text;
}

const extraQuotes = [
    "Work hard in silence, let your success be your noise.",
    "Don't stop when you're tired. Stop when you're done.",
    "Your future depends on what you do today."
];

function loadMoreQuotes() {
    const q = extraQuotes[Math.floor(Math.random() * extraQuotes.length)];
    const p = document.createElement("p");
    p.innerText = "⭐ " + q;
    document.getElementById("extraQuotes").appendChild(p);
}

// --- Bubbles Creation ---
function createBubble() {
    const container = document.getElementById("bubbles");
    const b = document.createElement("div");
    b.className = "bubble";
    const size = Math.random() * 50 + 20 + "px";
    b.style.width = size;
    b.style.height = size;
    b.style.left = Math.random() * 100 + "%";
    b.style.animationDuration = Math.random() * 4 + 4 + "s";
    container.appendChild(b);
    setTimeout(() => b.remove(), 8000);
}
setInterval(createBubble, 1000);

// On Load
window.onload = startCountdown;
