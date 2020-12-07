import * as React from 'react';
import { NumberOperators } from '../../model';

export interface NumberInputProps<C> {
    context: C;
    operator: NumberOperators;
    onOperatorChange: (operator: NumberOperators) => void;
}

export class NumberInput<C> extends React.Component<NumberInputProps<C>, never> {
    render() {
        return <input
            type="number"
            step="any"
            defaultValue={this.props.operator.value.toString()}
            onChange={(event) => {
                const value = parseFloat(event.currentTarget.value);
                if (!Number.isNaN(value)) {
                    this.props.onOperatorChange({ type: this.props.operator.type, value } as NumberOperators);
                }
            }}
        />;
    }
}
