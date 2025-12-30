// --- 1. State & Constants ---
let timeLeft = 1500;
let timerObj = null;
let units = JSON.parse(localStorage.getItem('units')) || [];
let currentFactIdx = -1;
let isFlipped = false;

const facts = {
    bio: [
        { q: "Cell membrane structure?", a: "Fluid Mosaic Model" },
        { q: "Hormone for blood sugar?", a: "Insulin" },
        { q: "Unit of Kidney?", a: "Nephron" }
    ],
    maths: [
        { q: "d/dx of sin(x)?", a: "cos(x)" },
        { q: "Integral of 1/x?", a: "ln|x| + C" },
        { q: "Formula for sin²x + cos²x?", a: "1" }
    ]
};

const sounds = {
    rain: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    forest: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    lofi: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
};

// --- 2. Theme & Header Logic ---
function toggleTheme() {
    document.body.classList.toggle("dark-theme");
    localStorage.setItem("theme", document.body.classList.contains("dark-theme") ? "dark" : "light");
}

window.onscroll = () => {
    const header = document.getElementById("mainHeader");
    window.scrollY > 50 ? header.classList.add("scrolled") : header.classList.remove("scrolled");
};

// --- 3. Grade Predictor ---
function predictGrade() {
    const marks = document.getElementById("marksInput").value;
    let grade = marks >= 75 ? "A" : marks >= 65 ? "B" : marks >= 55 ? "C" : marks >= 35 ? "S" : "W";
    document.getElementById("gradeResult").innerText = marks ? `Result: ${grade}` : "-";
}

// --- 4. Focus Timer ---
function startTimer() {
    if (timerObj) return;
    timerObj = setInterval(() => {
        if (timeLeft <= 0) { clearInterval(timerObj); alert("Time for a break!"); resetTimer(); return; }
        timeLeft--; updateTimerUI();
    }, 1000);
}
function resetTimer() { clearInterval(timerObj); timerObj = null; timeLeft = 1500; updateTimerUI(); }
function updateTimerUI() {
    const m = Math.floor(timeLeft / 60), s = timeLeft % 60;
    document.getElementById("timer").innerText = `${m}:${s < 10 ? '0' : ''}${s}`;
}

// --- 5. Ambience Music ---
const audio = document.getElementById("bgAudio");
function playSound(type) { audio.src = sounds[type]; audio.play(); }
function stopSound() { audio.pause(); }

// --- 6. Dynamic Flashcards ---
function nextCard() {
    const stream = localStorage.getItem("stream") || "bio";
    const streamFacts = facts[stream];
    currentFactIdx = Math.floor(Math.random() * streamFacts.length);
    document.getElementById("cardContent").innerText = streamFacts[currentFactIdx].q;
    isFlipped = false;
}
function flipCard() {
    if(currentFactIdx === -1) return;
    const stream = localStorage.getItem("stream") || "bio";
    document.getElementById("cardContent").innerText = isFlipped ? facts[stream][currentFactIdx].q : facts[stream][currentFactIdx].a;
    isFlipped = !isFlipped;
}

// --- 7. Settings & Language ---
const modal = document.getElementById("settingsModal");
document.getElementById("settingsBtn").onclick = () => {
    const p = JSON.parse(localStorage.getItem("profile")) || {};
    document.getElementById("nameInp").value = p.name || "";
    document.getElementById("streamInp").value = p.stream || "bio";
    document.getElementById("langInp").value = p.lang || "en";
    modal.style.display = "flex";
};
document.getElementById("closeSettings").onclick = () => modal.style.display = "none";

function applySettings() {
    const name = document.getElementById("nameInp").value;
    const stream = document.getElementById("streamInp").value;
    const lang = document.getElementById("langInp").value;

    localStorage.setItem("profile", JSON.stringify({name, stream, lang}));
    localStorage.setItem("stream", stream);
    
    document.getElementById("welcomeText").innerText = `Welcome, ${name || 'Warrior'}`;
    document.getElementById("streamLabel").innerText = stream === 'bio' ? "Biology Stream" : "Maths Stream";
    document.getElementById("activeStream").innerText = stream.toUpperCase();
    
    // Language Toggle Logic
    const isTa = lang === "ta";
    document.getElementById("gradeHeading").innerText = isTa ? "📊 தரம் கணித்தல்" : "📊 Grade Predictor";
    document.getElementById("timerHeading").innerText = isTa ? "கவன நேரம்" : "Focus Timer";
    document.getElementById("noteHeading").innerText = isTa ? "📝 குறிப்புகள்" : "📝 Quick Study Notes";
    document.getElementById("cdHeading").innerText = isTa ? "தேர்வு கவுண்ட்டவுன்" : "Exam Countdown";
    document.getElementById("progHeading").innerText = isTa ? "பாட முன்னேற்றம்" : "Unit Master Tracker";

    nextCard();
    modal.style.display = "none";
}

// --- 8. Syllabus Tracker ---
function addUnit() {
    const val = document.getElementById("unitInput").value;
    if(!val) return;
    units.push({name: val, done: false});
    document.getElementById("unitInput").value = "";
    saveAndRenderUnits();
}
function toggleUnit(i) { units[i].done = !units[i].done; saveAndRenderUnits(); }
function saveAndRenderUnits() {
    localStorage.setItem('units', JSON.stringify(units));
    const list = document.getElementById("unitList");
    list.innerHTML = "";
    let doneCount = 0;
    units.forEach((u, i) => {
        if(u.done) doneCount++;
        list.innerHTML += `<div class="unit-item"><input type="checkbox" onchange="toggleUnit(${i})" ${u.done?'checked':''}> ${u.name}</div>`;
    });
    const percent = units.length ? Math.round((doneCount/units.length)*100) : 0;
    document.getElementById("progressPercent").innerText = percent + "%";
    document.getElementById("masterProgress").style.width = percent + "%";
}

// --- 9. Initial Load & Bubbles ---
function saveNote() { localStorage.setItem("studyNote", document.getElementById("notePad").value); }

window.onload = () => {
    if(localStorage.getItem("theme") === "dark") toggleTheme();
    document.getElementById("notePad").value = localStorage.getItem("studyNote") || "";
    const p = JSON.parse(localStorage.getItem("profile"));
    if(p) applySettings(); else nextCard();
    saveAndRenderUnits();
    
    setInterval(() => {
        const b = document.createElement("div");
        b.className = "bubble";
        b.style.left = Math.random() * 100 + "vw";
        const s = Math.random() * 30 + 20 + "px";
        b.style.width = s; b.style.height = s;
        b.style.animationDuration = Math.random() * 4 + 4 + "s";
        document.getElementById("bubbles").appendChild(b);
        setTimeout(() => b.remove(), 8000);
    }, 2000);
};

function resetAllData() { if(confirm("Clear all your progress?")) { localStorage.clear(); location.reload(); } }

// Exam Countdown Logic
function setExamDate() {
    const date = document.getElementById("examDateInput").value;
    if(date) { localStorage.setItem("examDate", date); runCD(); }
}
function runCD() {
    const target = localStorage.getItem("examDate");
    if(!target) return;
    setInterval(() => {
        const diff = new Date(target) - new Date();
        if(diff < 0) return;
        const d = Math.floor(diff/86400000), h = Math.floor((diff%86400000)/3600000), m = Math.floor((diff%3600000)/60000), s = Math.floor((diff%60000)/1000);
        document.getElementById("countdown").innerText = `${d}d ${h}h ${m}m ${s}s left 🔥`;
    }, 1000);
}
runCD();
