import * as React from 'react';
import * as shallowEqual from 'shallowequal';
import { ConfigurationBuilder, Configuration } from '../configuration';
import { ObjectKeys } from '../util/keys';
import { ValueReducers } from '../values/model';

export function defaultAllValues<D>(configurationBuilder: ConfigurationBuilder<D>): ConfigurationBuilder<D> {
    return {
        ...configurationBuilder,
        build() {
            const result = configurationBuilder.build();
            const generateTableDescription = result.generateTableDescription;

            result.generateTableDescription = (configuration: Configuration<D>) => (data: D[]) => {
                return generateTableDescription(configuration)(data);
            };

            result.generateTableDescription()

            const TableComponent = result.tableComponent;

            result.tableComponent = class DefaultAllValuesTable extends React.Component<Pick<TableProps<D>, Exclude<keyof TableProps<D>, TableProvidedProps>>, never> {
                shouldComponentUpdate(nextProps: Pick<TableProps<D>, Exclude<keyof TableProps<D>, TableProvidedProps>>) {
                    return !shallowEqual(this.props, nextProps);
                }

                render() {
                    let values = this.props.values;

                    if (this.props.values.length <= 0 && this.props.data.length >= 1) {
                        values = ObjectKeys(this.props.data[0]).map((key) => ({
                            id: `pure-pivot-default-values-${key}`,
                            label: key,
                            reducer: (data: D[]) => data.map((row) => row[key]).join(', ')
                        }));
                    }

                    return <TableComponent {...this.props} values={values} />;
                }
            };

            return result;
        }
    };
}
