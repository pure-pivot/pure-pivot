import * as React from 'react';
import { Filter, BinaryFilterBooleanAnd } from '../model';
import { AndFilterComponentProps, AndFilterComponentProvidedProps } from './and-filter-component';
import { NotFilterComponentProps, NotFilterComponentProvidedProps } from './not-filter-components';
import { EqualsFilterComponentProps } from './equals-filter-component';

export interface FilterComponentProps<T> {
    filter: Filter<T>;
    andFilterComponent: React.ComponentType<Pick<AndFilterComponentProps<T>, Exclude<keyof AndFilterComponentProps<T>, AndFilterComponentProvidedProps>>>;
    notFilterComponent: React.ComponentType<Pick<NotFilterComponentProps<T>, Exclude<keyof NotFilterComponentProps<T>, NotFilterComponentProvidedProps>>>;
    equalsFilterComponent: React.ComponentType<EqualsFilterComponentProps<T>>;
}

export type FilterComponentProvidedProps = 'filterComponent' | 'andFilterComponent' | 'notFilterComponent' | 'equalsFilterComponent';

export class FilterComponent<T> extends React.Component<FilterComponentProps<T>, never> {
    render() {
        switch (this.props.filter.type) {
            case 'and':
                return <this.props.andFilterComponent filter={this.props.filter} />;
            case 'equals':
                return <this.props.equalsFilterComponent filter={this.props.filter} />;
            case 'not':
                return <this.props.notFilterComponent filter={this.props.filter} />;
        }
    }
}
