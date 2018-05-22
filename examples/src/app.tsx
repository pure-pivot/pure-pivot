import * as React from 'react';
import { Configuration, createConfigurationBuilder } from '../../lib/es6/configuration';

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

interface Data {
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

type AppState = WithStatus<Configuration<Data>>;

export class App extends React.Component<{}, AppState> {
    state: AppState = { status: 'loading' };

    componentDidMount() {
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
                this.setState({ status: 'success', result: this.buildConfiguration(requests) });
            })
            .catch((error) => {
                console.error(error);
                this.setState({ status: 'failed', reason: error });
            });
    }

    buildConfiguration(data: Data[]): Configuration<Data> {
        return createConfigurationBuilder(data)
            // .withPlugin<DefaultSingleGroup<Data>>(DefaultSingleGroup)
            // .withPlugin<DefaultSingleSelection<Data>>(DefaultSingleSelection)
            // .withFormat('time', (value: number) => {
            //     const date = new Date(value);
            //     return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
            // })
            // .withFormat('statusCode', (statusCode: number) => 200 <= statusCode && statusCode < 300 ? 'OK' : 'NOT OK')
            // .withFieldsComponent((props) =>
            //     <div style={{ display: 'grid', gridTemplateColumns: 'max-content max-content', gridRowGap: '4px', gridColumnGap: '4px' }}>
            //         <h4>Field</h4>
            //         <h4>Type</h4>
            //         {(Object.keys(props.fields) as (keyof Data)[])
            //             .map((key) =>
            //                 <props.fieldComponent
            //                     key={key}
            //                     name={key}
            //                     field={props.fields[key]}
            //                 />
            //             )}
            //     </div>
            // )
            // .withFieldComponent((props) =>
            //     <React.Fragment>
            //         <div>{props.name}</div>
            //         <div>{props.field}</div>
            //     </React.Fragment>
            // )
            // .withFiltersComponent((props) =>
            //     <div style={{ display: 'grid', gridTemplateColumns: 'max-content max-content', gridRowGap: '4px', gridColumnGap: '4px' }}>
            //         <h4>Field (ID)</h4>
            //         <h4>Filter</h4>
            //         {props.filters.map((filterDescription) => <props.filterDescriptionComponent key={filterDescription.id} filterDescription={filterDescription} />)}
            //     </div>
            // )
            // .withFilterDescriptionComponent((props) =>
            //     <React.Fragment>
            //         <div>{props.filterDescription.name} ({props.filterDescription.id})</div>
            //         <div><props.filterComponent filter={props.filterDescription.filter} /></div>
            //     </React.Fragment>
            // )
            // .withAndFilterComponent((props) =>
            //     <div style={{ display: 'grid', gridTemplateColumns: 'max-content max-content max-content', alignItems: 'center', gridColumnGap: '8px' }}>
            //         <div style={{ border: '1px solid black', padding: '2px' }}><props.filterComponent filter={props.filter.left} /></div>
            //         <div>AND</div>
            //         <div style={{ border: '1px solid black', padding: '2px' }}><props.filterComponent filter={props.filter.right} /></div>
            //     </div>
            // )
            // .withFilter({
            //     id: '0',
            //     name: 'method',
            //     filter: {
            //         type: 'and',
            //         left: {
            //             type: 'not',
            //             filter: {
            //                 type: 'equals',
            //                 value: 'HEAD'
            //             }
            //         },
            //         right: {
            //             type: 'not',
            //             filter: {
            //                 type: 'equals',
            //                 value: 'OPTIONS'
            //             }
            //         }
            //     }
            // })
            // .withFilter({
            //     id: '0',
            //     name: 'url',
            //     filter: {
            //         type: 'not',
            //         filter: {
            //             type: 'equals',
            //             value: '/'
            //         }
            //     }
            // })
            // .withGroupByField('time', {
            //     type: 'number-count',
            //     count: 10
            // })
            .withFilter((data) => data)
            // .withGroup({
            //     id: 'method',
            //     label: 'Method',
            //     grouper: (data) => {
            //         const byMethod: { [Key: string]: number } = {};
            //         const labels: string[] = [];
            //         const dataIndices: number[] = [];

            //         for (const row of data) {
            //             if (byMethod[row.method] === undefined) {
            //                 byMethod[row.method] = labels.length;
            //                 labels.push(row.method);
            //             }
            //             dataIndices.push(byMethod[row.method]);
            //         }

            //         return {
            //             groupIndices: dataIndices,
            //             groupLabels: labels
            //         };
            //     }
            // })
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
            // .withValue({
            //     id: 'average-duration',
            //     label: 'Avg. duration',
            //     reducer: (values) => values.length >= 1 ? `${(values.reduce((sum, data) => sum + data.duration, 0) / values.length).toFixed(1)} ms` : ''
            // })
            .build();
    }

    render() {
        if (this.state.status === 'loading') {
            return <React.Fragment>
                Loading...
            </React.Fragment>;
        } else if (this.state.status === 'failed') {
            return <pre>
                {JSON.stringify(this.state.reason, null, 2)}
            </pre>;
        } else {
            return <React.Fragment>
                {/* <h3>Fields</h3>
                <this.state.result.fieldsComponent fields={this.state.result.fields} /> */}
                {/* <h3>Filters</h3>
                <this.state.result.filtersComponent filters={this.state.result.filters} /> */}
                {/* <h3>Group by</h3>
                <this.state.result.groupByValueComponent groupByValue={this.state.result.groupBy} />
                <h3>Values</h3>
                <this.state.result.valuesComponent values={this.state.result.values} /> */}
                <h3>Table</h3>
                <this.state.result.tableComponent
                    data={this.state.result.data}
                    filters={this.state.result.filters}
                    groups={this.state.result.groups}
                    selections={this.state.result.selections}
                    values={this.state.result.values}
                />
            </React.Fragment>;
        }
    }
}
