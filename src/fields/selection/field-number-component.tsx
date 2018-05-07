import * as React from 'react';
import { Field } from '../model';

export interface FieldNumberSelectionComponentProps {
    format: Field<number>['format'];
    onChangeFormat: (format: Field<number>['format']) => void;
}

export class FieldNumberSelectionComponent extends React.Component<FieldNumberSelectionComponentProps, never> {
    handleChange(format: string) {
        if (format === 'number' || format === 'date' || format === 'time' || format === 'date-time') {
            this.props.onChangeFormat(format);
        }
    }

    render() {
        return <select value={typeof this.props.format === 'string' ? this.props.format : 'custom'} onChange={(event) => this.handleChange(event.currentTarget.value)}>
            <option disabled value="custom">-- custom --</option>
            <option value="number">Number</option>
            <option value="date">Date</option>
            <option value="time">Time</option>
            <option value="date-time">Date/time</option>
        </select>;
    }
}
