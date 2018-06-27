import * as React from 'react';
import { DateOperators } from './model';
import { OperatorSelect, Option } from './operator-select';

const options: Option<DateOperators['type']>[] = [
    { value: 'date-equals', label: '=' },
    { value: 'date-not-equals', label: '!=' }
];

export interface OperatorDateSelectProps {
    operator: DateOperators;
    onOperatorChange: (operator: DateOperators) => void;
}

export class OperatorDateSelect extends React.Component<OperatorDateSelectProps, never> {
    render() {
        return <React.Fragment>
            <OperatorSelect
                value={this.props.operator.type}
                options={options}
                onOptionChange={(type: DateOperators['type']) => {
                    this.props.onOperatorChange({ type, value: this.props.operator.value } as DateOperators);
                }}
            />
            <input
                type="datetime-local"
                value={new Date(this.props.operator.value).toISOString().substr(0, 16)}
                onChange={(event) => {
                    console.log(event.currentTarget.value);
                    this.props.onOperatorChange({ type: this.props.operator.type, value: +new Date(event.currentTarget.value) } as DateOperators);
                }}
            />
        </React.Fragment>;
    }
}
