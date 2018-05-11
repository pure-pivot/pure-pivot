import * as React from 'react';
import { LeafFilterEquals } from '../model';

export interface EqualsFilterComponentProps<T> {
    filter: LeafFilterEquals<T>;
}

export class EqualsFilterComponent<T> extends React.Component<EqualsFilterComponentProps<T>, never> {
    render() {
        return <React.Fragment>
            EQUALS {this.props.filter.value}
        </React.Fragment>;
    }
}
