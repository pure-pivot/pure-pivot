import { TableConfigurationBuilder } from '../../../table/configuration';
import { Sizes } from './model';
import { resizableHoc } from './resizable-head-value-cell';

export interface ResizableTableConfigurationBuilder<D> extends TableConfigurationBuilder<D> {
    initialSizes: Sizes;
    withInitialSizes<C>(this: C, sizes: Sizes): C;
}

export function resizable<D>(tableConfigurationBuilder: TableConfigurationBuilder<D>): ResizableTableConfigurationBuilder<D> {
    const builder: ResizableTableConfigurationBuilder<D> = {
        ...tableConfigurationBuilder,
        initialSizes: {},
        withInitialSizes(sizes: Sizes) {
            builder.initialSizes = sizes;
            return this;
        },
        build() {
            tableConfigurationBuilder.tableHeadValueCellComponent = resizableHoc(this.initialSizes)(this.tableHeadValueCellComponent);
            return tableConfigurationBuilder.build();
        }
    };

    return builder;
}
