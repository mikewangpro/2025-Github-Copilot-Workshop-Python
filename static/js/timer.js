
// Default timer duration in seconds (25 minutes)
const DEFAULT_DURATION = 25 * 60;
let timeLeft = DEFAULT_DURATION;

// Initialize timer display and event handlers
function initializeTimer() {
	updateTimerDisplay(timeLeft);
	handleButtonEvents();
}

// Update the timer text display (MM:SS)
function updateTimerDisplay(seconds) {
	const timerText = document.getElementById('timer-text');
	if (!timerText) return;
	const min = String(Math.floor(seconds / 60)).padStart(2, '0');
	const sec = String(seconds % 60).padStart(2, '0');
	timerText.textContent = `${min}:${sec}`;
}

// Attach event listeners to Start and Reset buttons
function handleButtonEvents() {
	const startBtn = document.getElementById('start-btn');
	const resetBtn = document.getElementById('reset-btn');
	if (startBtn) {
		startBtn.addEventListener('click', () => {
			// Placeholder: will implement start logic in next step
			alert('Start button clicked!');
		});
	}
	if (resetBtn) {
		resetBtn.addEventListener('click', () => {
			timeLeft = DEFAULT_DURATION;
			updateTimerDisplay(timeLeft);
		});
	}
}

// Initialize on DOMContentLoaded
document.addEventListener('DOMContentLoaded', initializeTimer);
