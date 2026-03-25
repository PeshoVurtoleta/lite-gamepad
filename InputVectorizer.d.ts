export class InputVectorizer {
    readonly axis: Float32Array;
    readonly keys: Uint8Array;
    deadzone: number;
    constructor();
    isActionPressed(keyCode: number, gamepadButtonIndex?: number): boolean;
    poll(): Float32Array;
    destroy(): void;
}
export default InputVectorizer;
