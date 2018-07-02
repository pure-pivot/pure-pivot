import { Filters } from './model';

export function applyFilters<D>(filters: Filters<D>, data: D[]): D[] {
    return filters.reduce((data, filter) => filter(data), data);
}
