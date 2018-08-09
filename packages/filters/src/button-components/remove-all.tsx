import * as React from 'react';

export interface RemoveAllButtonProps {
    disabled: boolean;
    onClick: () => void;
}

export class RemoveAllButton extends React.Component<RemoveAllButtonProps, never> {
    render() {
        return <button type="button" disabled={this.props.disabled} onClick={() => this.props.onClick()}>
                Remove all
        </button>;
    }
}
