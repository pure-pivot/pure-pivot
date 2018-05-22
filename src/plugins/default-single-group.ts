import { ConfigurationBuilder, Configuration } from '../configuration';
import { Filter } from '../filters/model';

export class DefaultSingleGroup<D> extends ConfigurationBuilder<D> {
    build(): Configuration<D> {
        const result = super.build();

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
