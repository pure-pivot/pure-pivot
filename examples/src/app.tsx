import * as React from 'react';
import { FieldsComponentProps } from '../../lib/es6/fields/component';
import { ConfigurationBuilder, Configuration } from '../../lib/es6/configuration';

interface Data {
    method: 'GET' | 'POST';
    statusCode: number;
    time: number;
    url: string;
}

const data: Data[] = [{
    method: 'GET',
    statusCode: 400,
    time: 1525436119501,
    url: 'http://example.org'
}];

const configurationBuilder = new ConfigurationBuilder(data)
    .withFieldFormat('time', 'date-time')
    .withFieldsComponent((props) =>
        <React.Fragment>
            {(Object.keys(props.fields) as (keyof Data)[])
                .map((key) => <props.fieldComponent key={key} name={key} field={props.fields[key]} />)}
        </React.Fragment>
    )
    .withFieldComponent((props) =>
        <div>
            {props.name} ({props.field.type}{typeof props.field.format === 'string' ? `, ${props.field.format}` : ''})
        </div>
    );

type AppState = Configuration<Data>;

export class App extends React.Component<{}, AppState> {
    state: AppState = configurationBuilder.build();

    render() {
        return <this.state.fieldsComponent />;
    }
}
