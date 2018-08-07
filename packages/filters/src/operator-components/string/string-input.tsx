import * as React from 'react';
import { StringOperators } from '../../model';

export interface StringInputProps {
    operator: StringOperators;
    onOperatorChange: (operator: StringOperators) => void;
}

export class StringInput extends React.Component<StringInputProps, never> {
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
