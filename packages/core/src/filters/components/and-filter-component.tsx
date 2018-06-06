// import * as React from 'react';
// import { BinaryFilterBooleanAnd } from '../model';
// import { FilterComponentProps, FilterComponentProvidedProps } from './filter-component';

// export interface AndFilterComponentProps<T> {
//     filter: BinaryFilterBooleanAnd<T>;
//     filterComponent: React.ComponentType<Pick<FilterComponentProps<T>, Exclude<keyof FilterComponentProps<T>, FilterComponentProvidedProps>>>;
// }

// export type AndFilterComponentProvidedProps = 'filterComponent';

// export class AndFilterComponent<T> extends React.Component<AndFilterComponentProps<T>, never> {
//     render() {
//         return <React.Fragment>
//             (<this.props.filterComponent filter={this.props.filter.left} />)
//             AND
//             (<this.props.filterComponent filter={this.props.filter.right} />)
//         </React.Fragment>;
//     }
// }
