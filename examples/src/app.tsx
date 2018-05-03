import * as React from 'react';
import { Configuration, Field, Fields, ConfigurationBuilder } from '../../lib/es6/index';

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

const fields: Fields<Data> = {
    method: {
        type: 'string',
        format: 'text'
    },
    statusCode: {
        type: 'number',
        format: 'number'
    },
    time: {
        type: 'number',
        format: 'date-time'
    },
    url: {
        type: 'string',
        format: 'text'
    }
};

const configuration = new ConfigurationBuilder<Data>(data, fields).build();

type AppState = Configuration<Data>;

export class App extends React.Component<{}, AppState> {
    state: AppState = configuration;

    render() {
        return <Everything.MyCoolComponent />;
    }
}
