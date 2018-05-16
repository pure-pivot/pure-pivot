import * as React from 'react';
import { Filters, Filter, FilterDescription } from './model';
import { FilterDescriptionComponentProps, FilterDescriptionComponentProvidedProps } from './filter-description-component';

export interface FiltersComponentProps<D> {
    filters: Filters<D>;
    filterDescriptionComponent: React.ComponentType<Pick<FilterDescriptionComponentProps<D, keyof D>, Exclude<keyof FilterDescriptionComponentProps<D, keyof D>, FilterDescriptionComponentProvidedProps>>>;
}

export type FiltersComponentProvidedProps = 'filterDescriptionComponent';

export class FiltersComponent<D> extends React.Component<FiltersComponentProps<D>, never> {
    render() {
        return <ul>
            {this.props.filters.map((filterDescription) =>
                <this.props.filterDescriptionComponent key={filterDescription.id} filterDescription={filterDescription} />
            )}
        </ul>;
    }
}
