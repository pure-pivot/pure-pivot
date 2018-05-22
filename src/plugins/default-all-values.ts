import { ConfigurationBuilder, Configuration } from '../configuration';
import { Filter } from '../filters/model';
import { ObjectKeys } from '../util/keys';

export class DefaultAllValues<D> {
    private previous: ConfigurationBuilder<D>;

    constructor(previous: ConfigurationBuilder<D>) {
        this.previous = previous;
    }

    build(): Configuration<D> {
        const result = this.previous.build();

        console.log(this.previous);

        if (result.values.length <= 0 && this.previous.data.length >= 1) {
            result.values = ObjectKeys(this.previous.data[0]).map((key) => ({
                id: `pure-pivot-default-values-${key}`,
                label: key,
                reducer: (data: D[]) => {
                    return data.map((row) => row[key]).join(', ');
                }
            }));
        }

        return result;
    }
}
