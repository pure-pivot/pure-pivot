import * as React from 'react';
import { UnaryFilterNot } from '../model';
import { FilterComponentProps, FilterComponentProvidedProps } from './filter-component';

export interface NotFilterComponentProps<T> {
    filter: UnaryFilterNot<T>;
    filterComponent: React.ComponentType<Pick<FilterComponentProps<T>, Exclude<keyof FilterComponentProps<T>, FilterComponentProvidedProps>>>;
}

export type NotFilterComponentProvidedProps = 'filterComponent';

export class NotFilterComponent<T> extends React.Component<NotFilterComponentProps<T>, never> {
    render() {
        return <React.Fragment>
            NOT (<this.props.filterComponent filter={this.props.filter.filter} />)
        </React.Fragment>;
    }
}
