import * as React from 'react';
import { StringOperators } from './model';
import { OperatorSelect, Option } from './operator-select';

const options: Option<StringOperators['type']>[] = [
    { value: 'string-equals', label: '=' },
    { value: 'string-not-equals', label: '!=' }
];

export interface OperatorStringSelectProps {
    operator: StringOperators | null;
    onOperatorChange: (operator: StringOperators) => void;
}

export class OperatorStringSelect extends React.Component<OperatorStringSelectProps, never> {
    render() {
        const type = this.props.operator === null ? null : this.props.operator.type;
        const value = this.props.operator === null ? '' : this.props.operator.value;

        return <React.Fragment>
            <OperatorSelect
                value={type}
                options={options}
                onOptionChange={(type: StringOperators['type']) => {
                    this.props.onOperatorChange({ type, value } as StringOperators);
                }}
            />
            <input type="text" value={value} onChange={(event) => this.props.onOperatorChange({})} />
        </React.Fragment>;
    }
}
