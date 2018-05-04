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
    time: 1000,
    url: ''
}];

type Foo = Data[keyof Data];

const configuration = new ConfigurationBuilder<Data>(data)
    .withFieldsComponent((props) =>
        <React.Fragment>
            {(Object.keys(props.fields) as (keyof Data)[])
                .map((key) => <props.fieldComponent key={key} field={props.fields[key]} fieldName={key} />)}
        </React.Fragment>
    )
    .withFieldComponent((props) => <div>{props.fieldName} ({props.field.type})</div>)
    .build();

type AppState = Configuration<Data>;

export class App extends React.Component<{}, AppState> {
    state: AppState = configuration;

    render() {
        return <configuration.fieldsComponent />;
    }
}
