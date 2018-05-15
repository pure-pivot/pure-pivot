import * as React from 'react';
import { Values } from './model';
import { ValueComponentProps, ValueComponentProvidedProps } from './value-component';

export interface ValuesComponentProps<D> {
    values: Values<D>;
    valueComponent: React.ComponentType<Pick<ValueComponentProps<D, keyof D>, Exclude<keyof ValueComponentProps<D, keyof D>, ValueComponentProvidedProps>>>;
}

export type ValuesComponentProvidedProps = 'valueComponent';

export class ValuesComponent<D> extends React.Component<ValuesComponentProps<D>, never> {
    render() {
        return <ul>
            {this.props.values.map((value) =>
                <this.props.valueComponent key={value.id} value={value} />
            )}
        </ul>;
    }
}
