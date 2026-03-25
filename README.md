# @zakkster/lite-gamepad

[![npm version](https://img.shields.io/npm/v/@zakkster/lite-gamepad.svg?style=for-the-badge&color=latest)](https://www.npmjs.com/package/@zakkster/lite-gamepad)
[![npm bundle size](https://img.shields.io/bundlephobia/minzip/@zakkster/lite-gamepad?style=for-the-badge)](https://bundlephobia.com/result?p=@zakkster/lite-gamepad)
[![npm downloads](https://img.shields.io/npm/dm/@zakkster/lite-gamepad?style=for-the-badge&color=blue)](https://www.npmjs.com/package/@zakkster/lite-gamepad)
[![npm total downloads](https://img.shields.io/npm/dt/@zakkster/lite-gamepad?style=for-the-badge&color=blue)](https://www.npmjs.com/package/@zakkster/lite-gamepad)
![TypeScript](https://img.shields.io/badge/TypeScript-Types-informational)
![Dependencies](https://img.shields.io/badge/dependencies-0-brightgreen)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

## 🎮 What is lite-gamepad?

`@zakkster/lite-gamepad` unifies WASD, arrow keys, and gamepad analog sticks into a single normalized `Float32Array(2)` movement vector.

It gives you:

- 🎮 Unified keyboard + gamepad in one API
- 🕹️ Radial deadzone with smooth scaling (no snap)
- ↗️ Diagonal normalization (no speed boost on diagonals)
- 🧹 AbortController cleanup — no leaked listeners
- 🔢 Uint8Array key state (zero allocation per poll)
- 🪶 < 1 KB minified

Call `poll()` once per frame — get a normalized direction vector.

Part of the [@zakkster/lite-*](https://www.npmjs.com/org/zakkster) ecosystem — micro-libraries built for deterministic, cache-friendly game development.

## 🚀 Install

```bash
npm i @zakkster/lite-gamepad
```

## 🕹️ Quick Start

```javascript
import { InputVectorizer } from '@zakkster/lite-gamepad';

const input = new InputVectorizer();

function gameLoop() {
    const [dx, dy] = input.poll();
    player.x += dx * speed * dt;
    player.y += dy * speed * dt;
    requestAnimationFrame(gameLoop);
}

// Check action buttons
if (input.isActionPressed(32, 0)) shoot(); // Space or Gamepad A

// Cleanup
input.destroy();
```

## 🧠 Why This Exists

Keyboard gives you `[-1, 0, 1]` per axis. Gamepad gives you `[-1.0 ... 1.0]` with deadzone drift. lite-gamepad normalizes both into the same `Float32Array(2)` — clamped magnitude, smooth deadzone, zero allocation.

## 📊 Comparison

| Library | Size | Keyboard | Gamepad | Deadzone | Normalized | Install |
|---------|------|----------|---------|----------|------------|---------|
| gamepad.js | ~3 KB | No | Yes | Basic | No | `npm i gamepad.js` |
| keymaster | ~4 KB | Yes | No | N/A | No | `npm i keymaster` |
| **lite-gamepad** | **< 1 KB** | **Yes** | **Yes** | **Radial smooth** | **Yes** | **`npm i @zakkster/lite-gamepad`** |

## ⚙️ API

### `new InputVectorizer()`
### `poll()` — Returns `Float32Array(2)` normalized movement vector. Call once per frame.
### `isActionPressed(keyCode, gamepadButtonIndex?)` — Check action key/button state
### `destroy()` — Cleans up all event listeners via AbortController

## 🧪 Benchmark

```
N/A — input polling is I/O bound, not CPU bound.
Key advantage: zero allocation per poll() call (Float32Array reuse).
```

## 📦 TypeScript

Full TypeScript declarations included in `InputVectorizer.d.ts`.

## 📚 LLM-Friendly Documentation

See `llms.txt` for AI-optimized metadata and usage examples.

## License

MIT
