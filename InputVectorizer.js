/** @zakkster/lite-gamepad — Unified Keyboard + Gamepad */
// Key code mapping — e.code strings to 0-255 indices for the Uint8Array
const KEY_MAP = {
    'KeyW': 87, 'KeyA': 65, 'KeyS': 83, 'KeyD': 68,
    'ArrowUp': 38, 'ArrowLeft': 37, 'ArrowDown': 40, 'ArrowRight': 39,
    'Space': 32, 'Enter': 13, 'ShiftLeft': 16, 'ShiftRight': 16,
    'Escape': 27, 'KeyE': 69, 'KeyQ': 81, 'KeyF': 70,
};

export class InputVectorizer {
    constructor() {
        this.axis = new Float32Array(2);
        this.keys = new Uint8Array(256);
        this.deadzone = 0.15;
        this._ac = new AbortController(); // FIX: AbortController for cleanup
        this._bindEvents();
    }

    _bindEvents() {
        const signal = this._ac.signal;

        // FIX: Use e.code (modern) instead of deprecated e.keyCode
        window.addEventListener('keydown', (e) => {
            const idx = KEY_MAP[e.code];
            if (idx !== undefined) this.keys[idx] = 1;
        }, { signal });

        window.addEventListener('keyup', (e) => {
            const idx = KEY_MAP[e.code];
            if (idx !== undefined) this.keys[idx] = 0;
        }, { signal });
    }

    /** Check a specific action key/button. Call after poll() for cached gamepad. */
    isActionPressed(keyCode, gamepadButtonIndex = 0) {
        if (this.keys[keyCode]) return true;
        if (this._pad && this._pad.buttons[gamepadButtonIndex]?.pressed) return true;
        return false;
    }

    /** Polls current input. Call once per frame start. Returns this.axis. */
    poll() {
        this.axis[0] = 0;
        this.axis[1] = 0;

        // Keyboard (WASD or Arrows)
        if (this.keys[65] || this.keys[37]) this.axis[0] -= 1;
        if (this.keys[68] || this.keys[39]) this.axis[0] += 1;
        if (this.keys[87] || this.keys[38]) this.axis[1] -= 1;
        if (this.keys[83] || this.keys[40]) this.axis[1] += 1;

        // FIX: cache getGamepads() — called once per poll, not twice
        this._pad = navigator.getGamepads()[0];
        const pad = this._pad;
        if (pad && pad.axes.length >= 2) {
            const gx = pad.axes[0];
            const gy = pad.axes[1];

            const r = Math.sqrt(gx * gx + gy * gy);
            if (r > this.deadzone) {
                const scaledMag = (r - this.deadzone) / (1.0 - this.deadzone);
                this.axis[0] = (gx / r) * scaledMag;
                this.axis[1] = (gy / r) * scaledMag;
            }
        }

        // Normalize (prevents diagonal speed boosting)
        const len = Math.sqrt(this.axis[0] * this.axis[0] + this.axis[1] * this.axis[1]);
        if (len > 1.0) {
            this.axis[0] /= len;
            this.axis[1] /= len;
        }

        return this.axis;
    }

    /** FIX: Added destroy() — cleans up event listeners. */
    destroy() {
        this._ac.abort();
        this.keys.fill(0);
    }
}
export default InputVectorizer;
