// --- 1. Infinite Quotes System ---
const quotes = [
    "Success is rising every time you fall!",
    "Work hard in silence, let your success be your noise.",
    "Don't stop when you're tired. Stop when you're done.",
    "The secret of getting ahead is getting started.",
    "A/L is not just an exam, it's a test of your character.",
    "Focus on your goals, the map will show itself.",
    "Believe in yourself and you are halfway there."
];

function newQuote() {
    const quoteElement = document.getElementById("quote");
    const randomIndex = Math.floor(Math.random() * quotes.length);
    
    // Smooth transition effect
    quoteElement.style.opacity = 0;
    setTimeout(() => {
        quoteElement.innerText = `"${quotes[randomIndex]}"`;
        quoteElement.style.opacity = 1;
    }, 300);
}

// --- 2. Header & Centered Logo Control ---
window.onscroll = function() {
    const header = document.getElementById("mainHeader");
    if (window.scrollY > 80) {
        header.classList.add("scrolled");
    } else {
        header.classList.remove("scrolled");
    }
};

// --- 3. Settings Modal Logic ---
const modal = document.getElementById("settingsModal");
const settingsBtn = document.getElementById("settingsBtn");
const closeBtn = document.getElementById("closeSettings");

settingsBtn.onclick = () => modal.style.display = "flex";
closeBtn.onclick = () => modal.style.display = "none";

// Modal-க்கு வெளியே கிளிக் செய்தால் மூட
window.onclick = (event) => {
    if (event.target == modal) modal.style.display = "none";
};

// --- 4. Exam Countdown Logic ---
function setExamDate() {
    const dateInput = document.getElementById("examDateInput").value;
    if (dateInput) {
        localStorage.setItem("alExamDate", dateInput);
        startCountdown();
    }
}

function startCountdown() {
    const targetDate = localStorage.getItem("alExamDate");
    if (!targetDate) return;

    setInterval(() => {
        const now = new Date().getTime();
        const distance = new Date(targetDate).getTime() - now;

        if (distance < 0) {
            document.getElementById("countdown").innerText = "Exam Started! All the Best!";
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById("countdown").innerText = `${days}d ${hours}h ${minutes}m ${seconds}s left 🔥`;
    }, 1000);
}

// --- 5. Pomodoro Timer ---
let timer;
let timeLeft = 25 * 60;

function startTimer() {
    if (timer) return;
    timer = setInterval(() => {
        if (timeLeft <= 0) {
            clearInterval(timer);
            alert("Focus time is over! Take a break.");
        } else {
            timeLeft--;
            const m = Math.floor(timeLeft / 60);
            const s = timeLeft % 60;
            document.getElementById("timer").innerText = `${m}:${s < 10 ? '0' : ''}${s}`;
        }
    }, 1000);
}

function resetTimer() {
    clearInterval(timer);
    timer = null;
    timeLeft = 25 * 60;
    document.getElementById("timer").innerText = "25:00";
}

// --- 6. Task List ---
function addTask() {
    const input = document.getElementById("taskInput");
    if (input.value.trim() === "") return;
    const li = document.createElement("li");
    li.style.padding = "10px 0";
    li.style.borderBottom = "1px solid #eee";
    li.innerHTML = `✅ ${input.value} <span onclick="this.parentElement.remove()" style="cursor:pointer; float:right; color:red">❌</span>`;
    document.getElementById("taskList").appendChild(li);
    input.value = "";
}

// --- 7. Bubbles Creation ---
function createBubble() {
    const b = document.createElement("div");
    b.className = "bubble";
    const size = Math.random() * 40 + 20 + "px";
    b.style.width = size;
    b.style.height = size;
    b.style.left = Math.random() * 100 + "vw";
    b.style.animationDuration = Math.random() * 6 + 4 + "s";
    document.getElementById("bubbles").appendChild(b);
    setTimeout(() => b.remove(), 10000);
}
setInterval(createBubble, 1500);

// Initialize
window.onload = startCountdown;
