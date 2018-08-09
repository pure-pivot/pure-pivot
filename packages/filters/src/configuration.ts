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
import { AddFilterButton, AddFilterButtonProps } from './button-components/add-filter';
import { RemoveFilterButton, RemoveFilterButtonProps } from './button-components/remove-filter';
import { RemoveAllButton, RemoveAllButtonProps } from './button-components/remove-all';

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
    addFilterButtonComponent: React.ComponentType<AddFilterButtonProps>;
    removeFilterButtonComponent: React.ComponentType<RemoveFilterButtonProps>;
    removeAllButtonComponent: React.ComponentType<RemoveAllButtonProps>;
    withFiltersContainerComponent(filtersContainerComponent: React.ComponentType<{}>): this;
    withFiltersItemComponent(filtersItemComponent: React.ComponentType<{}>): this;
    withBooleanInputComponent(booleanInputComponent: React.ComponentType<BooleanInputProps>): this;
    withDateInputComponent(dateInputComponent: React.ComponentType<DateInputProps>): this;
    withNumberInputComponent(numberInputComponent: React.ComponentType<NumberInputProps>): this;
    withStringInputComponent(stringInputComponent: React.ComponentType<StringInputProps>): this;
    withAddFilterButtonComponent(addFilterButtonComponent: React.ComponentType<AddFilterButtonProps>): this;
    withRemoveFilterButtonComponent(removeFilterButtonComponent: React.ComponentType<RemoveFilterButtonProps>): this;
    withRemoveAllButtonComponent(removeAllButtonComponent: React.ComponentType<RemoveAllButtonProps>): this;
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
        addFilterButtonComponent: AddFilterButton,
        removeFilterButtonComponent: RemoveFilterButton,
        removeAllButtonComponent: RemoveAllButton,
        withFiltersContainerComponent(filtersContainerComponent: React.ComponentType<{}>) {
            builder.filtersContainerComponent = filtersContainerComponent;
            return this;
        },
        withFiltersItemComponent(filtersItemComponent: React.ComponentType<{}>) {
            builder.filtersItemComponent = filtersItemComponent;
            return this;
        },
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
        withAddFilterButtonComponent(addFilterButtonComponent: React.ComponentType<AddFilterButtonProps>) {
            builder.addFilterButtonComponent = addFilterButtonComponent;
            return this;
        },
        withRemoveFilterButtonComponent(removeFilterButtonComponent: React.ComponentType<RemoveFilterButtonProps>) {
            builder.removeFilterButtonComponent = removeFilterButtonComponent;
            return this;
        },
        withRemoveAllButtonComponent(removeAllButtonComponent: React.ComponentType<RemoveAllButtonProps>) {
            builder.removeAllButtonComponent = removeAllButtonComponent;
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
                    addFilterButtonComponent: builder.addFilterButtonComponent,
                    removeFilterButtonComponent: builder.removeFilterButtonComponent,
                    removeAllButtonComponent: builder.removeAllButtonComponent,
                    controlledFilterSelectComponent: provideProps(controlledFilterSelectComponent, selectComponents)
                }),
                uncontrolledFiltersSelectComponent: provideProps(uncontrolledFiltersSelectComponent, {
                    filtersContainerComponent: builder.filtersContainerComponent,
                    filtersItemComponent: builder.filtersItemComponent,
                    addFilterButtonComponent: builder.addFilterButtonComponent,
                    removeFilterButtonComponent: builder.removeFilterButtonComponent,
                    removeAllButtonComponent: builder.removeAllButtonComponent,
                    uncontrolledFilterSelectComponent: provideProps(uncontrolledFilterSelectComponent, selectComponents)
                })
            };
        }
    };

    return builder;
}
