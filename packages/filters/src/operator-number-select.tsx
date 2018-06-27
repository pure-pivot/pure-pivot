import * as React from 'react';
import { NumberOperators } from './model';
import { OperatorSelect, Option } from './operator-select';

const options: Option<NumberOperators['type']>[] = [
    { value: 'number-equals', label: '=' },
    { value: 'number-not-equals', label: '!=' }
];

export interface OperatorNumberSelectProps {
    operator: NumberOperators | null;
    onOperatorChange: (operator: NumberOperators) => void;
}

export class OperatorNumberSelect extends React.Component<OperatorNumberSelectProps, never> {
    render() {
        const type = this.props.operator === null ? null : this.props.operator.type;
        const value = this.props.operator === null ? '' : this.props.operator.value;

        return <React.Fragment>
            <OperatorSelect
                value={type}
                options={options}
                onOptionChange={(type: NumberOperators['type']) => {
                    this.props.onOperatorChange({ type, value } as NumberOperators);
                }}
            />
        </React.Fragment>;
    }
}
