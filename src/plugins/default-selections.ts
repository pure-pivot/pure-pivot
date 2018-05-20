import { ConfigurationBuilder } from '../configuration';

export interface Pwap<T> {
    pwap: () => Pwapable<T>;
}

export type Pwapable<T> = T & Pwap<T>;

export const defaultSelections = <CB1 extends ConfigurationBuilder<D>, D extends any = any>(configurationBuilder: CB1): Pwapable<CB1> => {
    const builder: Pwapable<CB1> = Object.assign({}, configurationBuilder, {
        pwap: () => {
            console.log('PWAP');
            return builder;
        }
    });

    return builder;
};
