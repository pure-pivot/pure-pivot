import * as React from 'react';

export function provideProps<P, U>(Component: React.ComponentClass<P>, providedProps: U): React.ComponentClass<Pick<P, Exclude<keyof P, keyof U>>>;
export function provideProps<P, U>(Component: React.StatelessComponent<P>, providedProps: U): React.StatelessComponent<Pick<P, Exclude<keyof P, keyof U>>>;
export function provideProps<P, U>(Component: React.ComponentType<P>, providedProps: U): React.ComponentType<Pick<P, Exclude<keyof P, keyof U>>>;
export function provideProps<P, U>(Component: React.ComponentType<P>, providedProps: U): React.ComponentType<Pick<P, Exclude<keyof P, keyof U>>> {
    if ('render' in Component.prototype) {
        return class ProvideProps extends React.Component<Pick<P, Exclude<keyof P, keyof U>>, never> {
            render() {
                return <Component {...providedProps} {...this.props} />;
            }
        };
    } else {
        return (props: Pick<P, Exclude<keyof P, keyof U>>) => <Component {...providedProps} {...props} />;
    }
}
