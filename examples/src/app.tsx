import * as React from 'react';
import * as ReactDOM from 'react-dom';
// import { Configuration, createConfigurationBuilder } from '@pure-pivot/core/lib/es6/configuration';
// import { createTableConfigurationBuilder } from '@pure-pivot/default-table/lib/es6/configuration';
// import { virtualGrid } from '@pure-pivot/virtual-scrolling-grid';
// import { generateTableDescription } from '@pure-pivot/core/lib/es6/generate-table-description';
// import { TableDescription } from '@pure-pivot/core/lib/es6/table/model';
// import { Resizer } from '@pure-pivot/column-resizer/lib/es6/resizer-component';
// import { Sizes } from '@pure-pivot/column-resizer/lib/es6/model';
import { createConfigurationBuilder } from '../../packages/core/src/configuration';
import { createTableConfigurationBuilder } from '../../packages/default-table/src/configuration';
import { virtualGrid } from '../../packages/virtual-scrolling-grid/src/virtual-scrolling-grid';
import { generateTableDescription } from '../../packages/core/src/generate-table-description';
import { TableDescription } from '../../packages/core/src/table/model';
import { Resizer } from '../../packages/column-resizer/src/resizer-component';
import { Sizes } from '../../packages/column-resizer/src/model';
import { getHeadValueRowCellId } from '../../packages/core/src/util/id-helper';
import { autoSorting } from '../../packages/auto-sorting/src/index';
import { SortingDescriptor, AutoSortingConfigurationBuilder } from '../../packages/auto-sorting/src/model';
import { ToggleComponent } from '../../packages/auto-sorting/src/toggle-component';
import { assertOrThrow, isString, isNumber } from '../../packages/core/src/util/assertion';
import { FiltersSelect } from '../../packages/filters/src/filters-select';
import { Operator, Filters } from '../../packages/filters/src/model';

export interface WithStatusLoading {
    status: 'loading';
}

export interface WithStatusFailed {
    status: 'failed';
    reason: any;
}

export interface WithStatusSuccess<T> {
    status: 'success';
    result: T;
}

export type WithStatus<T> = WithStatusLoading | WithStatusFailed | WithStatusSuccess<T>;

export interface Data {
    method: 'GET' | 'POST' | 'PUT' | 'OPTIONS' | 'HEAD';
    statusCode: number;
    time: number;
    url: string;
    duration: number;
}

function isData(object: any): object is Data {
    return typeof object === 'object'
        && (object.method === 'GET' || object.method === 'POST' || object.method === 'PUT' || object.method === 'OPTIONS' || object.method === 'HEAD')
        && typeof object.statusCode === 'number'
        && typeof object.time === 'number'
        && typeof object.url === 'string'
        && typeof object.duration === 'number';
}

function isArrayOfData(object: any): object is Data[] {
    return Array.isArray(object) && object.every((item) => isData(item));
}

const configurationBuilder = createConfigurationBuilder<Data>()
    // .withFilter((data) => data.slice(0, 50))
    .withPlugin<AutoSortingConfigurationBuilder<Data>>(autoSorting)
    .withGroup({
        id: 'method',
        label: 'Method',
        grouper: (data) => {
            const byMethod: { [Key: string]: number } = {};
            const labels: string[] = [];
            const dataIndices: number[] = [];

            for (const row of data) {
                if (byMethod[row.method] === undefined) {
                    byMethod[row.method] = labels.length;
                    labels.push(row.method);
                }
                dataIndices.push(byMethod[row.method]);
            }

            return {
                groupIndices: dataIndices,
                groupLabels: labels
            };
        }
    })
    .withGroup({
        id: 'statusCode',
        label: 'Status code',
        grouper: (data) => {
            const byStatusCode: { [Key: string]: number } = {};
            const labels: string[] = [];
            const dataIndices: number[] = [];

            for (const row of data) {
                if (byStatusCode[row.statusCode] === undefined) {
                    byStatusCode[row.statusCode] = labels.length;
                    labels.push(row.statusCode.toString());
                }
                dataIndices.push(byStatusCode[row.statusCode]);
            }

            return {
                groupIndices: dataIndices,
                groupLabels: labels
            };
        }
    })
    .withSelection({
        id: 'url-first',
        label: 'URL 1st',
        grouper: (data) => {
            const byUrlFirst: { [Key: string]: number } = {};
            const labels: string[] = [];
            const dataIndices: number[] = [];

            for (const row of data) {
                const urlFirst = row.url.split('/')[1];
                if (byUrlFirst[urlFirst] === undefined) {
                    byUrlFirst[urlFirst] = labels.length;
                    labels.push(urlFirst);
                }
                dataIndices.push(byUrlFirst[urlFirst]);
            }

            return {
                groupIndices: dataIndices,
                groupLabels: labels
            };
        }
    })
    .withSelection({
        id: 'url-second',
        label: 'URL 2nd',
        grouper: (data) => {
            const byUrlSecond: { [Key: string]: number } = {};
            const labels: string[] = [];
            const dataIndices: number[] = [];

            for (const row of data) {
                const urlSecond = row.url.split('/')[2] || row.url.split('/')[1];
                if (byUrlSecond[urlSecond] === undefined) {
                    byUrlSecond[urlSecond] = labels.length;
                    labels.push(urlSecond);
                }
                dataIndices.push(byUrlSecond[urlSecond]);
            }

            return {
                groupIndices: dataIndices,
                groupLabels: labels
            };
        }
    })
    .withValue({
        id: 'count',
        label: 'Count',
        reducer: (values) => values.length,
        renderer: (value: number) => value.toString(),
        comparator: (value1, value2) => value1 - value2
    })
    .withValue({
        id: 'average-duration',
        label: 'Avg. duration',
        reducer: (values) => values.reduce((sum, data) => sum + data.duration, 0) / values.length,
        renderer: (value: number) => Number.isNaN(value) ? '' : `${value.toFixed(1)} ms`,
        comparator: (value1, value2) => Number.isNaN(value1) ? -1 : Number.isNaN(value2) ? 1 : value1 - value2
    })
    .withValue({
        id: 'sum-duration',
        label: 'Sum duration',
        reducer: (values) => values.reduce((sum, data) => sum + data.duration, 0),
        renderer: (value: number) => `${value.toFixed(1)} ms`,
        comparator: (value1, value2) => value1 - value2
    });

// .withAutoSorter({
//     valueId: 'sum-duration',
//     groupDescriptors: [{
//         groupId: 'pure-pivot-default-group',
//         groupIndex: 0
//     }],
//     order: 'descending'
// })

export interface StringEqualsOperator {
    type: 'string-equals';
    value: string;
}

export function applyStringEqualsOperator(operator: StringEqualsOperator, value: string) {
    return operator.value === value;
}

export interface StringNotEqualsOperator {
    type: 'string-not-equals';
    value: string;
}

export function applyStringNotEqualsOperator(operator: StringNotEqualsOperator, value: string) {
    return operator.value !== value;
}

export type StringOperators = StringEqualsOperator | StringNotEqualsOperator;

export interface NumberEqualsOperator {
    type: 'number-equals';
    value: number;
}

export function applyNumberEqualsOperator(operator: NumberEqualsOperator, value: number) {
    return operator.value === value;
}

export type NumberOperators = NumberEqualsOperator;

export type Operator = StringOperators | NumberOperators;

export function applyOperator(operator: Operator, value: any) {
    switch (operator.type) {
        case 'string-equals':
            return applyStringEqualsOperator(operator, assertOrThrow(value, isString));
        case 'number-equals':
            return applyNumberEqualsOperator(operator, assertOrThrow(value, isNumber));
    }
}

export interface MethodFilter {
    key: 'method';
    operator: StringOperators | null;
}

export interface StatusCodeFilter {
    key: 'statusCode';
    operator: NumberOperators | null;
}

export interface TimeFilter {
    key: 'time';
    operator: NumberOperators | null;
}

export interface UrlFilter {
    key: 'url';
    operator: StringOperators | null;
}

export interface DurationFilter {
    key: 'duration';
    operator: NumberOperators | null;
}

export type Filter = MethodFilter | StatusCodeFilter | TimeFilter | UrlFilter | DurationFilter;

export function applyFilter(filter: Filter, data: Data[]) {
    if (filter.operator === null) {
        return data;
    } else {
        const operator = filter.operator;
        return data.filter((row) => applyOperator(operator, row[filter.key]));
    }
}

export interface AppState {
    async: WithStatus<{ data: Data[], tableDescription: TableDescription<Data> }>;
    sizes: Sizes;
    offset: number;
    table: Element | null;
    sorting: SortingDescriptor | null;
    filters: Filters;
}

export class App extends React.Component<{}, AppState> {
    state: AppState = {
        async: { status: 'loading' },
        sizes: {},
        offset: 0,
        table: null,
        sorting: null,
        filters: {}
    };

    tableConfiguration = createTableConfigurationBuilder<Data>()
        .withPlugin(virtualGrid())
        .withTableHeadValueCellComponent((props) =>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', minWidth: 0 }}>{props.children}</span>
                {props.column.type === 'data-column'
                    && <ToggleComponent
                        activeSorting={this.state.sorting}
                        column={props.column}
                        onSetActiveSorting={(sorting) => {
                            this.setState({
                                sorting,
                                async: this.state.async.status === 'success'
                                    ? {
                                        ...this.state.async,
                                        result: {
                                            ...this.state.async.result,
                                            tableDescription: generateTableDescription(this.buildConfiguration(sorting))(this.state.async.result.data)
                                        }
                                    }
                                    : this.state.async
                            });
                        }}
                    />
                }
            </div>
        )
        // .withTableHeadGroupRowComponent(() => null)
        // .withTableHeadValueCellComponent((props) =>
        //     props.column.type === 'head-column'
        //         ? <div />
        //         : <div children={props.children} />
        // )
        .build();

    buildConfiguration(sorting: SortingDescriptor | null) {
        if (sorting === null) {
            return configurationBuilder.withAutoSorters([]).build();
        } else {
            return configurationBuilder.withAutoSorters([sorting]).build();
        }
    }

    componentDidMount() {
        // window.setInterval(() => this.setState({ sizes: [] }), 1000);

        fetch(`http://build.test-cancun.com:8111/app/rest/builds/?guest=1&locator=count:${2},buildType:(id:CancunProduction_HealthCheck)`)
            .then((response) => {
                if (response.status === 200) {
                    return response.text();
                } else {
                    return response.text().then((data) => {
                        throw new Error(data);
                    });
                }
            })
            .then((data) => {
                const parser = new DOMParser();
                const DOM = parser.parseFromString(data, 'text/xml');
                const builds = ['104259', '104260']; // DOM.querySelectorAll('builds > build');
                let promise: Promise<any[]> = Promise.resolve([]);

                for (const build of builds) {
                    // const id = build.getAttribute('id');
                    const id = build;
                    promise = promise.then((result) => {
                        return fetch(`http://build.test-cancun.com:8111/app/rest/builds/id:${id}/artifacts/content/health.json?guest=1`)
                            .then((response) => response.json())
                            .then((data) => {
                                return [...result, data];
                            });
                    });
                }

                return promise;
            })
            .then((result) => {
                const healths = result.map((healthEntry) => healthEntry[0][Object.keys(healthEntry[0])[0]]);
                let requests: Data[] = [];
                for (const health of healths) {
                    if (isArrayOfData(health.requests)) {
                        requests = [...requests, ...health.requests];
                    } else {
                        throw new Error('Data type assertion failed.');
                    }
                }
                requests.sort((a, b) => a.time - b.time);
                this.setState({ async: { status: 'success', result: { data: requests, tableDescription: generateTableDescription(this.buildConfiguration(this.state.sorting))(requests) } } });
            })
            .catch((error) => {
                console.error(error);
                this.setState({ async: { status: 'failed', reason: error } });
            });
    }

    renderFilterSelection() {
        return <FiltersSelect
            fields={{
                method: { type: 'string', label: 'Method' },
                statusCode: { type: 'number', label: 'Status code' },
                time: { type: 'date', label: 'Time' },
                url: { type: 'string', label: 'URL' },
                duration: { type: 'number', label: 'Duration' }
            }}
            defaultFilters={this.state.filters}
            onFiltersChange={(filters) => this.setState({ filters })}
        />;
    }

    render() {
        if (this.state.async.status === 'loading') {
            return <React.Fragment>
                Loading...
            </React.Fragment>;
        } else if (this.state.async.status === 'failed') {
            return <pre>
                {JSON.stringify(this.state.async.reason, null, 2)}
            </pre>;
        } else {
            return <React.Fragment>
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
                    tableDescription={this.state.async.result.tableDescription}
                    rowHeight={20}
                    overscan={2}
                    columnWidths={this.state.sizes}
                    defaultColumnWidth={200}
                >
                    {this.state.table !== null
                        && <Resizer
                            columnWidths={this.state.sizes}
                            defaultColumnWidth={200}
                            minimumColumnWidth={20}
                            onWidthsChange={(sizes) => this.setState({ sizes })}
                            onWidthsChangeEnd={() => undefined}
                            tableDescription={this.state.async.result.tableDescription}
                            tableElement={this.state.table}
                            dragHandleWidth={20}
                            dragHandleComponent={() => <div style={{ position: 'absolute', left: 9.5, width: 1, height: '100%', backgroundColor: 'green' }} />}
                        />
                    }
                </this.tableConfiguration.tableContainerComponent>
            </React.Fragment>;
        }
    }
}
