import * as React from 'react';

export interface AddFilterButtonProps {
    onClick: () => void;
}

export class AddFilterButton extends React.Component<AddFilterButtonProps, never> {
    render() {
        return <button type="button" onClick={() => this.props.onClick()}>
                Add filter
        </button>;
    }
}
