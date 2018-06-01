import * as React from 'react';
import { TableConfigurationBuilder, TableConfiguration } from '../../../table/configuration';
import { TableHead } from './table-head';
import { TableBody } from './table-body';
import { TableHeadGroupCell } from './table-head-group-cell';
import { TableHeadValueCell } from './table-head-value-cell';
import { tableContainerFactory } from './table-container';
import { tableBodyRowsFactory } from './table-body-rows';
import { provideProps } from '../../../util/provide-props';
import { VirtualScrollingState, Subscription } from './model';
import { TableHeadRows } from './table-head-rows';
import { tableBodyCellFactory } from './table-body-cell';

// TODO: keep all existing functionality of builder, or drop it and make one monolithic component for now, and then perhaps custom .with calls in future

export const virtualGrid = <D>() => <C extends TableConfigurationBuilder<D>>(tableConfigurationBuilder: C): C => {
    const listeners: ((state: VirtualScrollingState) => void)[] = [];
    let initialState: VirtualScrollingState = {
        containerHeight: null,
        containerScrollTop: null,
        rowHeight: 20,
        overscan: 2
    };

    function addListener(listener: (state: VirtualScrollingState) => void): Subscription {
        listeners.push(listener);
        return {
            unsubscribe: () => {
                listeners.splice(listeners.indexOf(listener), 1);
            }
        };
    }

    function pushState(state: Partial<VirtualScrollingState>) {
        initialState = { ...initialState, ...state };
        for (const listener of listeners) {
            listener(initialState);
        }
    }

    tableConfigurationBuilder.withTableBodyCellComponent(tableBodyCellFactory(initialState, addListener));
    tableConfigurationBuilder.withTableHeadRowComponent(React.Fragment);
    tableConfigurationBuilder.withTableHeadRowsComponent(TableHeadRows);
    tableConfigurationBuilder.withTableHeadComponent(TableHead);
    tableConfigurationBuilder.withTableBodyComponent(TableBody);
    tableConfigurationBuilder.withTableBodyRowsComponent(tableBodyRowsFactory(initialState, addListener));
    tableConfigurationBuilder.withTableBodyRowComponent(React.Fragment);
    tableConfigurationBuilder.withTableHeadGroupCellComponent(TableHeadGroupCell);
    tableConfigurationBuilder.withTableHeadValueCellComponent(TableHeadValueCell);
    tableConfigurationBuilder.withTableContainerComponent(tableContainerFactory(initialState, addListener, pushState));

    return tableConfigurationBuilder;
};
