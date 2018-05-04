import * as React from 'react';

export type FormatString = 'text' | ((value: string) => string);

export interface FieldStringSelectionComponentProps {
    format: FormatString;
    onChangeFormat?: (format: FormatString) => void;
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
