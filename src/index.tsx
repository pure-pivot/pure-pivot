export * from './configuration';
export * from './fields/model';

import * as React from 'react';

export class MyCoolComponent extends React.Component<{}, never> {
    render() {
        return <React.Fragment>
            Cool yow!
        </React.Fragment>;
    }
}
