import { Comparators, SortingGroup } from './model';

export function applySorting<D>(sorters: Comparators<D>, data1: SortingGroup<D>, data2: SortingGroup<D>): number {
    for (const comparator of sorters) {
        const result = comparator(data1, data2);
        if (result !== 0) {
            return result;
        }
    }
    return 0;
}
