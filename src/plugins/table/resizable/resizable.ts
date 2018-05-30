import { TableConfigurationBuilder, TableConfiguration } from '../../../table/configuration';
import { Sizes } from './model';
import { resizableHoc } from './resizable-hoc';
import { TableHeadGroupCellProps } from '../../../table/table-head-group-cell';
import { TableHeadValueCellProps } from '../../../table/table-head-value-cell';
import { StylableCellsTableConfigurationBuilder } from '../stylable/stylable';

export interface StyledTableHeadGroupCellProps<D> extends TableHeadGroupCellProps<D> {
    style?: React.CSSProperties;
}

export interface StyledTableHeadValueCellProps<D> extends TableHeadValueCellProps<D> {
    style?: React.CSSProperties;
}

export interface ResizeTableConfigurationBuilder {
    handleWidth: number;
    initialSizes: Sizes;
    withHandleWidth<C>(this: C, handleWidth: number): C;
    withInitialSizes<C>(this: C, initialSizes: Sizes): C;
}

export const resizable = <C extends StylableCellsTableConfigurationBuilder<any>>(tableConfigurationBuilder: C): C & ResizeTableConfigurationBuilder => {
    const builder: C & ResizeTableConfigurationBuilder = Object.assign({}, tableConfigurationBuilder, {
        handleWidth: 30,
        initialSizes: {},
        withHandleWidth<C>(this: C, handleWidth: number) {
            builder.handleWidth = handleWidth;
            return this;
        },
        withInitialSizes<C>(this: C, sizes: Sizes) {
            builder.initialSizes = sizes;
            return this;
        },
        build() {
            tableConfigurationBuilder.withTableHeadValueCellComponent(resizableHoc(this.initialSizes, this.handleWidth)(tableConfigurationBuilder.tableHeadValueCellComponent));
            return tableConfigurationBuilder.build();
        }
    });

    return builder;
};
