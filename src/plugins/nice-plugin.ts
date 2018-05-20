import { ConfigurationBuilder } from '../configuration';
import { Filter } from '../filters/model';
import { MyCoolPlugin } from './cool-plugin';

export class MyNicePlugin<D> {
    previous: ConfigurationBuilder<D> & MyCoolPlugin<D>;

    constructor(previous: ConfigurationBuilder<D> & MyCoolPlugin<D>) {
        this.previous = previous;
    }

    withFilter(filter: Filter<D>) {
        console.log('nice filter');
        this.previous.withFilter(filter);
        return this;
    }

    pwap() {
        this.previous.honk();
        console.log('PWAP');
        return this;
    }
}
