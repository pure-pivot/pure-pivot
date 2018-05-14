import { Filter, BinaryFilterBooleanAnd, UnaryFilterNot, LeafFilterEquals, FilterDescription, Filters } from './model';
import { EqualsFilterComponent } from './components/equals-filter-component';

export function applyAndFilter<T>(filter: BinaryFilterBooleanAnd<T>, data: T): boolean {
    return applyFilter(filter.left, data) && applyFilter(filter.right, data);
}

export function applyNotFilter<T>(filter: UnaryFilterNot<T>, data: T): boolean {
    return !applyFilter(filter.filter, data);
}

export function applyEqualsFilter<T>(filter: LeafFilterEquals<T>, data: T): boolean {
    return filter.value === data;
}

export function applyFilter<T>(filter: Filter<T>, data: T): boolean {
    switch (filter.type) {
        case 'and':
            return applyAndFilter(filter, data);
        case 'not':
            return applyNotFilter(filter, data);
        case 'equals':
            return applyEqualsFilter(filter, data);
    }
}

export function applyFilterDescription<D, F extends keyof D>(filterDescription: FilterDescription<D, F>, row: D): boolean {
    return applyFilter(filterDescription.filter, row[filterDescription.name]);
}

export function applyFilters<D>(filters: Filters<D>, row: D): boolean {
    return filters.every((filterDescription) => applyFilterDescription(filterDescription, row));
}

export function applyFiltersToAll<D>(filters: Filters<D>, data: D[]): D[] {
    return data.filter((row) => applyFilters(filters, row));
}
