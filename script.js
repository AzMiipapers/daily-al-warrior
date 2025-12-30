// --- 1. Global Data & Flashcards ---
const flashcards = [
    { q: "Bio: Powerhouse of the cell?", a: "Mitochondria" },
    { q: "Maths: Derivative of tan(x)?", a: "sec²(x)" },
    { q: "Bio: Who discovered DNA structure?", a: "Watson and Crick" },
    { q: "Maths: Integral of 1/x?", a: "ln|x| + C" },
    { q: "Bio: Main function of Ribosomes?", a: "Protein Synthesis" }
];

let currentCardIndex = -1;
let isFlipped = false;

// --- 2. Header & Logo Logic ---
window.onscroll = () => {
    const header = document.getElementById("mainHeader");
    window.scrollY > 50 ? header.classList.add("scrolled") : header.classList.remove("scrolled");
};

// --- 3. Settings & Modal ---
const modal = document.getElementById("settingsModal");
document.getElementById("settingsBtn").onclick = () => modal.style.display = "flex";

function saveSettings() {
    const user = document.getElementById("userNameInput").value;
    const lang = document.getElementById("langSelect").value;
    localStorage.setItem("studySettings", JSON.stringify({user, lang}));
    applySettings();
    modal.style.display = "none";
}

function applySettings() {
    const data = JSON.parse(localStorage.getItem("studySettings"));
    if(data) {
        if(data.user) document.getElementById("siteTitle").innerText = `${data.user}'s Hub`;
        document.getElementById("langSelect").value = data.lang;
    }
}

function resetAllData() {
    if(confirm("Delete everything?")) { localStorage.clear(); location.reload(); }
}

// --- 4. Infinite Quotes ---
const quotes = [
    "Success is not final, failure is not fatal.",
    "Don't stop when you're tired, stop when you're done.",
    "A/L is a journey, enjoy the learning.",
    "Your future self will thank you for today's work."
];

function newQuote() {
    document.getElementById("quote").innerText = `"${quotes[Math.floor(Math.random()*quotes.length)]}"`;
}

// --- 5. Countdown ---
function setExamDate() {
    const date = document.getElementById("examDateInput").value;
    if(date) { localStorage.setItem("examDate", date); startCountdown(); }
}

function startCountdown() {
    const target = localStorage.getItem("examDate");
    if(!target) return;
    setInterval(() => {
        const diff = new Date(target) - new Date();
        if(diff < 0) return;
        const d = Math.floor(diff/86400000), h = Math.floor((diff%86400000)/3600000), m = Math.floor((diff%3600000)/60000), s = Math.floor((diff%60000)/1000);
        document.getElementById("countdown").innerText = `${d}d ${h}h ${m}m ${s}s left 🔥`;
    }, 1000);
}

// --- 6. Pomodoro Timer ---
let timeLeft = 1500, timerId = null;
function startTimer() {
    if(timerId) return;
    timerId = setInterval(() => {
        timeLeft--;
        const mins = Math.floor(timeLeft/60), secs = timeLeft%60;
        document.getElementById("timer").innerText = `${mins}:${secs<10?'0':''}${secs}`;
        if(timeLeft <= 0) { clearInterval(timerId); alert("Time's up!"); }
    }, 1000);
}
function resetTimer() { clearInterval(timerId); timerId = null; timeLeft = 1500; document.getElementById("timer").innerText = "25:00"; }

// --- 7. Syllabus Tracker ---
let total = 0, done = 0;
function addSubject() {
    const name = document.getElementById("subjectInput").value;
    if(!name) return;
    total++;
    const div = document.createElement("div");
    div.innerHTML = `<input type="checkbox" onchange="this.checked?done++:done--;updateProgress()"> ${name}`;
    document.getElementById("subjectsList").appendChild(div);
    document.getElementById("subjectInput").value = "";
    updateProgress();
}
function updateProgress() {
    const p = total === 0 ? 0 : Math.round((done/total)*100);
    document.getElementById("overallPercent").innerText = p + "%";
    document.getElementById("progressFill").style.width = p + "%";
}

// --- 8. Flashcard Logic ---
function nextCard() {
    currentCardIndex = Math.floor(Math.random() * flashcards.length);
    document.getElementById("cardContent").innerText = flashcards[currentCardIndex].q;
    isFlipped = false;
}
function flipCard() {
    if(currentCardIndex === -1) return;
    document.getElementById("cardContent").innerText = isFlipped ? flashcards[currentCardIndex].q : flashcards[currentCardIndex].a;
    isFlipped = !isFlipped;
}

// --- 9. Water & Music ---
let water = 0;
function addWater() { water++; document.getElementById("waterCount").innerText = water; }

function playMusic(type) {
    const audio = document.getElementById("studyAudio");
    audio.src = type === 'lofi' ? "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" : "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3";
    audio.play();
}
function stopMusic() { document.getElementById("studyAudio").pause(); }

// --- 10. Reflection ---
function saveReflection() {
    const val = document.getElementById("reflectionInput").value;
    document.getElementById("todayReflection").innerText = "Saved: " + val;
}

// --- 11. Bubbles ---
function createBubble() {
    const b = document.createElement("div");
    b.className = "bubble";
    b.style.left = Math.random() * 100 + "vw";
    const s = Math.random() * 30 + 20 + "px";
    b.style.width = s; b.style.height = s;
    b.style.animationDuration = Math.random() * 4 + 4 + "s";
    document.getElementById("bubbles").appendChild(b);
    setTimeout(() => b.remove(), 8000);
}
setInterval(createBubble, 1500);

// Run on Load
window.onload = () => { applySettings(); startCountdown(); nextCard(); };
