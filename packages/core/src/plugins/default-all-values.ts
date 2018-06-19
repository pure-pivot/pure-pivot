import { Configuration } from '../configuration';
import { ObjectKeys } from '../util/keys';
import { TableDescription } from '../table/model';

export function defaultAllValues<D>(generateTableDescription: (configuration: Configuration<D>) => (data: D[]) => TableDescription<D>): (configuration: Configuration<D>) => (data: D[]) => TableDescription<D> {
    return (configuration: Configuration<D>) => (data: D[]) => {
        let values = configuration.values;

        if (values.length <= 0 && data.length >= 1) {
            values = ObjectKeys(data[0]).map((key) => ({
                id: `pure-pivot-default-values-${key}`,
                label: key,
                reducer: (data: D[]) => data.map((row) => row[key]).join(', '),
                renderer: (value: string) => value
            }));
        }

        return generateTableDescription({ ...configuration, values })(data);
    };
}
