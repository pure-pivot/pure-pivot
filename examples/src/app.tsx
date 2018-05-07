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
    .withFieldFormat('statusCode', (statusCode: number) => 200 <= statusCode && statusCode < 300 ? 'OK' : 'NOT OK')
    .withFieldsComponent((props) =>
        <div style={{ display: 'grid', gridTemplateColumns: 'max-content max-content max-content', gridRowGap: '4px', gridColumnGap: '4px' }}>
            <h4>Field</h4>
            <h4>Type</h4>
            <h4>Format</h4>
            {(Object.keys(props.fields) as (keyof Data)[])
                .map((key) =>
                    <props.fieldComponent
                        key={key}
                        name={key}
                        field={props.fields[key]}
                        onFieldChange={(field) => props.onFieldsChange({ ...props.fields, [key]: field })}
                    />
                )}
        </div>
    )
    .withFieldComponent((props) =>
        <React.Fragment>
            <div>{props.name}</div>
            <div>{props.field.type}</div>
            <div><props.fieldSelectionComponent field={props.field} onFieldChange={(field) => props.onFieldChange(field)} /></div>
        </React.Fragment>
    );

type AppState = Configuration<Data>;

export class App extends React.Component<{}, AppState> {
    state: AppState = configurationBuilder.build();

    render() {
        return <this.state.fieldsComponent fields={this.state.fields} onFieldsChange={(fields) => this.setState({ fields })} />;
    }
}
