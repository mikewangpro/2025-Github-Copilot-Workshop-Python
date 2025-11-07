

// Default timer duration in seconds (25 minutes)
const DEFAULT_DURATION = 25 * 60;
let timeLeft = DEFAULT_DURATION;
let timerInterval = null;
let isRunning = false;

// Initialize timer display and event handlers
function initializeTimer() {
	updateTimerDisplay(timeLeft);
	drawCircularProgress(1);
	handleButtonEvents();
}

// Update the timer text display (MM:SS)
function updateTimerDisplay(seconds) {
	const timerText = document.getElementById('timer-text');
	if (!timerText) return;
	const min = String(Math.floor(seconds / 60)).padStart(2, '0');
	const sec = String(seconds % 60).padStart(2, '0');
	timerText.textContent = `${min}:${sec}`;
	drawCircularProgress(seconds / DEFAULT_DURATION);
}

// Attach event listeners to Start and Reset buttons
function handleButtonEvents() {
	const startBtn = document.getElementById('start-btn');
	const resetBtn = document.getElementById('reset-btn');
	if (startBtn) {
		startBtn.addEventListener('click', () => {
			if (!isRunning) {
				startTimer();
			}
		});
	}
	if (resetBtn) {
		resetBtn.addEventListener('click', () => {
			resetTimer();
		});
	}
}

function startTimer() {
	if (isRunning) return;
	isRunning = true;
	timerInterval = setInterval(() => {
		if (timeLeft > 0) {
			timeLeft--;
			updateTimerDisplay(timeLeft);
		} else {
			clearInterval(timerInterval);
			isRunning = false;
			// Optionally: play sound or show notification
		}
	}, 1000);
}

function resetTimer() {
	clearInterval(timerInterval);
	isRunning = false;
	timeLeft = DEFAULT_DURATION;
	updateTimerDisplay(timeLeft);
}

// Draw circular progress bar (percent: 1.0 = full, 0.0 = empty)
function drawCircularProgress(percent) {
	const circle = document.getElementById('progress-bar');
	if (!circle) return;
	const radius = circle.r.baseVal.value;
	const circumference = 2 * Math.PI * radius;
	circle.style.strokeDasharray = `${circumference}`;
	circle.style.strokeDashoffset = `${circumference * (1 - percent)}`;
}

// Initialize on DOMContentLoaded
document.addEventListener('DOMContentLoaded', initializeTimer);
