import { ConfigurationBuilder } from '../configuration';

export interface Honk<T> {
    honk: () => Honkable<T>;
}

export type Honkable<T> = T & Honk<T>;

export const defaultGroups = <CB1 extends ConfigurationBuilder<D>, D extends any = any>(configurationBuilder: CB1): Honkable<CB1> => {
    const newConfigurationBuilder = configurationBuilder as Honkable<CB1>;

    newConfigurationBuilder.honk = () => {
        console.log('HONK');
        return newConfigurationBuilder;
    };

    return newConfigurationBuilder;

    // const builder: ConfigurationBuilder<D> & Honkable<ConfigurationBuilder<D>> = Object.assign({}, configurationBuilder, {
    //     build: () => {
    //         return {
    //             ...configurationBuilder.build(),
    //             groups: [{}]
    //         };

    //         // const result = { ...configurationBuilder.build() };
    //         // if (result.groups.length <= 0) {
    //         //     result.groups = [{
    //         //         id: 'pure-pivot-default-grouping',
    //         //         label: 'All',
    //         //         grouper: (data) => {
    //         //             return data;
    //         //         }
    //         //     }];
    //         // }
    //         // return result;
    //     },
    //     honk: () => {
    //         console.log('HONK');
    //         return builder;
    //     }
    // });

    // return builder;
};
