import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as ReactRouterDOM from 'react-router-dom';
import { App as ExampleMain } from './example-main/App';
import { App as ExampleParentFilterChange } from './example-parent-filter-change/App';

const container = document.createElement('div');
document.body.appendChild(container);

ReactDOM.render(
    <ReactRouterDOM.HashRouter>
        <React.Fragment>
            <ReactRouterDOM.Link to="/main">Main</ReactRouterDOM.Link>
            <ReactRouterDOM.Link to="/parent-filter-change">Parent filter change</ReactRouterDOM.Link>
            <ReactRouterDOM.Route path="/main" component={ExampleMain} />
            <ReactRouterDOM.Route path="/parent-filter-change" component={ExampleParentFilterChange} />
        </React.Fragment>
    </ReactRouterDOM.HashRouter>,
    container
);
