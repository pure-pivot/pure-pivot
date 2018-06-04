import { ObjectKeys } from './keys';

export const domDescriptionHelper = <T>(initial: T, onDOMDescription: (domDescription: T) => void) => {
    const checks: { [Key in keyof T]?: boolean } = {};
    return <K extends keyof T>(key: K, ref: T[K]) => {
        initial[key] = ref;
        if (ObjectKeys(initial).every((key) => checks[key] === true)) {
            onDOMDescription(initial);
        }
    };
};
