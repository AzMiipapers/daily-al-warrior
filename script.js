// --- 1. Global State & Storage ---
let timeLeft = 1500;
let timerObj = null;
let units = JSON.parse(localStorage.getItem('units')) || [];
let currentFactIdx = -1;
let isFlipped = false;
let waterCount = localStorage.getItem('water') || 0;

// --- 2. Infinite Quotes & Translation Data ---
const quotes = [
    "A/L is a marathon, not a sprint. Keep going!",
    "Success is what you do every single day.",
    "Small steps lead to big university gates.",
    "Study like your dream depends on it.",
    "Maths/Bio is hard, but you are harder."
];

const facts = {
    bio: [{q:"Unit of Kidney?", a:"Nephron"}, {q:"Who discovered Cells?", a:"Robert Hooke"}, {q:"Powerhouse?", a:"Mitochondria"}],
    maths: [{q:"d/dx of tan x?", a:"sec² x"}, {q:"Sum of angles?", a:"180°"}, {q:"Integral of e^x?", a:"e^x + C"}]
};

const translations = {
    ta: { welcome: "வணக்கம், மாணவரே!", grade: "📊 தரம் கணித்தல்", timer: "கவன நேரம்", music: "🌿 அமைதியான சூழல்", cd: "தேர்வு கவுண்ட்டவுன்", note: "📝 குறிப்புகள்", prog: "பாட முன்னேற்றம்" },
    en: { welcome: "Welcome back, Warrior", grade: "📊 Grade Predictor", timer: "Focus Timer", music: "🌿 Study Ambience", cd: "Exam Countdown", note: "📝 Quick Study Notes", prog: "Unit Master Tracker" }
};

// --- 3. Header & UI Logic ---
window.onscroll = () => {
    const h = document.getElementById("mainHeader");
    window.scrollY > 50 ? h.classList.add("scrolled") : h.classList.remove("scrolled");
};
function scrollToTop() { window.scrollTo({top: 0, behavior: 'smooth'}); }
function toggleTheme() {
    document.body.classList.toggle("dark-theme");
    localStorage.setItem("theme", document.body.classList.contains("dark-theme") ? "dark" : "light");
}

// --- 4. Main Features ---
function newQuote() { document.getElementById("quote").innerText = `"${quotes[Math.floor(Math.random()*quotes.length)]}"`; }

function predictGrade() {
    const marks = document.getElementById("marksInput").value;
    let g = marks >= 75 ? "A" : marks >= 65 ? "B" : marks >= 55 ? "C" : marks >= 35 ? "S" : "W";
    document.getElementById("gradeResult").innerText = marks ? `Result: ${g}` : "-";
}

function startTimer() {
    if(timerObj) return;
    timerObj = setInterval(() => {
        if(timeLeft <= 0) { clearInterval(timerObj); alert("Focus Session Done!"); resetTimer(); return; }
        timeLeft--; updateTimerUI();
    }, 1000);
}
function resetTimer() { clearInterval(timerObj); timerObj = null; timeLeft = 1500; updateTimerUI(); }
function updateTimerUI() {
    const m = Math.floor(timeLeft/60), s = timeLeft%60;
    document.getElementById("timer").innerText = `${m}:${s < 10 ? '0' : ''}${s}`;
}

function playSound(t) {
    const audio = document.getElementById("bgAudio");
    const src = {rain: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3", forest: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3", lofi: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"};
    audio.src = src[t]; audio.play();
}
function stopSound() { document.getElementById("bgAudio").pause(); }

function addWater() { waterCount++; localStorage.setItem('water', waterCount); document.getElementById("waterCount").innerText = waterCount; }

// --- 5. Flashcards & Stream Logic ---
function nextCard() {
    const stream = localStorage.getItem("stream") || "bio";
    currentFactIdx = Math.floor(Math.random() * facts[stream].length);
    document.getElementById("cardContent").innerText = facts[stream][currentFactIdx].q;
    isFlipped = false;
}
function flipCard() {
    if(currentFactIdx === -1) return;
    const stream = localStorage.getItem("stream") || "bio";
    document.getElementById("cardContent").innerText = isFlipped ? facts[stream][currentFactIdx].q : facts[stream][currentFactIdx].a;
    isFlipped = !isFlipped;
}

// --- 6. Settings & Localization ---
function applySettings() {
    const profile = { name: document.getElementById("nameInp").value, stream: document.getElementById("streamInp").value, lang: document.getElementById("langInp").value };
    localStorage.setItem("profile", JSON.stringify(profile));
    localStorage.setItem("stream", profile.stream);
    
    document.getElementById("welcomeText").innerText = profile.name ? `Welcome, ${profile.name}` : translations[profile.lang].welcome;
    document.getElementById("streamLabel").innerText = profile.stream === 'bio' ? "Biology Stream" : "Maths Stream";
    document.getElementById("activeStream").innerText = profile.stream.toUpperCase();
    
    const t = translations[profile.lang];
    document.getElementById("gradeHeading").innerText = t.grade;
    document.getElementById("timerHeading").innerText = t.timer;
    document.getElementById("musicHeading").innerText = t.music;
    document.getElementById("cdHeading").innerText = t.cd;
    document.getElementById("noteHeading").innerText = t.note;
    document.getElementById("progHeading").innerText = t.prog;

    document.getElementById("settingsModal").style.display = "none";
    nextCard();
}

// --- 7. Syllabus & Persistence ---
function addUnit() {
    const v = document.getElementById("unitInput").value;
    if(!v) return;
    units.push({name: v, done: false});
    document.getElementById("unitInput").value = "";
    renderUnits();
}
function renderUnits() {
    localStorage.setItem('units', JSON.stringify(units));
    const list = document.getElementById("unitList"); list.innerHTML = "";
    let doneCount = 0;
    units.forEach((u, i) => {
        if(u.done) doneCount++;
        list.innerHTML += `<div class="input-row"><input type="checkbox" onchange="units[${i}].done=!units[${i}].done;renderUnits()" ${u.done?'checked':''}> ${u.name}</div>`;
    });
    const p = units.length ? Math.round((doneCount/units.length)*100) : 0;
    document.getElementById("progressPercent").innerText = p + "%";
    document.getElementById("masterProgress").style.width = p + "%";
}

function saveNote() { localStorage.setItem("note", document.getElementById("notePad").value); }
function setExamDate() { localStorage.setItem("examDate", document.getElementById("examDateInput").value); runCD(); }
function runCD() {
    const target = localStorage.getItem("examDate"); if(!target) return;
    setInterval(() => {
        const d = new Date(target) - new Date();
        if(d < 0) { document.getElementById("countdown").innerText = "Good Luck!"; return; }
        const days = Math.floor(d/86400000), hrs = Math.floor((d%86400000)/3600000);
        document.getElementById("countdown").innerText = `${days}d ${hrs}h Left 🔥`;
    }, 1000);
}

// --- 8. Initialization ---
window.onload = () => {
    if(localStorage.getItem("theme") === "dark") toggleTheme();
    document.getElementById("notePad").value = localStorage.getItem("note") || "";
    document.getElementById("waterCount").innerText = waterCount;
    const p = JSON.parse(localStorage.getItem("profile"));
    if(p) {
        document.getElementById("nameInp").value = p.name;
        document.getElementById("streamInp").value = p.stream;
        document.getElementById("langInp").value = p.lang;
        applySettings();
    }
    renderUnits(); runCD(); nextCard();
    // Bubbles
    setInterval(() => {
        const b = document.createElement("div"); b.className = "bubble";
        b.style.left = Math.random() * 100 + "vw";
        const s = Math.random() * 30 + 20 + "px";
        b.style.width = s; b.style.height = s;
        b.style.animationDuration = Math.random() * 4 + 4 + "s";
        document.getElementById("bubbles-container").appendChild(b);
        setTimeout(() => b.remove(), 8000);
    }, 2000);
};

document.getElementById("settingsBtn").onclick = () => document.getElementById("settingsModal").style.display = "flex";
document.getElementById("closeSettings").onclick = () => document.getElementById("settingsModal").style.display = "none";
function resetAllData() { if(confirm("Are you sure? This will delete all your progress!")) { localStorage.clear(); location.reload(); } }
