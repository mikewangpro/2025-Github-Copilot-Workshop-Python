// timer.test.js
// Basic unit tests for timer logic (example, not runnable in browser)

describe('Pomodoro Timer Logic', () => {
    test('should format time correctly', () => {
        function formatTime(seconds) {
            const min = String(Math.floor(seconds / 60)).padStart(2, '0');
            const sec = String(seconds % 60).padStart(2, '0');
            return `${min}:${sec}`;
        }
        expect(formatTime(1500)).toBe('25:00');
        expect(formatTime(0)).toBe('00:00');
        expect(formatTime(65)).toBe('01:05');
    });

    test('should switch session state', () => {
        let isWorkSession = true;
        isWorkSession = !isWorkSession;
        expect(isWorkSession).toBe(false);
        isWorkSession = !isWorkSession;
        expect(isWorkSession).toBe(true);
    });
});
