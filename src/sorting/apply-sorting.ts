import { Comparators } from './model';

export function applySorting<D>(comparators: Comparators<D>, data1: D[], data2: D[]): number {
    for (const comparator of comparators) {
        const result = comparator(data1, data2);
        if (result !== 0) {
            return result;
        }
    }
    return 0;
}
