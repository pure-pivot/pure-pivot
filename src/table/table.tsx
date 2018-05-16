import * as React from 'react';
import { Filters } from '../filters/model';
import { applyFiltersToAll } from '../filters/apply-filter';
import { Formats } from '../formats/model';
import { ValueReducers } from '../values/model';
import { Groups } from '../groups/model';

export interface TableProps<D> {
    data: D[];
    filters: Filters<D>;
    groups: Groups<D>;
    values: ValueReducers<D>;
    formats: Formats<D>;
}

export type TableProvidedProps = never;

export class Table<D> extends React.Component<TableProps<D>, never> {
    render() {
        const filteredData = applyFiltersToAll(this.props.filters, this.props.data);

        const group1 = this.props.groups[0](filteredData);
        const group2 = group1.map((group) => this.props.groups[1](group));

        const groupedData = this.props.groups.reduce((result, grouper) => grouper(result), filteredData);

        const labels: { id: string, label: string }[] = this.props.values.map((valueDescription) => {
            return {
                id: valueDescription.id,
                label: valueDescription.label
            };
        });

        const labeledGroups = groupedData.map((group) => {
            return {
                label: this.props.formats.groupFormatter(group),
                data: this.props.values.map((valueDescription) => {
                    return valueDescription.reducer(group.map((row) => row[valueDescription.name]));
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
                        return <tr key={label.id}>
                            <td>{label.label}</td>
                            {labeledGroups.map((group, groupIndex) => {
                                return <td key={groupIndex}>{group.label}</td>;
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
