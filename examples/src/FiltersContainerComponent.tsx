import * as React from 'react';

export class FiltersContainerComponent extends React.PureComponent {
    render() {
        return <ul {...this.props} />;
    }
}
