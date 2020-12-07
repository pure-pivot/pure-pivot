import * as React from 'react';
import { StringOperators } from '../../model';

export interface StringInputProps<C> {
    context: C;
    operator: StringOperators;
    onOperatorChange: (operator: StringOperators) => void;
}

export class StringInput<C> extends React.Component<StringInputProps<C>, never> {
    render() {
        return <input
            type="text"
            value={this.props.operator.value}
            onChange={(event) => {
                this.props.onOperatorChange({ type: this.props.operator.type, value: event.currentTarget.value } as StringOperators);
            }}
        />;
    }
}
