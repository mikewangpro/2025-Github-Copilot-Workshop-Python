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

    test('should interpolate colors correctly', () => {
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

        // Test color interpolation at 0% (should be first color)
        expect(interpolateColor('#7b6eea', '#f0c419', 0)).toBe('#7b6eea');
        
        // Test color interpolation at 100% (should be second color)
        expect(interpolateColor('#7b6eea', '#f0c419', 1)).toBe('#f0c419');
    });

    test('should calculate correct color for progress', () => {
        function getColorForProgress(percent) {
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

            if (percent > 0.5) {
                const ratio = (percent - 0.5) / 0.5;
                return interpolateColor('#7b6eea', '#f0c419', 1 - ratio);
            } else {
                const ratio = percent / 0.5;
                return interpolateColor('#f0c419', '#e74c3c', 1 - ratio);
            }
        }

        // At 100% (full time), should be blue
        expect(getColorForProgress(1)).toBe('#7b6eea');
        
        // At 50%, should be yellow
        expect(getColorForProgress(0.5)).toBe('#f0c419');
        
        // At 0%, should be red
        expect(getColorForProgress(0)).toBe('#e74c3c');
        
        // At 75%, should be between blue and yellow
        const color75 = getColorForProgress(0.75);
        expect(color75).toMatch(/^#[0-9a-f]{6}$/);
        
        // At 25%, should be between yellow and red
        const color25 = getColorForProgress(0.25);
        expect(color25).toMatch(/^#[0-9a-f]{6}$/);
    });
});
