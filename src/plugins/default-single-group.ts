import { ConfigurationBuilder, Configuration } from '../configuration';
import { Filter } from '../filters/model';

export class DefaultSingleGroup<D> {
    private previous: ConfigurationBuilder<D>;

    constructor(previous: ConfigurationBuilder<D>) {
        this.previous = previous;
    }

    build(): Configuration<D> {
        const result = this.previous.build();

        if (result.groups.length <= 0) {
            result.groups = [{
                id: 'pure-pivot-default-group',
                label: 'All',
                grouper: (data) => {
                    const dataIndices: number[] = [];

                    for (const row of data) {
                        dataIndices.push(0);
                    }

                    return {
                        groupIndices: dataIndices,
                        groupLabels: ['all']
                    };
                }
            }];
        }

        return result;
    }
}
