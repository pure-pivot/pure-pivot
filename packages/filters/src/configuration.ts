import * as React from 'react';
import { provideProps } from '@pure-pivot/core/lib/es6/util/provide-props';
import { BooleanInputProps, BooleanInput } from './operator-components/boolean/boolean-input';
import { UncontrolledFiltersSelectProps, UncontrolledFiltersSelectProvidedProps, UncontrolledFiltersSelect } from './uncontrolled-filters-select';
import { ControlledFiltersSelectProps, ControlledFiltersSelect, ControlledFiltersSelectProvidedProps } from './controlled-filters-select';
import { DateInputProps, DateInput } from './operator-components/date/date-input';
import { NumberInputProps, NumberInput } from './operator-components/number/number-input';
import { StringInputProps, StringInput } from './operator-components/string/string-input';
import { FiltersContainerComponent } from './filters-container-component';
import { FiltersItemComponent, FiltersItemComponentProps } from './filters-item-component';
import { ControlledFilterSelect, ControlledFilterSelectProps } from './controlled-filter-select';
import { UncontrolledFilterSelectProps, UncontrolledFilterSelect } from './uncontrolled-filter-select';
import { OperatorBooleanSelect, OperatorBooleanSelectProps } from './operator-components/boolean/operator-boolean-select';
import { OperatorDateSelect, OperatorDateSelectProps } from './operator-components/date/operator-date-select';
import { OperatorNumberSelect, OperatorNumberSelectProps } from './operator-components/number/operator-number-select';
import { OperatorStringSelect, OperatorStringSelectProps } from './operator-components/string/operator-string-select';
import { AddFilterButton, AddFilterButtonProps } from './button-components/add-filter';
import { RemoveFilterButton, RemoveFilterButtonProps } from './button-components/remove-filter';
import { RemoveAllButton, RemoveAllButtonProps } from './button-components/remove-all';

export interface Configuration<D, C> {
    uncontrolledFiltersSelectComponent: React.ComponentType<Pick<UncontrolledFiltersSelectProps<D, C>, Exclude<keyof UncontrolledFiltersSelectProps<D, C>, UncontrolledFiltersSelectProvidedProps>>>;
    controlledFiltersSelectComponent: React.ComponentType<Pick<ControlledFiltersSelectProps<D, C>, Exclude<keyof ControlledFiltersSelectProps<D, C>, ControlledFiltersSelectProvidedProps>>>;
}

export interface ConfigurationBuilder<D, C> {
    controlledFilterSelectComponent: React.ComponentType<ControlledFilterSelectProps<D, C>>;
    controlledFiltersSelectComponent: React.ComponentType<ControlledFiltersSelectProps<D, C>>;
    uncontrolledFilterSelectComponent: React.ComponentType<UncontrolledFilterSelectProps<D, C>>;
    uncontrolledFiltersSelectComponent: React.ComponentType<UncontrolledFiltersSelectProps<D, C>>;
    filtersContainerComponent: React.ComponentType<{}>;
    filtersItemComponent: React.ComponentType<FiltersItemComponentProps>;
    booleanInputComponent: React.ComponentType<BooleanInputProps<C>>;
    dateInputComponent: React.ComponentType<DateInputProps<C>>;
    numberInputComponent: React.ComponentType<NumberInputProps<C>>;
    stringInputComponent: React.ComponentType<StringInputProps<C>>;
    booleanSelectComponent: React.ComponentType<OperatorBooleanSelectProps<C>>;
    dateSelectComponent: React.ComponentType<OperatorDateSelectProps<C>>;
    numberSelectComponent: React.ComponentType<OperatorNumberSelectProps<C>>;
    stringSelectComponent: React.ComponentType<OperatorStringSelectProps<C>>;
    addFilterButtonComponent: React.ComponentType<AddFilterButtonProps>;
    removeFilterButtonComponent: React.ComponentType<RemoveFilterButtonProps>;
    removeAllButtonComponent: React.ComponentType<RemoveAllButtonProps>;
    withControlledFilterSelectComponent(controlledFilterSelectComponent: React.ComponentType<ControlledFilterSelectProps<D, C>>): this;
    withControlledFiltersSelectComponent(controlledFiltersSelectComponent: React.ComponentType<ControlledFiltersSelectProps<D, C>>): this;
    withUncontrolledFilterSelectComponent(uncontrolledFilterSelectComponent: React.ComponentType<UncontrolledFilterSelectProps<D, C>>): this;
    withUncontrolledFiltersSelectComponent(uncontrolledFiltersSelectComponent: React.ComponentType<UncontrolledFiltersSelectProps<D, C>>): this;
    withFiltersContainerComponent(filtersContainerComponent: React.ComponentType<{}>): this;
    withFiltersItemComponent(filtersItemComponent: React.ComponentType<FiltersItemComponentProps>): this;
    withBooleanInputComponent(booleanInputComponent: React.ComponentType<BooleanInputProps<C>>): this;
    withDateInputComponent(dateInputComponent: React.ComponentType<DateInputProps<C>>): this;
    withNumberInputComponent(numberInputComponent: React.ComponentType<NumberInputProps<C>>): this;
    withStringInputComponent(stringInputComponent: React.ComponentType<StringInputProps<C>>): this;
    withAddFilterButtonComponent(addFilterButtonComponent: React.ComponentType<AddFilterButtonProps>): this;
    withRemoveFilterButtonComponent(removeFilterButtonComponent: React.ComponentType<RemoveFilterButtonProps>): this;
    withRemoveAllButtonComponent(removeAllButtonComponent: React.ComponentType<RemoveAllButtonProps>): this;
    build(): Configuration<D, C>;
}

export function configurationBuilder<D, C>(): ConfigurationBuilder<D, C> {
    const builder: ConfigurationBuilder<D, C> = {
        controlledFilterSelectComponent: ControlledFilterSelect,
        controlledFiltersSelectComponent: ControlledFiltersSelect,
        uncontrolledFilterSelectComponent: UncontrolledFilterSelect,
        uncontrolledFiltersSelectComponent: UncontrolledFiltersSelect,
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
        withControlledFilterSelectComponent(controlledFilterSelectComponent: React.ComponentType<ControlledFilterSelectProps<D, C>>) {
            builder.controlledFilterSelectComponent = controlledFilterSelectComponent;
            return this;
        },
        withControlledFiltersSelectComponent(controlledFiltersSelectComponent: React.ComponentType<ControlledFiltersSelectProps<D, C>>) {
            builder.controlledFiltersSelectComponent = controlledFiltersSelectComponent;
            return this;
        },
        withUncontrolledFilterSelectComponent(uncontrolledFilterSelectComponent: React.ComponentType<UncontrolledFilterSelectProps<D, C>>) {
            builder.uncontrolledFilterSelectComponent = uncontrolledFilterSelectComponent;
            return this;
        },
        withUncontrolledFiltersSelectComponent(uncontrolledFiltersSelectComponent: React.ComponentType<UncontrolledFiltersSelectProps<D, C>>) {
            builder.uncontrolledFiltersSelectComponent = uncontrolledFiltersSelectComponent;
            return this;
        },
        withFiltersContainerComponent(filtersContainerComponent: React.ComponentType<{}>) {
            builder.filtersContainerComponent = filtersContainerComponent;
            return this;
        },
        withFiltersItemComponent(filtersItemComponent: React.ComponentType<FiltersItemComponentProps>) {
            builder.filtersItemComponent = filtersItemComponent;
            return this;
        },
        withBooleanInputComponent(booleanInputComponent: React.ComponentType<BooleanInputProps<C>>) {
            builder.booleanInputComponent = booleanInputComponent;
            return this;
        },
        withDateInputComponent(dateInputComponent: React.ComponentType<DateInputProps<C>>) {
            builder.dateInputComponent = dateInputComponent;
            return this;
        },
        withNumberInputComponent(numberInputComponent: React.ComponentType<NumberInputProps<C>>) {
            builder.numberInputComponent = numberInputComponent;
            return this;
        },
        withStringInputComponent(stringInputComponent: React.ComponentType<StringInputProps<C>>) {
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
                controlledFiltersSelectComponent: provideProps(builder.controlledFiltersSelectComponent, {
                    filtersContainerComponent: builder.filtersContainerComponent,
                    filtersItemComponent: provideProps(builder.filtersItemComponent, {
                        removeFilterButtonComponent: builder.removeFilterButtonComponent
                    }),
                    addFilterButtonComponent: builder.addFilterButtonComponent,
                    removeAllButtonComponent: builder.removeAllButtonComponent,
                    controlledFilterSelectComponent: provideProps(builder.controlledFilterSelectComponent, selectComponents)
                }),
                uncontrolledFiltersSelectComponent: provideProps(builder.uncontrolledFiltersSelectComponent, {
                    filtersContainerComponent: builder.filtersContainerComponent,
                    filtersItemComponent: provideProps(builder.filtersItemComponent, {
                        removeFilterButtonComponent: builder.removeFilterButtonComponent
                    }),
                    addFilterButtonComponent: builder.addFilterButtonComponent,
                    removeAllButtonComponent: builder.removeAllButtonComponent,
                    uncontrolledFilterSelectComponent: provideProps(builder.uncontrolledFilterSelectComponent, selectComponents)
                })
            };
        }
    };

    return builder;
}
