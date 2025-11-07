

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
	createParticles();
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
	
	// Animate color gradient: blue -> yellow -> red based on remaining time
	const color = getColorForProgress(percent);
	circle.style.stroke = color;
}

// Calculate color based on time progress (blue -> yellow -> red)
function getColorForProgress(percent) {
	// percent is the remaining time ratio (1.0 = full time, 0.0 = no time)
	if (percent > 0.5) {
		// Blue to yellow transition (100% - 50%)
		const ratio = (percent - 0.5) / 0.5;
		return interpolateColor('#7b6eea', '#f0c419', 1 - ratio);
	} else {
		// Yellow to red transition (50% - 0%)
		const ratio = percent / 0.5;
		return interpolateColor('#f0c419', '#e74c3c', 1 - ratio);
	}
}

// Interpolate between two hex colors
function interpolateColor(color1, color2, ratio) {
	const hex = (color) => {
		const c = color.substring(1);
		return parseInt(c, 16);
	};
	
	const r1 = (hex(color1) >> 16) & 255;
	const g1 = (hex(color1) >> 8) & 255;
	const b1 = hex(color1) & 255;
	
	const r2 = (hex(color2) >> 16) & 255;
	const g2 = (hex(color2) >> 8) & 255;
	const b2 = hex(color2) & 255;
	
	const r = Math.round(r1 + (r2 - r1) * ratio);
	const g = Math.round(g1 + (g2 - g1) * ratio);
	const b = Math.round(b1 + (b2 - b1) * ratio);
	
	return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

// Initialize on DOMContentLoaded
document.addEventListener('DOMContentLoaded', initializeTimer);

// Create particle animation effect for work sessions
function createParticles() {
	// Check if particles container already exists
	if (document.querySelector('.particles')) {
		return; // Don't create duplicates
	}
	
	const particlesContainer = document.createElement('div');
	particlesContainer.className = 'particles';
	document.body.appendChild(particlesContainer);
	
	// Create 15 particles with random properties
	for (let i = 0; i < 15; i++) {
		const particle = document.createElement('div');
		particle.className = 'particle';
		
		// Random size between 3px and 8px
		const size = Math.random() * 5 + 3;
		particle.style.width = `${size}px`;
		particle.style.height = `${size}px`;
		
		// Random horizontal position
		particle.style.left = `${Math.random() * 100}%`;
		
		// Random start position (bottom)
		particle.style.top = `100%`;
		
		// Random animation delay
		particle.style.animationDelay = `${Math.random() * 20}s`;
		
		// Random animation duration variation
		particle.style.animationDuration = `${15 + Math.random() * 10}s`;
		
		particlesContainer.appendChild(particle);
	}
}
