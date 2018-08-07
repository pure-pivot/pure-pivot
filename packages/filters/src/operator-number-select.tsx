import * as React from 'react';
import { NumberOperators } from './model';
import { OperatorSelect, Option } from './operator-select';

const options: Option<NumberOperators['type']>[] = [
    { value: 'number-equals', label: '=' },
    { value: 'number-not-equals', label: '!=' },
    { value: 'number-smaller-than', label: '<' },
    { value: 'number-greater-than', label: '>' },
    { value: 'is-empty', label: 'is empty' },
    { value: 'is-not-empty', label: 'is not empty' }
];

export interface OperatorNumberSelectProps {
    operator: NumberOperators;
    onOperatorChange: (operator: NumberOperators) => void;
}

export class OperatorNumberSelect extends React.PureComponent<OperatorNumberSelectProps, never> {
    valueField: HTMLInputElement | null = null;

    componentDidMount() {
        if (this.valueField) {
            this.valueField.focus();
        }
    }

    render() {
        const { operator: { type: operatorType} } = this.props;

        return <React.Fragment>
            <OperatorSelect
                value={operatorType}
                options={options}
                onOptionChange={(type: NumberOperators['type']) => {
                    this.props.onOperatorChange({ type, value: this.props.operator.value } as NumberOperators);
                    if (this.valueField) {
                        this.valueField.focus();
                    }
                }}
            />
            {operatorType !== 'is-empty' && operatorType !== 'is-not-empty' && <input
                ref={(ref) => this.valueField = ref}
                type="number"
                step="any"
                defaultValue={this.props.operator.value.toString()}
                onChange={(event) => {
                    const value = parseFloat(event.currentTarget.value);
                    if (!Number.isNaN(value)) {
                        this.props.onOperatorChange({ type: operatorType, value } as NumberOperators);
                    }
                }}
            />}
        </React.Fragment>;
    }
}
