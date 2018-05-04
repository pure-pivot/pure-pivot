import * as React from 'react';

export type FormatBoolean = 'yes-no' | ((value: boolean) => string);

export interface FieldBooleanSelectionComponentProps {
    format: FormatBoolean;
    onChangeFormat?: (format: FormatBoolean) => void;
}

export class FieldBooleanSelectionComponent extends React.Component<FieldBooleanSelectionComponentProps, never> {
    handleChange(format: string) {
        if (this.props.onChangeFormat) {
            if (format === 'yes-no') {
                this.props.onChangeFormat(format);
            }
        }
    }

    render() {
        return <select value={typeof this.props.format === 'string' ? this.props.format : 'custom'} onChange={(event) => this.handleChange(event.currentTarget.value)}>
            <option disabled value="custom">-- custom --</option>
            <option value="yes-no">Yes/no</option>
        </select>;
    }
}
