import { TableConfigurationBuilder } from '../../../table/configuration';
import { Sizes } from './model';
import { resizableHoc } from './resizable-hoc';

export interface ResizableTableConfigurationBuilder<D> extends TableConfigurationBuilder<D> {
    handleWidth: number;
    initialSizes: Sizes;
    withHandleWidth<C>(this: C, handleWidth: number): C;
    withInitialSizes<C>(this: C, sizes: Sizes): C;
}

export function resizable<D>(tableConfigurationBuilder: TableConfigurationBuilder<D>): ResizableTableConfigurationBuilder<D> {
    const builder: ResizableTableConfigurationBuilder<D> = {
        ...tableConfigurationBuilder,
        handleWidth: 30,
        initialSizes: {},
        withHandleWidth(handleWidth: number) {
            builder.handleWidth = handleWidth;
            return this;
        },
        withInitialSizes(sizes: Sizes) {
            builder.initialSizes = sizes;
            return this;
        },
        build() {
            tableConfigurationBuilder.withTableHeadGroupCellComponent(resizableHoc<D>(this.initialSizes, this.handleWidth)(this.tableHeadGroupCellComponent));
            tableConfigurationBuilder.withTableHeadValueCellComponent(resizableHoc<D>(this.initialSizes, this.handleWidth)(this.tableHeadValueCellComponent));
            return tableConfigurationBuilder.build();
        }
    };

    return builder;
}
