export function clamp(t: number, min: number, max: number) {
    return Math.min(max, Math.max(min, t));
}
