import * as React from 'react';
import { TableDescription } from './model';

export interface TableFootProps<D> {
    tableDescription: TableDescription<D>;
}

export const TableFoot = <D extends {}>(props: TableFootProps<D>) => null;
