// import * as React from 'react';
// import { FilterDescription } from './model';
// import { FilterComponentProps, FilterComponentProvidedProps } from './components/filter-component';

// export interface FilterDescriptionComponentProps<D, F extends keyof D> {
//     filterDescription: FilterDescription<D, F>;
//     filterComponent: React.ComponentType<Pick<FilterComponentProps<D[F]>, Exclude<keyof FilterComponentProps<D[F]>, FilterComponentProvidedProps>>>;
// }

// export type FilterDescriptionComponentProvidedProps = 'filterComponent';

// export class FilterDescriptionComponent<D, F extends keyof D> extends React.Component<FilterDescriptionComponentProps<D, F>, never> {
//     render() {
//         return <li>
//             {this.props.filterDescription.name}
//             ({this.props.filterDescription.id})
//             <this.props.filterComponent filter={this.props.filterDescription.filter} />
//         </li>;
//     }
// }
