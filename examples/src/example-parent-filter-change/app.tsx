import * as React from 'react';
import * as ReactDOM from 'react-dom';
import memoize from 'timed-memoize';
import { createConfigurationBuilder, Configuration } from '../../../packages/core/src/configuration';
import { createTableConfigurationBuilder } from '../../../packages/default-table/src/configuration';
import { virtualGrid } from '../../../packages/virtual-scrolling-grid/src/virtual-scrolling-grid';
import { generateTableDescription } from '../../../packages/core/src/generate-table-description';
import { TableDescription } from '../../../packages/core/src/table/model';
import { Resizer } from '../../../packages/column-resizer/src/resizer-component';
import { Sizes } from '../../../packages/column-resizer/src/model';
import { getHeadValueRowCellId } from '../../../packages/core/src/util/id-helper';
import { autoSorting } from '../../../packages/auto-sorting/src/index';
import { SortingDescriptor, AutoSortingConfigurationBuilder } from '../../../packages/auto-sorting/src/model';
import { assertOrThrow, isString, isNumber } from '../../../packages/core/src/util/assertion';
import { FiltersSelect, FiltersSelectProps } from '../../../packages/filters/src/filters-select';
import { Operator, Filters, Fields } from '../../../packages/filters/src/model';
import { applyOperator } from '../../../packages/filters/src/index';
import { FiltersContainerComponent } from './filters-container-component';
import { FiltersItemComponent } from './filters-item-component';

export interface Data {
    id: string;
    date: number;
    deleted: boolean;
}

const exampleData: Data[] = [
    { id: '1', date: 1532935872663, deleted: false },
    { id: '2', date: 1532935851254, deleted: true },
    { id: '3', date: 1532935800218, deleted: false },
    { id: '4', date: 1532935844587, deleted: true },
    { id: '5', date: 1532935862560, deleted: true }
];

const configurationBuilder = createConfigurationBuilder<Data>();

const fields: Fields<Data> = {
    id: { type: 'string', label: 'ID', apply: (operator, data) => data.filter((row) => applyOperator(operator, row.id.toString())) },
    date: { type: 'number', label: 'date', apply: (operator, data) => data.filter((row) => applyOperator(operator, row.date)) },
    deleted: { type: 'boolean', label: 'deleted', apply: (operator, data) => data.filter((row) => applyOperator(operator, row.deleted)) }
};

export interface AppState {
    table: Element | null;
    filters: Filters;
}

export class App extends React.Component<{}, AppState> {
    state: AppState = {
        table: null,
        filters: {}
    };

    tableConfiguration = createTableConfigurationBuilder<Data>()
        .withPlugin(virtualGrid())
        .build();

    generateTableDescription = memoize<TableDescription<Data>, (configuration: Configuration<Data>, data: Data[]) => TableDescription<Data>>(generateTableDescription, { one: true, timeout: -1 });

    buildConfiguration = memoize((filters: Filters) => {
        return configurationBuilder
            .withFilters(
                Object.keys(filters).map((key) =>
                    (data: Data[]) => fields[filters[key].id].apply(filters[key].operator, data)
                )
            )
            .build();
    }, { one: true, timeout: -1 });

    handleQuickFilter(type?: string) {
        if (!type) {
            this.setState({ filters: {} });
        } else {
            if (type === 'deleted') {
                this.setState({
                    filters: {
                        quickFilterGet: {
                            id: 'deleted',
                            operator: {
                                type: 'boolean-equals',
                                value: true
                            }
                        }
                    }
                });
            }
        }
    }

    renderFilterSelection() {
        return <FiltersSelect
            fields={fields}
            filters={this.state.filters}
            onFiltersChange={(filters) => this.setState({ filters })}
            filtersContainerComponent={FiltersContainerComponent}
            filtersItemComponent={FiltersItemComponent}
        />;
    }

    render() {
        const tableDescription = this.generateTableDescription(this.buildConfiguration(this.state.filters), exampleData);

        return <React.Fragment>
            <div>
                <button onClick={() => this.handleQuickFilter()}>Remove all filters from parent</button>
            </div>
            <h3>Quick Filters</h3>
            <button onClick={() => this.handleQuickFilter('deleted')}>Deleted</button>
            <h3>Filters</h3>
            {this.renderFilterSelection()}
            <h3>Table</h3>
            <this.tableConfiguration.tableContainerComponent
                ref={(ref) => {
                    if (ref !== null) {
                        const element = ReactDOM.findDOMNode(ref);
                        if (element !== null && 'getBoundingClientRect' in element && element !== this.state.table) {
                            this.setState({ table: element });
                        }
                    }
                }}
                columnWidths={{}}
                tableDescription={tableDescription}
                rowHeight={20}
                overscan={2}
                defaultColumnWidth={200}
            />
        </React.Fragment>;
    }
}
