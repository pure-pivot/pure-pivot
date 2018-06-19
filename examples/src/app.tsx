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
import { sortingHelper } from '../../packages/sorting-helper/src/index';
import { ImprovedConfigurationBuilder } from '../../packages/sorting-helper/src/model';

interface WithStatusLoading {
    status: 'loading';
}

interface WithStatusFailed {
    status: 'failed';
    reason: any;
}

interface WithStatusSuccess<T> {
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

interface AppState {
    tableDescription: WithStatus<TableDescription<Data>>;
    sizes: Sizes;
    offset: number;
    table: Element | null;
}

const tableConfiguration = createTableConfigurationBuilder<Data>()
    // .withPlugin(stylable)
    // .withPlugin(resizable)
    .withPlugin(virtualGrid())
    .withTableHeadValueCellComponent((props) => {
        console.log(props);
        return <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', minWidth: 0 }}>{props.children}</div>;
    })
    // .withTableHeadGroupRowComponent(() => null)
    // .withTableHeadValueCellComponent((props) =>
    //     props.column.type === 'head-column'
    //         ? <div />
    //         : <div children={props.children} />
    // )
    .build();

const configuration = createConfigurationBuilder<Data>()
    // .withFilter((data) => data.slice(0, 50))
    .withPlugin<ImprovedConfigurationBuilder<Data>>(sortingHelper)
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
        reducer: (values) => values.length.toString(),
        comparator: (data1, data2) => data1.length - data2.length
    })
    .withValue({
        id: 'average-duration',
        label: 'Avg. duration',
        reducer: (values) => values.length >= 1 ? `${(values.reduce((sum, data) => sum + data.duration, 0) / values.length).toFixed(1)} ms` : '',
        comparator: (data1, data2) => 
    })
    .withValue({
        id: 'sum-duration',
        label: 'Sum duration',
        reducer: (values) => `${values.reduce((sum, data) => sum + data.duration, 0).toFixed(1)} ms`
    })
    .withSorter((dataColumns) => {
        const checks: { [Key: string]: number } = { method: 1, statusCode: 0 };
        const cellIndex = dataColumns.findIndex((column) => column.groupDescriptors.every((group) => checks[group.groupId] === group.groupIndex) && column.valueDescription.id === 'count');
        return (group1, group2) => group1.cells[cellIndex].data.length - group2.cells[cellIndex].data.length;
    })
    .build();

export class App extends React.Component<{}, AppState> {
    state: AppState = {
        tableDescription: { status: 'loading' },
        sizes: {},
        offset: 0,
        table: null
    };

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
                this.setState({ tableDescription: { status: 'success', result: generateTableDescription(configuration)(requests) } });
            })
            .catch((error) => {
                console.error(error);
                this.setState({ tableDescription: { status: 'failed', reason: error } });
            });
    }

    render() {
        if (this.state.tableDescription.status === 'loading') {
            return <React.Fragment>
                Loading...
            </React.Fragment>;
        } else if (this.state.tableDescription.status === 'failed') {
            return <pre>
                {JSON.stringify(this.state.tableDescription.reason, null, 2)}
            </pre>;
        } else {
            return <React.Fragment>
                <h3>Table</h3>
                Sorting: ▼
                <tableConfiguration.tableContainerComponent
                    ref={(ref) => {
                        if (ref !== null) {
                            const element = ReactDOM.findDOMNode(ref);
                            if (element && 'getBoundingClientRect' in element && element !== this.state.table) {
                                this.setState({ table: element });
                            }
                        }
                    }}
                    tableDescription={this.state.tableDescription.result}
                    rowHeight={20}
                    overscan={2}
                    sizes={this.state.sizes}
                // data={this.state.data.result}
                // filters={configuration.filters}
                // groups={configuration.groups}
                // selections={configuration.selections}
                // values={configuration.values}
                // sorting={configuration.sorting}
                />
                {this.state.table !== null &&
                    <Resizer
                        sizes={this.state.sizes}
                        slack={0.1}
                        onSizesChange={(sizes) => this.setState({ sizes })}
                        onSizesChangeEnd={() => undefined}
                        tableDescription={this.state.tableDescription.result}
                        tableElement={this.state.table}
                    />
                }
            </React.Fragment>;
        }
    }
}
