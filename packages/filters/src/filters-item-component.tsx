import * as React from 'react';
import { RemoveFilterButtonProps } from './button-components/remove-filter';

export interface FiltersItemComponentProps {
    onFilterRemove: () => void;
    removeFilterButtonComponent: React.ComponentType<RemoveFilterButtonProps>;
}

export type FiltersItemComponentProvidedProps = 'removeFilterButtonComponent';

export class FiltersItemComponent extends React.Component<FiltersItemComponentProps, never> {
    render() {
        return <li>
            {this.props.children}
            <this.props.removeFilterButtonComponent onClick={this.props.onFilterRemove} />
        </li>;
    }
}
