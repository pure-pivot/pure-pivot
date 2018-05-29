import { TableConfigurationBuilder } from '../../../table/configuration';
import { Sizes } from './model';

export interface ResizableTableConfigurationBuilder<D> extends TableConfigurationBuilder<D> {
    initialSizes: Sizes;
    withInitialSizes<C>(this: C, sizes: Sizes): C;
}

export function resizable<D>(tableConfigurationBuilder: TableConfigurationBuilder<D>): ResizableTableConfigurationBuilder<D> {
    const builder: ResizableTableConfigurationBuilder<D> = {
        ...tableConfigurationBuilder,
        initialSizes: {},
        // tableHeadValueCellComponent: ResizableTableHeadValueCell,
        withInitialSizes(sizes: Sizes) {
            builder.initialSizes = sizes;
            return this;
        },
        build() {
            return '';
        }
        // withTableHeadValueCellComponent(tableHeadValueCellComponent: React.ComponentType<ResizableTableHeadValueCellProps<D>>) {
        //     builder.tableHeadValueCellComponent = tableHeadValueCellComponent;
        //     return this;
        // }
    };

    return builder;
}
