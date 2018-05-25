import { ConfigurationBuilder } from '../configuration';
import { ObjectKeys } from '../util/keys';

export function defaultAllValues<D>(configurationBuilder: ConfigurationBuilder<D>): ConfigurationBuilder<D> {
    return Object.assign({}, configurationBuilder, {
        build: () => {
            const result = configurationBuilder.build();

            if (result.values.length <= 0 && result.data.length >= 1) {
                result.values = ObjectKeys(result.data[0]).map((key) => ({
                    id: `pure-pivot-default-values-${key}`,
                    label: key,
                    reducer: (data: D[]) => {
                        return data.map((row) => row[key]).join(', ');
                    }
                }));
            }

            return result;
        }
    });
}
