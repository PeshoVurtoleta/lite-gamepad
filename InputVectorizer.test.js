// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { InputVectorizer } from './InputVectorizer.js';

beforeEach(() => {
    vi.stubGlobal('navigator', { getGamepads: vi.fn(() => [null, null, null, null]) });
});

describe('InputVectorizer', () => {
    it('constructs with zeroed state', () => {
        const input = new InputVectorizer();
        expect(input.axis[0]).toBe(0);
        expect(input.axis[1]).toBe(0);
        expect(input.deadzone).toBe(0.15);
        input.destroy();
    });

    it('poll returns Float32Array', () => {
        const input = new InputVectorizer();
        const result = input.poll();
        expect(result).toBeInstanceOf(Float32Array);
        expect(result.length).toBe(2);
        input.destroy();
    });

    it('keyboard state is cleared on destroy', () => {
        const input = new InputVectorizer();
        input.keys[87] = 1;
        input.destroy();
        expect(input.keys[87]).toBe(0);
    });

    it('isActionPressed checks keys array', () => {
        const input = new InputVectorizer();
        input.keys[32] = 1;
        expect(input.isActionPressed(32)).toBe(true);
        expect(input.isActionPressed(13)).toBe(false);
        input.destroy();
    });

    it('normalizes diagonal movement', () => {
        const input = new InputVectorizer();
        input.keys[87] = 1; // W
        input.keys[68] = 1; // D
        const axis = input.poll();
        const len = Math.sqrt(axis[0] ** 2 + axis[1] ** 2);
        expect(len).toBeCloseTo(1.0, 4);
        input.destroy();
    });

    it('single axis has magnitude 1', () => {
        const input = new InputVectorizer();
        input.keys[68] = 1; // D only
        const axis = input.poll();
        expect(axis[0]).toBe(1);
        expect(axis[1]).toBe(0);
        input.destroy();
    });
});
