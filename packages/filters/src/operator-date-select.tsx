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

export interface InputComponentProps {
    operator: DateOperators;
    onOperatorChange: (operator: DateOperators) => void;
}

export interface OperatorDateSelectProps extends InputComponentProps {
    inputComponent?: React.ComponentType<InputComponentProps>;
}

export class OperatorDateSelect extends React.PureComponent<OperatorDateSelectProps, never> {
    renderInputComponent(): any {
        const offset = new Date().getTimezoneOffset() * 60 * 1000;

        if (this.props.operator.type !== 'is-empty' && this.props.operator.type !== 'is-not-empty') {
            if (this.props.inputComponent) {
                return <this.props.inputComponent
                    operator={this.props.operator}
                    onOperatorChange={(changedOperator: DateOperators) => this.props.onOperatorChange(changedOperator) }
                />;
            }
            return <input
                type="datetime-local"
                required
                value={new Date(this.props.operator.value - offset).toISOString().substr(0, 16)}
                onChange={(event) => {
                    this.props.onOperatorChange({ type: this.props.operator.type, value: +new Date(event.currentTarget.value) } as DateOperators);
                }}
            />;
        }
    }

    render() {
        return <React.Fragment>
            <OperatorSelect
                value={this.props.operator.type}
                options={options}
                onOptionChange={(type: DateOperators['type']) => {
                    this.props.onOperatorChange({ type, value: this.props.operator.value } as DateOperators);
                }}
            />
            {this.renderInputComponent()}
        </React.Fragment>;
    }
}
