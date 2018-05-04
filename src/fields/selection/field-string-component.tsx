import * as React from 'react';
import { Field } from '../model';

export interface FieldStringSelectionComponentProps {
    format: Field<string>['format'];
    onChangeFormat?: (format: Field<string>['format']) => void;
}

export class FieldStringSelectionComponent extends React.Component<FieldStringSelectionComponentProps, never> {
    handleChange(format: string) {
        if (this.props.onChangeFormat) {
            if (format === 'text') {
                this.props.onChangeFormat(format);
            }
        }
    }

    render() {
        return <select value={typeof this.props.format === 'string' ? this.props.format : 'custom'} onChange={(event) => this.handleChange(event.currentTarget.value)}>
            <option disabled value="custom">-- custom --</option>
            <option value="text">Text</option>
        </select>;
    }
}
