import * as React from 'react';
import { Filters } from '../filters/model';
import { applyFiltersToAll } from '../filters/apply-filter';
import { GroupByValue } from '../group-by/model';
import { applyGroupByValue } from '../group-by/apply-group-by';
import { Values } from '../values/model';
import { applyValue } from '../values/apply-value';
import { Formats } from '../formats/model';
import { applyFormat } from '../formats/apply-format';

export interface TableProps<D> {
    data: D[];
    filters: Filters<D>;
    groupByValue: GroupByValue<D, keyof D>;
    values: Values<D>;
    formats: Formats<D>;
}

export type TableProvidedProps = never;

export class Table<D> extends React.Component<TableProps<D>, never> {
    render() {
        const filteredData = applyFiltersToAll(this.props.filters, this.props.data);
        const groupedData = applyGroupByValue(this.props.groupByValue, filteredData, this.props.formats);
        const singlePartition = groupedData.length <= 1;

        const labels: { id: string, name: string }[] = this.props.values.map((valueDescription) => {
            return {
                id: valueDescription.id,
                name: `${valueDescription.name} (${valueDescription.value.type})`
            };
        });

        const labeledGroups = groupedData.map((group) => {
            return {
                label: group.label,
                data: this.props.values.map((valueDescription) => {
                    return applyValue(
                        valueDescription.value,
                        group.data.map((row) => row[valueDescription.name]),
                        (value) => applyFormat(value, this.props.formats[valueDescription.name])
                    );
                })
            };
        });

        return <React.Fragment>
            <table>
                <thead>
                    <tr>
                        <th></th>
                        {labeledGroups.map((group, index) => {
                            return <th key={index}>{group.label}</th>;
                        })}
                    </tr>
                </thead>
                <tbody>
                    {labels.map((label, labelIndex) => {
                        return <tr key={labelIndex}>
                            <td>{label.name}</td>
                            {labeledGroups.map((group, groupIndex) => {
                                return <td key={groupIndex}>{group.data[labelIndex]}</td>;
                            })}
                        </tr>;
                    })}
                </tbody>
            </table>
            <pre>
                {JSON.stringify(labels, null, 2)}
            </pre>
            <pre>
                {JSON.stringify(labeledGroups, null, 2)}
            </pre>
        </React.Fragment>;
    }
}
