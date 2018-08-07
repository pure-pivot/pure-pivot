import * as React from 'react';

export class FiltersContainerComponent extends React.Component<{}, never> {
    render() {
        return <ul {...this.props} />;
    }
}
