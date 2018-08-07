import * as React from 'react';
import { DateOperators } from './model';
import { OperatorSelect, Option } from './operator-select';

const options: Option<DateOperators['type']>[] = [
    { value: 'date-equals', label: '=' },
    { value: 'date-not-equals', label: '!=' },
    { value: 'date-before', label: 'before' },
    { value: 'date-after', label: 'after' },
    { value: 'is-empty', label: 'is empty' },
    { value: 'is-not-empty', label: 'is not empty' },
    { value: 'date-empty-or-before', label: 'is empty or before' },
    { value: 'date-empty-or-after', label: 'is empty or after' }
];

export interface OperatorDateSelectProps {
    operator: DateOperators;
    onOperatorChange: (operator: DateOperators) => void;
}

export class OperatorDateSelect extends React.PureComponent<OperatorDateSelectProps, never> {
    valueField: HTMLInputElement | null = null;

    componentDidMount() {
        if (this.valueField) {
            this.valueField.focus();
        }
    }

    render() {
        const { operator: { type: operatorType} } = this.props;
        const offset = new Date().getTimezoneOffset() * 60 * 1000;

        return <React.Fragment>
            <OperatorSelect
                value={operatorType}
                options={options}
                onOptionChange={(type: DateOperators['type']) => {
                    this.props.onOperatorChange({ type, value: this.props.operator.value } as DateOperators);
                    if (this.valueField) {
                        this.valueField.focus();
                    }
                }}
            />
            {operatorType !== 'is-empty' && operatorType !== 'is-not-empty' && <input
                ref={(ref) => this.valueField = ref}
                type="datetime-local"
                required
                value={new Date(this.props.operator.value - offset).toISOString().substr(0, 16)}
                onChange={(event) => {
                    this.props.onOperatorChange({ type: operatorType, value: +new Date(event.currentTarget.value) } as DateOperators);
                }}
            />}
        </React.Fragment>;
    }
}
