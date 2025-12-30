// Language Support
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
    document.getElementById("siteTitle").innerText = languages[lang].siteTitle;
    document.getElementById("heroTitle").innerText = languages[lang].heroTitle;
    document.getElementById("heroDesc").innerText = languages[lang].heroDesc;
    document.getElementById("motivationHeading").innerText = languages[lang].motivationHeading;
    document.getElementById("countdownHeading").innerText = languages[lang].countdownHeading;
    document.getElementById("quizHeading").innerText = languages[lang].quizHeading;
    document.getElementById("tasksHeading").innerText = languages[lang].tasksHeading;
    document.getElementById("reflectionHeading").innerText = languages[lang].reflectionHeading;
}
switchLanguage(currentLang);

// Enhanced Exam Countdown with Hours/Minutes/Seconds
function updateCountdown() {
    const examDate = localStorage.getItem("examDate");
    if (!examDate) {
        document.getElementById("countdown").innerText = currentLang === "en" ? "Set your exam date!" : "Exam date set பண்ணுங்க!";
        return;
    }
    const diff = new Date(examDate) - new Date();
    if (diff <= 0) {
        document.getElementById("countdown").innerText = "Exam Over! Best Wishes! 🎉";
        return;
    }
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    document.getElementById("countdown").innerText = `${days}d ${hours}h ${minutes}m ${seconds}s left 🔥`;
}
setInterval(updateCountdown, 1000);
updateCountdown();

// Daily Past Paper MCQ Quiz (Sample Questions)
const quizQuestions = [
    { q: "What is the capital of Sri Lanka?", options: ["Colombo", "Kandy", "Jaffna", "Galle"], ans: 0 },
    { q: "In Physics, F = ma stands for?", options: ["Force = mass × acceleration", "Frequency = mass × area", "Force = momentum × acceleration", "Field = mass × amplitude"], ans: 0 },
    { q: "Photosynthesis equation: 6CO₂ + 6H₂O → ?", options: ["C₆H₁₂O₆ + 6O₂", "C₆H₁₂O₆ + 6CO₂", "C₁₂H₂₂O₁₁ + O₂", "CH₄ + 2O₂"], ans: 0 },
    { q: "Combined Maths: Integral of x²?", options: ["x³/3 + C", "x³", "2x", "x²/2"], ans: 0 },
    { q: "Biology: Largest organ in human body?", options: ["Skin", "Liver", "Brain", "Heart"], ans: 0 }
];
let currentQuiz = [];
let quizIndex = 0;
let score = 0;

function startQuiz() {
    currentQuiz = [...quizQuestions].sort(() => 0.5 - Math.random()).slice(0, 5);
    quizIndex = 0;
    score = 0;
    document.getElementById("quizArea").style.display = "block";
    document.getElementById("result").innerText = "";
    nextQuestion();
}

function nextQuestion() {
    if (quizIndex >= currentQuiz.length) {
        document.getElementById("question").innerText = "Quiz Complete!";
        document.getElementById("options").innerHTML = "";
        document.getElementById("nextBtn").style.display = "none";
        document.getElementById("result").innerText = `Score: ${score}/${currentQuiz.length} 🎉`;
        return;
    }
    const q = currentQuiz[quizIndex];
    document.getElementById("question").innerText = `${quizIndex + 1}. ${q.q}`;
    const opts = document.getElementById("options");
    opts.innerHTML = "";
    q.options.forEach((opt, i) => {
        const btn = document.createElement("button");
        btn.innerText = opt;
        btn.onclick = () => {
            if (i === q.ans) score++;
            quizIndex++;
            nextQuestion();
        };
        opts.appendChild(btn);
    });
    document.getElementById("nextBtn").style.display = "none";
}

// Settings Button - Open Modal (Simple)
document.getElementById("settingsBtn").addEventListener("click", () => {
    const lang = currentLang === "en" ? "Tamil" : "English";
    const notif = Notification.permission === "granted" ? "Enabled" : "Disabled";
    alert(`Settings\n\nLanguage: ${currentLang.toUpperCase()} (Click OK to switch to ${lang})\nNotification: ${notif}\nLogin: Coming soon!`);
    switchLanguage(currentLang === "en" ? "ta" : "en");
    if (Notification.permission === "default") {
        Notification.requestPermission();
    }
});

// Notification Permission on Load
if (Notification.permission === "default") {
    Notification.requestPermission();
}

// Rest of previous functions (pomodoro, tasks, streak, bubbles, etc.) remain same
// (Copy from previous script.js)

setInterval(createBubble, 1500);
for (let i = 0; i < 15; i++) {
    setTimeout(createBubble, i * 800);
}
