import * as React from 'react';
import { DateOperators } from './model';
import { OperatorSelect, Option } from './operator-select';

const options: Option<DateOperators['type']>[] = [
    { value: 'date-equals', label: '=' },
    { value: 'date-not-equals', label: '!=' }
];

export interface OperatorDateSelectProps {
    operator: DateOperators | null;
    onOperatorChange: (operator: DateOperators) => void;
}

export class OperatorDateSelect extends React.Component<OperatorDateSelectProps, never> {
    render() {
        const type = this.props.operator === null ? null : this.props.operator.type;
        const value = this.props.operator === null ? '' : this.props.operator.value;

        return <React.Fragment>
            <OperatorSelect
                value={type}
                options={options}
                onOptionChange={(type: DateOperators['type']) => {
                    this.props.onOperatorChange({ type, value } as DateOperators);
                }}
            />
        </React.Fragment>;
    }
}
