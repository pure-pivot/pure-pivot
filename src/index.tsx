import * as React from 'react';
import * as ReactDOM from 'react-dom';

export class MyCoolComponent extends React.Component<{}, never> {
    render() {
        return <React.Fragment>
            Cool yow!
        </React.Fragment>;
    }
}
