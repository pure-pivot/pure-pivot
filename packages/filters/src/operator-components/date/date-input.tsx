import * as React from 'react';
import { DateOperators } from '../../model';

export interface DateInputProps<C> {
    context: C;
    operator: DateOperators;
    onOperatorChange: (operator: DateOperators) => void;
}

export class DateInput<C> extends React.Component<DateInputProps<C>, never> {
    render() {
        const offset = new Date().getTimezoneOffset() * 60 * 1000;

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
