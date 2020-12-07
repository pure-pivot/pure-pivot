import * as React from 'react';
import { DateOperators } from '../../model';
import { OperatorSelect, Option } from '../../operator-select';
import { DateInputProps } from './date-input';

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

export interface OperatorDateSelectProps<C> {
    context: C;
    operator: DateOperators;
    onOperatorChange: (operator: DateOperators) => void;
    dateInputComponent: React.ComponentType<DateInputProps<C>>;
}

export type OperatorDateSelectProvidedProps = 'dateInputComponent';

export class OperatorDateSelect<C> extends React.PureComponent<OperatorDateSelectProps<C>, never> {
    renderInputComponent() {
        if (this.props.operator.type !== 'is-empty' && this.props.operator.type !== 'is-not-empty') {
            return <this.props.dateInputComponent
                context={this.props.context}
                operator={this.props.operator}
                onOperatorChange={this.props.onOperatorChange}
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
