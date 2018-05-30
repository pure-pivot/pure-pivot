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

export interface ResizeTableConfigurationBuilder<D> {
    handleWidth: number;
    initialSizes: Sizes;
    withHandleWidth<C>(this: C, handleWidth: number): C;
    withInitialSizes<C>(this: C, initialSizes: Sizes): C;
}

export const resizable = <D>() => <C extends StylableCellsTableConfigurationBuilder<D>>(tableConfigurationBuilder: C): C & ResizeTableConfigurationBuilder<D> => {
    const builder: C & ResizeTableConfigurationBuilder<D> = Object.assign({}, tableConfigurationBuilder, {
        handleWidth: 30,
        initialSizes: {},
        tableHeadValueCellComponent: resizableHoc<D>({}, 30)(tableConfigurationBuilder.tableHeadValueCellComponent),
        withHandleWidth(handleWidth: number) {
            builder.handleWidth = handleWidth;
            return this;
        },
        withInitialSizes(sizes: Sizes) {
            builder.initialSizes = sizes;
            return this;
        },
        build() {
            tableConfigurationBuilder.withTableHeadValueCellComponent(builder.tableHeadValueCellComponent);
            return tableConfigurationBuilder.build();
        }
    });

    return builder;
};
