// --- 1. Infinite Quotes ---
const quotes = [
    "Success is rising every time you fall!",
    "It always seems impossible until it's done.",
    "The secret of getting ahead is getting started.",
    "Study like there's no tomorrow.",
    "Hard work beats talent when talent doesn't work hard.",
    "Don't wish for it, work for it.",
    "Your future is created by what you do today."
];

function newQuote() {
    const q = quotes[Math.floor(Math.random() * quotes.length)];
    document.getElementById("quote").innerText = `"${q}"`;
}

// --- 2. Header Scroll Effect ---
window.onscroll = function() {
    const header = document.querySelector("header");
    if (window.scrollY > 50) { header.classList.add("scrolled"); }
    else { header.classList.remove("scrolled"); }
};

// --- 3. Settings Modal ---
const modal = document.getElementById("settingsModal");
document.getElementById("settingsBtn").onclick = () => modal.style.display = "flex";
document.getElementById("closeSettings").onclick = () => modal.style.display = "none";

// --- 4. Exam Countdown ---
function setExamDate() {
    const date = document.getElementById("examDateInput").value;
    if (date) { localStorage.setItem("examDate", date); updateCountdown(); }
}

function updateCountdown() {
    const target = localStorage.getItem("examDate");
    if (!target) return;
    
    setInterval(() => {
        const diff = new Date(target) - new Date();
        if (diff < 0) { document.getElementById("countdown").innerText = "Best Wishes!"; return; }
        const d = Math.floor(diff / 86400000);
        const h = Math.floor((diff % 86400000) / 3600000);
        const m = Math.floor((diff % 3600000) / 60000);
        const s = Math.floor((diff % 60000) / 1000);
        document.getElementById("countdown").innerText = `${d}d ${h}h ${m}m ${s}s left 🔥`;
    }, 1000);
}

// --- 5. Syllabus Tracker ---
let subjects = [];
function addSubject() {
    const name = document.getElementById("subjectInput").value;
    if (!name) return;
    subjects.push({ name, done: false });
    document.getElementById("subjectInput").value = "";
    renderSyllabus();
}

function renderSyllabus() {
    const list = document.getElementById("subjectsList");
    list.innerHTML = "";
    let doneCount = 0;
    subjects.forEach((s, i) => {
        if (s.done) doneCount++;
        list.innerHTML += `<div><input type="checkbox" ${s.done ? 'checked' : ''} onchange="toggleSub(${i})"> ${s.name}</div>`;
    });
    const percent = subjects.length ? Math.round((doneCount / subjects.length) * 100) : 0;
    document.getElementById("overallPercent").innerText = percent + "%";
    document.getElementById("progressFill").style.width = percent + "%";
}
function toggleSub(i) { subjects[i].done = !subjects[i].done; renderSyllabus(); }

// --- 6. Pomodoro Timer ---
let timeLeft = 1500;
let timerId = null;
function startTimer() {
    if (timerId) return;
    timerId = setInterval(() => {
        timeLeft--;
        const mins = Math.floor(timeLeft / 60);
        const secs = timeLeft % 60;
        document.getElementById("timer").innerText = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
        if (timeLeft <= 0) clearInterval(timerId);
    }, 1000);
}
function resetTimer() { clearInterval(timerId); timerId = null; timeLeft = 1500; document.getElementById("timer").innerText = "25:00"; }

// --- 7. Task List ---
function addTask() {
    const val = document.getElementById("taskInput").value;
    if (!val) return;
    const li = document.createElement("li");
    li.innerHTML = `✅ ${val} <button onclick="this.parentElement.remove()" style="padding:2px 5px; background:red; margin-left:10px;">X</button>`;
    document.getElementById("taskList").appendChild(li);
    document.getElementById("taskInput").value = "";
}

// --- 8. Reflection ---
function saveReflection() {
    const val = document.getElementById("reflectionInput").value;
    document.getElementById("todayReflection").innerText = "Saved: " + val;
}

// --- 9. Bubbles ---
function createBubble() {
    const b = document.createElement("div");
    b.className = "bubble";
    b.style.left = Math.random() * 100 + "vw";
    const s = Math.random() * 40 + 20 + "px";
    b.style.width = s; b.style.height = s;
    b.style.animationDuration = Math.random() * 5 + 5 + "s";
    document.body.appendChild(b);
    setTimeout(() => b.remove(), 10000);
}
setInterval(createBubble, 1500);

window.onload = updateCountdown;
