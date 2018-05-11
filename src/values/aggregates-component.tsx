import * as React from 'react';
import { Aggregates } from './model';
import { AggregateComponentProps, AggregateComponentProvidedProps } from './aggregate-component';

export interface AggregatesComponentProps<D> {
    values: Aggregates<D>;
    aggregateComponent: React.ComponentType<Pick<AggregateComponentProps<D, keyof D>, Exclude<keyof AggregateComponentProps<D, keyof D>, AggregateComponentProvidedProps>>>;
}

export type AggregatesComponentProvidedProps = 'aggregateComponent';

export class AggregatesComponent<D> extends React.Component<AggregatesComponentProps<D>, never> {
    render() {
        return <ul>
            {this.props.values.map((value) =>
                <this.props.aggregateComponent key={value.id} value={value} />
            )}
        </ul>;
    }
}
