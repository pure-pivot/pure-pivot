import { RecursiveGroup } from '../groups/apply-grouping';
import { BodyCell, DataColumnDescriptor } from '../table/model';

export interface SortingGroup<D> extends RecursiveGroup {
    rowData: D[];
    cells: BodyCell<D, {}>[];
}

export type Comparator<D> = (group1: SortingGroup<D>, group2: SortingGroup<D>) => number;

export type Comparators<D> = Comparator<D>[];

export type Sorter<D> = (dataColumns: DataColumnDescriptor<D, {}>[]) => Comparator<D>;

export type Sorting<D> = Sorter<D>[];
