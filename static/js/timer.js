

// Default timer duration in seconds (25 minutes)
const DEFAULT_DURATION = 25 * 60;
const BREAK_DURATION = 5 * 60;
let timeLeft = DEFAULT_DURATION;
let timerInterval = null;
let isRunning = false;
let isWorkSession = true;
let completedSessions = 0;
let totalFocusTime = 0;

// Initialize timer display and event handlers
async function initializeTimer() {
	await fetchProgressData();
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
	const sessionDuration = isWorkSession ? DEFAULT_DURATION : BREAK_DURATION;
	drawCircularProgress(seconds / sessionDuration);
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

async function startTimer() {
	if (isRunning) return;
	isRunning = true;
	timerInterval = setInterval(async () => {
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
				await saveProgressData();
			}
			isWorkSession = !isWorkSession;
			updateSessionState(isWorkSession);
			timeLeft = isWorkSession ? DEFAULT_DURATION : BREAK_DURATION;
			updateTimerDisplay(timeLeft);
			updateProgress(completedSessions, totalFocusTime);
		}
	}, 1000);
}
// Fetch progress data from backend
async function fetchProgressData() {
	try {
		const res = await fetch('/get_progress');
		if (!res.ok) throw new Error('Failed to fetch progress');
		const data = await res.json();
		completedSessions = data.completed_sessions;
		totalFocusTime = data.total_focus_minutes;
	} catch (e) {
		// fallback to 0 if error
		console.error('Failed to fetch progress data:', e);
		completedSessions = 0;
		totalFocusTime = 0;
	}
}

// Save progress data to backend
async function saveProgressData() {
	try {
		await fetch('/save_progress', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ work_session: true, focus_minutes: DEFAULT_DURATION / 60 })
		});
	} catch (e) {
		// ignore error for now
		console.error('Failed to save progress data:', e);
	}
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
