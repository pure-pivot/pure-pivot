import * as React from 'react';
import { provideProps } from '@pure-pivot/core/lib/es6/util/provide-props';
import { BooleanInputProps, BooleanInput } from './operator-components/boolean/boolean-input';
import { UncontrolledFiltersSelectProps, UncontrolledFiltersSelectProvidedProps, UncontrolledFiltersSelect } from './uncontrolled-filters-select';
import { ControlledFiltersSelectProps, ControlledFiltersSelect, ControlledFiltersSelectProvidedProps } from './controlled-filters-select';
import { DateInputProps, DateInput } from './operator-components/date/date-input';
import { NumberInputProps, NumberInput } from './operator-components/number/number-input';
import { StringInputProps, StringInput } from './operator-components/string/string-input';
import { FiltersContainerComponent } from './filters-container-component';
import { FiltersItemComponent } from './filters-item-component';
import { ControlledFilterSelect, ControlledFilterSelectProps } from './controlled-filter-select';
import { UncontrolledFilterSelectProps, UncontrolledFilterSelect } from './uncontrolled-filter-select';
import { OperatorBooleanSelect, OperatorBooleanSelectProps } from './operator-components/boolean/operator-boolean-select';
import { OperatorDateSelect, OperatorDateSelectProps } from './operator-components/date/operator-date-select';
import { OperatorNumberSelect, OperatorNumberSelectProps } from './operator-components/number/operator-number-select';
import { OperatorStringSelect, OperatorStringSelectProps } from './operator-components/string/operator-string-select';

export interface Configuration<D> {
    uncontrolledFiltersSelectComponent: React.ComponentType<Pick<UncontrolledFiltersSelectProps<D>, Exclude<keyof UncontrolledFiltersSelectProps<D>, UncontrolledFiltersSelectProvidedProps>>>;
    controlledFiltersSelectComponent: React.ComponentType<Pick<ControlledFiltersSelectProps<D>, Exclude<keyof ControlledFiltersSelectProps<D>, ControlledFiltersSelectProvidedProps>>>;
}

export interface ConfigurationBuilder<D> {
    filtersContainerComponent: React.ComponentType<{}>;
    filtersItemComponent: React.ComponentType<{}>;
    booleanInputComponent: React.ComponentType<BooleanInputProps>;
    dateInputComponent: React.ComponentType<DateInputProps>;
    numberInputComponent: React.ComponentType<NumberInputProps>;
    stringInputComponent: React.ComponentType<StringInputProps>;
    booleanSelectComponent: React.ComponentType<OperatorBooleanSelectProps>;
    dateSelectComponent: React.ComponentType<OperatorDateSelectProps>;
    numberSelectComponent: React.ComponentType<OperatorNumberSelectProps>;
    stringSelectComponent: React.ComponentType<OperatorStringSelectProps>;
    withBooleanInputComponent(booleanInputComponent: React.ComponentType<BooleanInputProps>): this;
    withDateInputComponent(dateInputComponent: React.ComponentType<DateInputProps>): this;
    withNumberInputComponent(numberInputComponent: React.ComponentType<NumberInputProps>): this;
    withStringInputComponent(stringInputComponent: React.ComponentType<StringInputProps>): this;
    build(): Configuration<D>;
}

export function configurationBuilder<D>(): ConfigurationBuilder<D> {
    const builder: ConfigurationBuilder<D> = {
        filtersContainerComponent: FiltersContainerComponent,
        filtersItemComponent: FiltersItemComponent,
        booleanInputComponent: BooleanInput,
        dateInputComponent: DateInput,
        numberInputComponent: NumberInput,
        stringInputComponent: StringInput,
        booleanSelectComponent: OperatorBooleanSelect,
        dateSelectComponent: OperatorDateSelect,
        numberSelectComponent: OperatorNumberSelect,
        stringSelectComponent: OperatorStringSelect,
        withBooleanInputComponent(booleanInputComponent: React.ComponentType<BooleanInputProps>) {
            builder.booleanInputComponent = booleanInputComponent;
            return this;
        },
        withDateInputComponent(dateInputComponent: React.ComponentType<DateInputProps>) {
            builder.dateInputComponent = dateInputComponent;
            return this;
        },
        withNumberInputComponent(numberInputComponent: React.ComponentType<NumberInputProps>) {
            builder.numberInputComponent = numberInputComponent;
            return this;
        },
        withStringInputComponent(stringInputComponent: React.ComponentType<StringInputProps>) {
            builder.stringInputComponent = stringInputComponent;
            return this;
        },
        build() {
            const controlledFilterSelectComponent: React.ComponentType<ControlledFilterSelectProps<D>> = ControlledFilterSelect;
            const controlledFiltersSelectComponent: React.ComponentType<ControlledFiltersSelectProps<D>> = ControlledFiltersSelect;
            const uncontrolledFilterSelectComponent: React.ComponentType<UncontrolledFilterSelectProps<D>> = UncontrolledFilterSelect;
            const uncontrolledFiltersSelectComponent: React.ComponentType<UncontrolledFiltersSelectProps<D>> = UncontrolledFiltersSelect;

            const selectComponents = {
                booleanSelectComponent: provideProps(builder.booleanSelectComponent, {
                    booleanInputComponent: builder.booleanInputComponent
                }),
                dateSelectComponent: provideProps(builder.dateSelectComponent, {
                    dateInputComponent: builder.dateInputComponent
                }),
                numberSelectComponent: provideProps(builder.numberSelectComponent, {
                    numberInputComponent: builder.numberInputComponent
                }),
                stringSelectComponent: provideProps(builder.stringSelectComponent, {
                    stringInputComponent: builder.stringInputComponent
                })
            };

            return {
                controlledFiltersSelectComponent: provideProps(controlledFiltersSelectComponent, {
                    filtersContainerComponent: builder.filtersContainerComponent,
                    filtersItemComponent: builder.filtersItemComponent,
                    controlledFilterSelectComponent: provideProps(controlledFilterSelectComponent, selectComponents)
                }),
                uncontrolledFiltersSelectComponent: provideProps(uncontrolledFiltersSelectComponent, {
                    filtersContainerComponent: builder.filtersContainerComponent,
                    filtersItemComponent: builder.filtersItemComponent,
                    uncontrolledFilterSelectComponent: provideProps(uncontrolledFilterSelectComponent, selectComponents)
                })
            };
        }
    };

    return builder;
}
