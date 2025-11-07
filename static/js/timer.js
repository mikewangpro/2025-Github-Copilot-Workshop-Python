

// Default timer duration in seconds (25 minutes)
const DEFAULT_DURATION = 25 * 60;
const BREAK_DURATION = 5 * 60;
let timeLeft = DEFAULT_DURATION;
let timerInterval = null;
let isRunning = false;
let isWorkSession = true;
let completedSessions = 4; // Placeholder for demo
let totalFocusTime = 100; // in minutes, placeholder for demo

// Initialize timer display and event handlers
function initializeTimer() {
	updateSessionState(isWorkSession);
	updateTimerDisplay(timeLeft);
	drawCircularProgress(1);
	updateProgress(completedSessions, totalFocusTime);
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
			// Switch between work and break sessions
			if (isWorkSession) {
				completedSessions++;
				totalFocusTime += DEFAULT_DURATION / 60;
			}
			isWorkSession = !isWorkSession;
			updateSessionState(isWorkSession);
			timeLeft = isWorkSession ? DEFAULT_DURATION : BREAK_DURATION;
			updateTimerDisplay(timeLeft);
			updateProgress(completedSessions, totalFocusTime);
		}
	}, 1000);
}

function resetTimer() {
	clearInterval(timerInterval);
	isRunning = false;
	isWorkSession = true;
	timeLeft = DEFAULT_DURATION;
	updateSessionState(isWorkSession);
	updateTimerDisplay(timeLeft);
}

// Switch between work and break session UI
function updateSessionState(isWork) {
	const stateLabel = document.querySelector('.state-label');
	if (!stateLabel) return;
	stateLabel.textContent = isWork ? '作業中' : '休憩中';
	// Optionally, change color or style based on state
}

// Update today's progress UI
function updateProgress(completed, focusMinutes) {
	const completedElem = document.querySelector('.progress-completed .progress-value');
	const focusElem = document.querySelector('.progress-focus .progress-value');
	if (completedElem) completedElem.textContent = completed;
	if (focusElem) {
		const hours = Math.floor(focusMinutes / 60);
		const mins = focusMinutes % 60;
		focusElem.textContent =
			(hours > 0 ? `${hours}時間` : '') + (mins > 0 ? `${mins}分` : (hours === 0 ? '0分' : ''));
	}
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
