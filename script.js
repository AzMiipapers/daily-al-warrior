// --- Language Support ---
const languages = {
    en: {
        siteTitle: "Daily A/L Warrior",
        heroTitle: "Your Daily Companion for A/L Success",
        heroDesc: "Study Planner, Pomodoro Timer, Syllabus Tracker & Daily Motivation – All in One Place!",
        motivationHeading: "Today's Motivation",
        countdownHeading: "⏰ A/L Exam Countdown",
        quizHeading: "Daily Past Paper MCQ Quiz",
        tasksHeading: "Today's Tasks",
        reflectionHeading: "✨ What Did I Learn Today?"
    },
    ta: {
        siteTitle: "Daily A/L Warrior",
        heroTitle: "உன் A/L வெற்றிக்கான தினசரி துணை",
        heroDesc: "Study Planner, Pomodoro Timer, Syllabus Tracker & Daily Motivation – எல்லாம் ஒரே இடத்தில்!",
        motivationHeading: "இன்றைய உத்வேகம்",
        countdownHeading: "⏰ A/L தேர்வு Countdown",
        quizHeading: "தினசரி Past Paper MCQ Quiz",
        tasksHeading: "இன்றைய Tasks",
        reflectionHeading: "✨ இன்னைக்கு என்ன Learn பண்ணேன்?"
    }
};

let currentLang = localStorage.getItem("language") || "en";

function switchLanguage(lang) {
    currentLang = lang;
    localStorage.setItem("language", lang);
    const translation = languages[lang];
    
    document.getElementById("siteTitle").innerText = translation.siteTitle;
    document.getElementById("heroTitle").innerText = translation.heroTitle;
    document.getElementById("heroDesc").innerText = translation.heroDesc;
    document.getElementById("motivationHeading").innerText = translation.motivationHeading;
    document.getElementById("countdownHeading").innerText = translation.countdownHeading;
    document.getElementById("quizHeading").innerText = translation.quizHeading;
    document.getElementById("tasksHeading").innerText = translation.tasksHeading;
    document.getElementById("reflectionHeading").innerText = translation.reflectionHeading;
}

// --- Exam Countdown ---
function setExamDate() {
    const dateInput = document.getElementById("examDateInput").value;
    if (dateInput) {
        localStorage.setItem("examDate", dateInput);
        updateCountdown();
    }
}

function updateCountdown() {
    const examDate = localStorage.getItem("examDate");
    if (!examDate) {
        document.getElementById("countdown").innerText = currentLang === "en" ? "Set your exam date!" : "தேதியை முடிவு செய்யுங்கள்!";
        return;
    }
    
    const diff = new Date(examDate) - new Date();
    if (diff <= 0) {
        document.getElementById("countdown").innerText = "Exam Over! Best Wishes! 🎉";
        return;
    }
    
    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);
    document.getElementById("countdown").innerText = `${d}d ${h}h ${m}m ${s}s left 🔥`;
}
setInterval(updateCountdown, 1000);

// --- Pomodoro Timer ---
let timeLeft = 25 * 60;
let timerInterval = null;

function startTimer() {
    if (timerInterval) return;
    timerInterval = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            const mins = Math.floor(timeLeft / 60);
            const secs = timeLeft % 60;
            document.getElementById("timer").innerText = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
        } else {
            clearInterval(timerInterval);
            timerInterval = null;
            alert("Focus session complete!");
        }
    }, 1000);
}

function resetTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
    timeLeft = 25 * 60;
    document.getElementById("timer").innerText = "25:00";
}

// --- Task List ---
function addTask() {
    const taskInput = document.getElementById("taskInput");
    if (taskInput.value.trim() === "") return;
    
    const li = document.createElement("li");
    li.innerHTML = `${taskInput.value} <button onclick="this.parentElement.remove()" style="padding:2px 5px; margin-left:10px; background:red;">X</button>`;
    document.getElementById("taskList").appendChild(li);
    taskInput.value = "";
}

// --- Syllabus Progress ---
let totalSub = 0;
let doneSub = 0;

function addSubject() {
    const subInput = document.getElementById("subjectInput");
    if (subInput.value.trim() === "") return;
    
    totalSub++;
    const div = document.createElement("div");
    div.innerHTML = `<input type="checkbox" onchange="updateProgress(this)"> ${subInput.value}`;
    document.getElementById("subjectsList").appendChild(div);
    subInput.value = "";
    refreshBar();
}

function updateProgress(cb) {
    cb.checked ? doneSub++ : doneSub--;
    refreshBar();
}

function refreshBar() {
    const percent = totalSub === 0 ? 0 : Math.round((doneSub / totalSub) * 100);
    document.getElementById("overallPercent").innerText = percent + "%";
    document.getElementById("progressFill").style.width = percent + "%";
}

// --- Quiz Logic ---
const quizQuestions = [
    { q: "What is the unit of Force?", options: ["Joule", "Newton", "Pascal", "Watt"], ans: 1 },
    { q: "Combined Maths: d/dx(sin x)?", options: ["-cos x", "tan x", "cos x", "sec x"], ans: 2 },
    { q: "Physics: Speed of light?", options: ["3x10^8 m/s", "2x10^8 m/s", "3x10^10 m/s", "340 m/s"], ans: 0 }
];

let quizIdx = 0;
function startQuiz() {
    document.getElementById("quizArea").style.display = "block";
    quizIdx = 0;
    loadQuestion();
}

function loadQuestion() {
    const q = quizQuestions[quizIdx];
    document.getElementById("question").innerText = q.q;
    const optDiv = document.getElementById("options");
    optDiv.innerHTML = "";
    q.options.forEach((opt, i) => {
        const btn = document.createElement("button");
        btn.innerText = opt;
        btn.onclick = () => checkAns(i);
        optDiv.appendChild(btn);
    });
}

function checkAns(i) {
    if(i === quizQuestions[quizIdx].ans) alert("Correct!");
    else alert("Wrong!");
    quizIdx++;
    if(quizIdx < quizQuestions.length) loadQuestion();
    else document.getElementById("quizArea").innerHTML = "Quiz Finished!";
}

// --- Bubbles Animation ---
function createBubble() {
    const container = document.getElementById("bubbles");
    const b = document.createElement("div");
    b.className = "bubble";
    const size = Math.random() * 50 + 20 + "px";
    b.style.width = size;
    b.style.height = size;
    b.style.left = Math.random() * 100 + "vw";
    b.style.animationDuration = Math.random() * 5 + 5 + "s";
    container.appendChild(b);
    setTimeout(() => b.remove(), 8000);
}
setInterval(createBubble, 1000);

// --- Theme Toggle ---
document.getElementById("themeToggle").onclick = () => {
    document.body.classList.toggle("dark");
};

// Initial Call
switchLanguage(currentLang);
