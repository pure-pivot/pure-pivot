import * as React from 'react';
import { StringOperators } from './model';
import { OperatorSelect, Option } from './operator-select';

const options: Option<StringOperators['type']>[] = [
    { value: 'string-equals', label: '=' },
    { value: 'string-not-equals', label: '!=' }
];

export interface OperatorStringSelectProps {
    operator: StringOperators;
    onOperatorChange: (operator: StringOperators) => void;
}

export class OperatorStringSelect extends React.PureComponent<OperatorStringSelectProps, never> {
    render() {
        return <React.Fragment>
            <OperatorSelect
                value={this.props.operator.type}
                options={options}
                onOptionChange={(type: StringOperators['type']) => {
                    this.props.onOperatorChange({ type, value: this.props.operator.value } as StringOperators);
                }}
            />
            <input
                type="text"
                value={this.props.operator.value}
                onChange={(event) => {
                    this.props.onOperatorChange({ type: this.props.operator.type, value: event.currentTarget.value } as StringOperators);
                }}
            />
        </React.Fragment>;
    }
}
