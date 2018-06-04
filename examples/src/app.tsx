import * as React from 'react';
import { Draggable } from 'react-managed-draggable';
import { Configuration, createConfigurationBuilder } from '../../lib/es6/configuration';
import { createTableConfigurationBuilder } from '../../lib/es6/table/configuration';
import { resizable } from '../../lib/es6/plugins/table/resizable/resizable';
import { stylable } from '../../lib/es6/plugins/table/stylable/stylable';
import { gridLayout } from '../../lib/es6/plugins/table/grid-layout/grid-layout';
import { virtualGrid } from '../../lib/es6/plugins/table/virtual-grid/virtual-grid';
import { generateTableDescription } from '../../lib/es6/generate-table-description';
import { TableDescription } from '../../lib/es6/table/model';

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
    sizes: number[];
    offset: number;
}

const tableConfiguration = createTableConfigurationBuilder<Data>()
    // .withPlugin(stylable)
    // .withPlugin(resizable)
    .withPlugin(virtualGrid())
    // .withTableHeadGroupRowComponent(() => null)
    // .withTableHeadValueCellComponent((props) =>
    //     props.column.type === 'head-column'
    //         ? <div />
    //         : <div children={props.children} />
    // )
    .build();

const configuration = createConfigurationBuilder<Data>()
    // .withFilter((data) => data.slice(0, 50))
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
    // .withGroup({
    //     id: 'statusCode',
    //     label: 'Status code',
    //     grouper: (data) => {
    //         const byStatusCode: { [Key: string]: number } = {};
    //         const labels: string[] = [];
    //         const dataIndices: number[] = [];

    //         for (const row of data) {
    //             if (byStatusCode[row.statusCode] === undefined) {
    //                 byStatusCode[row.statusCode] = labels.length;
    //                 labels.push(row.statusCode.toString());
    //             }
    //             dataIndices.push(byStatusCode[row.statusCode]);
    //         }

    //         return {
    //             groupIndices: dataIndices,
    //             groupLabels: labels
    //         };
    //     }
    // })
    // .withSelection({
    //     id: 'url-first',
    //     label: 'URL 1st',
    //     grouper: (data) => {
    //         const byUrlFirst: { [Key: string]: number } = {};
    //         const labels: string[] = [];
    //         const dataIndices: number[] = [];

    //         for (const row of data) {
    //             const urlFirst = row.url.split('/')[1];
    //             if (byUrlFirst[urlFirst] === undefined) {
    //                 byUrlFirst[urlFirst] = labels.length;
    //                 labels.push(urlFirst);
    //             }
    //             dataIndices.push(byUrlFirst[urlFirst]);
    //         }

    //         return {
    //             groupIndices: dataIndices,
    //             groupLabels: labels
    //         };
    //     }
    // })
    // .withSelection({
    //     id: 'url-second',
    //     label: 'URL 2nd',
    //     grouper: (data) => {
    //         const byUrlSecond: { [Key: string]: number } = {};
    //         const labels: string[] = [];
    //         const dataIndices: number[] = [];

    //         for (const row of data) {
    //             const urlSecond = row.url.split('/')[2] || row.url.split('/')[1];
    //             if (byUrlSecond[urlSecond] === undefined) {
    //                 byUrlSecond[urlSecond] = labels.length;
    //                 labels.push(urlSecond);
    //             }
    //             dataIndices.push(byUrlSecond[urlSecond]);
    //         }

    //         return {
    //             groupIndices: dataIndices,
    //             groupLabels: labels
    //         };
    //     }
    // })
    .withValue({
        id: 'count',
        label: 'Count',
        reducer: (values) => values.length.toString()
    })
    .withValue({
        id: 'average-duration',
        label: 'Avg. duration',
        reducer: (values) => values.length >= 1 ? `${(values.reduce((sum, data) => sum + data.duration, 0) / values.length).toFixed(1)} ms` : ''
    })
    .withValue({
        id: 'sum-duration',
        label: 'Sum duration',
        reducer: (values) => `${values.reduce((sum, data) => sum + data.duration, 0).toFixed(1)} ms`
    })
    // .withSorter((data1, data2) => data2.length - data1.length)
    .build();

export class App extends React.Component<{}, AppState> {
    state: AppState = { tableDescription: { status: 'loading' }, sizes: [], offset: 0 };

    componentDidMount() {
        window.setInterval(() => this.setState({ sizes: [] }), 1000);

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
                const builds = ['95029', '95029']; // DOM.querySelectorAll('builds > build');
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
                <tableConfiguration.tableContainerComponent
                    tableDescription={this.state.tableDescription.result}
                    rowHeight={20}
                    overscan={2}
                // data={this.state.data.result}
                // filters={configuration.filters}
                // groups={configuration.groups}
                // selections={configuration.selections}
                // values={configuration.values}
                // sorting={configuration.sorting}
                />
            </React.Fragment>;
        }
    }
}
