import { ConfigurationBuilder } from '../configuration';
import { Filter } from '../filters/model';

export class MyNicePlugin<D> {
    previous: ConfigurationBuilder<D>;

    constructor(previous: ConfigurationBuilder<D>) {
        this.previous = previous;
    }

    withFilter(filter: Filter<D>) {
        console.log('nice filter');
        this.previous.withFilter(filter);
        return this;
    }

    pwap() {
        console.log('PWAP');
        return this;
    }
}
