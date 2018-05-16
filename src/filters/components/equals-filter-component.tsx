import * as React from 'react';
import { NullaryFilterEquals } from '../model';

export interface EqualsFilterComponentProps<T> {
    filter: NullaryFilterEquals<T>;
}

export class EqualsFilterComponent<T> extends React.Component<EqualsFilterComponentProps<T>, never> {
    render() {
        return <React.Fragment>
            EQUALS {this.props.filter.value}
        </React.Fragment>;
    }
}
