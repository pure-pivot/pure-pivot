import * as React from 'react';
import { FiltersItemComponentProps } from '../../../packages/filters/src/filters-item-component';

export class FiltersItemComponent extends React.PureComponent<FiltersItemComponentProps, never> {
    render() {
        const { onFilterRemove, removeFilterButtonComponent, children } = this.props;
        return <li>
            <this.props.removeFilterButtonComponent onClick={this.props.onFilterRemove} />
            {children}
        </li>;
    }
}
