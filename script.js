// --- Initial State ---
let timeLeft = 1500;
let timerObj = null;
let roadmap = JSON.parse(localStorage.getItem('roadmap')) || [];
let units = JSON.parse(localStorage.getItem('units')) || [];
let waterCount = localStorage.getItem('water') || 0;
let myChart = null;
let currentFactIdx = -1;
let isFlipped = false;

// --- Quotes Data ---
const quotes = [
    "A/L is a marathon, keep your pace steady!",
    "Success is the sum of small efforts repeated daily.",
    "Don't study to finish, study to understand.",
    "Your future self will thank you for today's hard work.",
    "Combined Maths/Bio is hard, but you are a Warrior!"
];

const facts = {
    bio: [{q:"Unit of Nervous System?", a:"Neuron"}, {q:"Who discovered DNA structure?", a:"Watson and Crick"}],
    maths: [{q:"d/dx of tan(x)?", a:"sec²(x)"}, {q:"Integral of 1/x?", a:"ln|x| + C"}]
};

const translations = {
    ta: { welcome: "வணக்கம், போர்வீரரே!", roadmap: "🗺️ பாடத் திட்டம் & கடினத்தன்மை", graph: "📊 தேர்ச்சி பகுப்பாய்வு", timer: "கவன நேரம்", music: "🌿 அமைதியான சூழல்", water: "💧 தண்ணீர் டிராக்கர்", note: "📝 குறிப்புகள்", unit: "📚 பாட அலகுகள்" },
    en: { welcome: "Welcome, Warrior", roadmap: "🗺️ Subject Roadmap", graph: "📊 Mastery Analysis", timer: "Focus Pomodoro", music: "🌿 Study Ambience", water: "💧 Water Tracker", note: "📝 Study Notes", unit: "📚 Syllabus Unit Master" }
};

// --- Core Functions ---
window.onscroll = () => {
    const h = document.getElementById("mainHeader");
    window.scrollY > 50 ? h.classList.add("scrolled") : h.classList.remove("scrolled");
};

function toggleTheme() {
    document.body.classList.toggle("dark-theme");
    localStorage.setItem("theme", document.body.classList.contains("dark-theme") ? "dark" : "light");
}

function generateQuote() { document.getElementById("quoteText").innerText = `"${quotes[Math.floor(Math.random()*quotes.length)]}"`; }

// --- Roadmap & Graph Logic ---
function addTopic() {
    const sub = document.getElementById("subSelect").value;
    const topic = document.getElementById("topicInput").value;
    const diff = document.getElementById("diffSelect").value;
    const date = document.getElementById("deadlineInput").value;

    if(!topic || !date) return alert("Fill all fields!");
    roadmap.push({ sub, topic, diff, date });
    document.getElementById("topicInput").value = "";
    saveAndRender();
}

function deleteTopic(i) { roadmap.splice(i, 1); saveAndRender(); }

function saveAndRender() {
    localStorage.setItem('roadmap', JSON.stringify(roadmap));
    const list = document.getElementById("topicList");
    list.innerHTML = "";
    
    roadmap.forEach((item, i) => {
        const daysLeft = Math.ceil((new Date(item.date) - new Date()) / (86400000));
        list.innerHTML += `
            <div class="topic-item ${item.diff}">
                <div>
                    <strong>${item.sub}: ${item.topic}</strong><br>
                    <small>${item.diff} | ${daysLeft < 0 ? 'Overdue' : daysLeft + ' days left'}</small>
                </div>
                <button onclick="deleteTopic(${i})" style="padding:5px 10px; background:#ef4444;">Done</button>
            </div>
        `;
    });
    updateChart();
    updateSmartSuggestion();
}

function updateChart() {
    const ctx = document.getElementById('masteryChart').getContext('2d');
    const counts = { Easy: 0, Normal: 0, Hard: 0 };
    roadmap.forEach(item => counts[item.diff]++);

    if (myChart) myChart.destroy();
    myChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Easy', 'Normal', 'Hard'],
            datasets: [{ data: [counts.Easy, counts.Normal, counts.Hard], backgroundColor: ['#22c55e', '#eab308', '#ef4444'], borderWidth: 0 }]
        },
        options: { maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }
    });
}

function updateSmartSuggestion() {
    const hards = roadmap.filter(t => t.diff === 'Hard');
    const text = document.getElementById("smartSuggestion");
    text.innerText = hards.length > 0 ? `Priority: Focus on "${hards[0].topic}" (${hards[0].sub}). It's tough!` : "Great job! Keep moving through your roadmap.";
}

// --- Tools Logic ---
function startTimer() {
    if(timerObj) return;
    timerObj = setInterval(() => {
        if(timeLeft <= 0) { clearInterval(timerObj); alert("Break time!"); resetTimer(); return; }
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

// --- Flashcards ---
function nextCard() {
    const stream = localStorage.getItem("stream") || "bio";
    currentFactIdx = Math.floor(Math.random() * facts[stream].length);
    document.getElementById("cardContent").innerText = facts[stream][currentFactIdx].q;
    isFlipped = false;
}
function flipCard() {
    const stream = localStorage.getItem("stream") || "bio";
    document.getElementById("cardContent").innerText = isFlipped ? facts[stream][currentFactIdx].q : facts[stream][currentFactIdx].a;
    isFlipped = !isFlipped;
}

// --- Units ---
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
    let done = 0;
    units.forEach((u, i) => {
        if(u.done) done++;
        list.innerHTML += `<div class="input-row"><input type="checkbox" onchange="units[${i}].done=!units[${i}].done;renderUnits()" ${u.done?'checked':''}> ${u.name}</div>`;
    });
    const p = units.length ? Math.round((done/units.length)*100) : 0;
    document.getElementById("unitPercent").innerText = p + "% Done";
    document.getElementById("unitProgressFill").style.width = p + "%";
}

// --- Settings & Init ---
function applySettings() {
    const name = document.getElementById("nameInp").value;
    const stream = document.getElementById("streamInp").value;
    const lang = document.getElementById("langInp").value;
    localStorage.setItem("profile", JSON.stringify({name, stream, lang}));
    localStorage.setItem("stream", stream);
    
    document.getElementById("welcomeText").innerText = `Welcome, ${name || 'Warrior'}`;
    document.getElementById("streamLabel").innerText = stream === 'bio' ? "Biology Stream" : "Maths Stream";
    document.getElementById("activeStreamDisplay").innerText = stream.toUpperCase();
    
    const t = translations[lang];
    document.getElementById("roadmapHeading").innerText = t.roadmap;
    document.getElementById("graphHeading").innerText = t.graph;
    document.getElementById("timerHeading").innerText = t.timer;
    document.getElementById("musicHeading").innerText = t.music;
    document.getElementById("waterHeading").innerText = t.water;
    document.getElementById("noteHeading").innerText = t.note;
    document.getElementById("unitHeading").innerText = t.unit;

    document.getElementById("settingsModal").style.display = "none";
    nextCard();
}

window.onload = () => {
    if(localStorage.getItem("theme") === "dark") toggleTheme();
    const p = JSON.parse(localStorage.getItem("profile"));
    if(p) { 
        document.getElementById("nameInp").value = p.name;
        document.getElementById("streamInp").value = p.stream;
        document.getElementById("langInp").value = p.lang;
        applySettings();
    }
    document.getElementById("notePad").value = localStorage.getItem("note") || "";
    document.getElementById("waterCount").innerText = waterCount;
    saveAndRender(); renderUnits(); runCD(); nextCard();
    
    setInterval(() => {
        const b = document.createElement("div"); b.className = "bubble";
        b.style.left = Math.random() * 100 + "vw";
        const s = Math.random() * 30 + 15 + "px";
        b.style.width = s; b.style.height = s;
        b.style.animationDuration = Math.random() * 4 + 4 + "s";
        document.getElementById("bubbles-container").appendChild(b);
        setTimeout(() => b.remove(), 8000);
    }, 2000);
};

function saveNote() { localStorage.setItem("note", document.getElementById("notePad").value); }
function setExamDate() { localStorage.setItem("ed", document.getElementById("examDateInput").value); runCD(); }
function runCD() {
    const ed = localStorage.getItem("ed"); if(!ed) return;
    setInterval(() => {
        const diff = new Date(ed) - new Date();
        if(diff < 0) return;
        document.getElementById("countdown").innerText = Math.floor(diff/86400000) + " Days Left 🔥";
    }, 1000);
}

document.getElementById("settingsBtn").onclick = () => document.getElementById("settingsModal").style.display = "flex";
document.getElementById("closeSettings").onclick = () => document.getElementById("settingsModal").style.display = "none";
function scrollToTop() { window.scrollTo({top: 0, behavior: 'smooth'}); }
function factoryReset() { if(confirm("Delete all data?")) { localStorage.clear(); location.reload(); } }

const GEMINI_API_KEY = "AIzaSyBhF_A6-eJzqO1jioZJGgrr3ommV27KBB0"; 

function toggleChat() {
    document.getElementById("chat-box").classList.toggle("chat-hidden");
}

async function askAI() {
    const inputField = document.getElementById("userInput");
    const chatContent = document.getElementById("chat-content");
    const query = inputField.value.trim();
    
    if (!query) return;

    // மாணவர் மெசேஜ்
    chatContent.innerHTML += `<div class="user-msg">${query}</div>`;
    inputField.value = "";
    chatContent.scrollTop = chatContent.scrollHeight;

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: "You are a helpful Sri Lankan A/L student assistant. Answer in the language the student asks (Tamil/English). Question: " + query }] }]
            })
        });

        const data = await response.json();
        const aiResponse = data.candidates[0].content.parts[0].text;

        // AI மெசேஜ்
        chatContent.innerHTML += `<div class="ai-msg">${aiResponse}</div>`;
        chatContent.scrollTop = chatContent.scrollHeight;
    } catch (error) {
        chatContent.innerHTML += `<div class="ai-msg">மன்னிக்கவும், என்னால் இப்போது பதில் சொல்ல முடியவில்லை. மீண்டும் முயற்சிக்கவும்.</div>`;
    }
}
