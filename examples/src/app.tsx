import * as React from 'react';
import { ConfigurationBuilder, Configuration } from '../../lib/es6/configuration';

interface Data {
    method: 'GET' | 'POST' | 'PUT';
    statusCode: number;
    time: number;
    url: string;
}

const data: Data[] = [{
    method: 'GET',
    statusCode: 400,
    time: 1525436119501,
    url: 'http://example.org'
}, {
    method: 'POST',
    statusCode: 200,
    time: 1525436158761,
    url: 'http://example.org'
}];

const configurationBuilder = new ConfigurationBuilder(data)
    .withFormat('time', 'date-time')
    .withFormat('statusCode', (statusCode: number) => 200 <= statusCode && statusCode < 300 ? 'OK' : 'NOT OK')
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
    .withFilter({
        id: '0',
        name: 'method',
        filter: {
            type: 'and',
            left: {
                type: 'not',
                filter: {
                    type: 'equals',
                    value: 'GET'
                }
            },
            right: {
                type: 'not',
                filter: {
                    type: 'equals',
                    value: 'PUT'
                }
            }
        }
    })
    .withGroupByField({
        name: 'time',
        groupBy: {
            type: 'number-range',
            range: 30
        }
    });

type AppState = Configuration<Data>;

export class App extends React.Component<{}, AppState> {
    state: AppState = configurationBuilder.build();

    render() {
        return <React.Fragment>
            <h3>Fields</h3>
            <this.state.fieldsComponent fields={this.state.fields} />
            <h3>Filters</h3>
            <this.state.filtersComponent filters={this.state.filters} />
            <h3>Group by</h3>
            <this.state.groupByValueComponent groupByValue={this.state.groupBy} />
            <h3>Values</h3>
            <this.state.valuesComponent values={this.state.values} />
        </React.Fragment>;
    }
}
