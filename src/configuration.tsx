import * as React from 'react';
import { Field, Fields } from './fields/model';
import { FieldsComponentProps, FieldsComponent, FieldsComponentProvidedProps } from './fields/fields-component';
import { FieldComponentProps, FieldComponent } from './fields/field-component';
import { inferFields } from './fields/infer-fields';
import { Filters, FilterDescription } from './filters/model';
import { FiltersComponentProps, FiltersComponent, FiltersComponentProvidedProps } from './filters/filters-component';
import { Formats, Format } from './formats/model';
import { inferFormats } from './formats/infer-formats';
import { FilterDescriptionComponentProps, FilterDescriptionComponent } from './filters/filter-description-component';
import { FilterComponentProps, FilterComponent } from './filters/components/filter-component';
import { AndFilterComponentProps, AndFilterComponent } from './filters/components/and-filter-component';
import { NotFilterComponent, NotFilterComponentProps } from './filters/components/not-filter-components';
import { EqualsFilterComponent, EqualsFilterComponentProps } from './filters/components/equals-filter-component';
import { GroupByValueComponentProps, GroupByValueComponent, GroupByValueComponentProvidedProps } from './group-by/group-by-value-component';
import { GroupByValue, GroupByDescription, GroupBy } from './group-by/model';
import { GroupByComponentProps, GroupByComponent } from './group-by/components/group-by-component';
import { NumberEqualityComponent, NumberEqualityComponentProps } from './group-by/components/number-equality-component';
import { StringEqualityComponent, StringEqualityComponentProps } from './group-by/components/string-equality-component';
import { BooleanEqualityComponent, BooleanEqualityComponentProps } from './group-by/components/boolean-equality-component';
import { NumberCountComponent, NumberCountComponentProps } from './group-by/components/number-count-component';
import { NumberRangeComponent, NumberRangeComponentProps } from './group-by/components/number-range-component';
import { OtherEqualityComponent, OtherEqualityComponentProps } from './group-by/components/other-equality-component';
import { Values, Value, ValueDescription } from './values/model';
import { ValuesComponentProps, ValuesComponentProvidedProps, ValuesComponent } from './values/values-component';
import { ValueComponentProps, ValueComponent } from './values/value-component';
import { AnyValueComponentProps, AnyValueComponent } from './values/components/any-value-component';
import { StringValueComponentProps, StringValueComponent } from './values/components/string-value-component';
import { BooleanValueComponentProps, BooleanValueComponent } from './values/components/boolean-value-component';
import { NumberValueComponentProps, NumberValueComponent } from './values/components/number-value-component';
import { OtherValueComponentProps, OtherValueComponent } from './values/components/other-value-component';
import { inferValues } from './values/infer-values';
import { TableProps, TableProvidedProps, Table } from './table/table';

export interface Configuration<D> {
    data: D[];
    fields: Fields<D>;
    filters: Filters<D>;
    groupBy: GroupByValue<D, keyof D>;
    values: Values<D>;
    formats: Formats<D>;
    fieldsComponent: React.ComponentType<Pick<FieldsComponentProps<D>, Exclude<keyof FieldsComponentProps<D>, FieldsComponentProvidedProps>>>;
    filtersComponent: React.ComponentType<Pick<FiltersComponentProps<D>, Exclude<keyof FiltersComponentProps<D>, FiltersComponentProvidedProps>>>;
    groupByValueComponent: React.ComponentType<Pick<GroupByValueComponentProps<D, keyof D>, Exclude<keyof GroupByValueComponentProps<D, keyof D>, GroupByValueComponentProvidedProps>>>;
    valuesComponent: React.ComponentType<Pick<ValuesComponentProps<D>, Exclude<keyof ValuesComponentProps<D>, ValuesComponentProvidedProps>>>;
    tableComponent: React.ComponentType<Pick<TableProps<D>, Exclude<keyof TableProps<D>, TableProvidedProps>>>;
}

export function providePropsComponentFactory<P, U>(Component: React.ComponentType<P>, providedProps: U): React.ComponentType<Pick<P, Exclude<keyof P, keyof U>>> {
    return (props: Pick<P, Exclude<keyof P, keyof U>>) => <Component {...providedProps} {...props} />;
}

export class ConfigurationBuilder<D> {
    private data: D[];
    private fields: Fields<D>;
    private filters: Filters<D>;
    private groupBy: GroupByValue<D, keyof D>;
    private values: Values<D>;
    private formats: Formats<D>;
    private fieldComponent: React.ComponentType<FieldComponentProps<D[keyof D]>>;
    private fieldsComponent: React.ComponentType<FieldsComponentProps<D>>;
    private filterComponent: React.ComponentType<FilterComponentProps<D[keyof D]>>;
    private andFilterComponent: React.ComponentType<AndFilterComponentProps<D[keyof D]>>;
    private notFilterComponent: React.ComponentType<NotFilterComponentProps<D[keyof D]>>;
    private equalsFilterComponent: React.ComponentType<EqualsFilterComponentProps<D[keyof D]>>;
    private filterDescriptionComponent: React.ComponentType<FilterDescriptionComponentProps<D, keyof D>>;
    private filtersComponent: React.ComponentType<FiltersComponentProps<D>>;
    private groupByComponent: React.ComponentType<GroupByComponentProps<D[keyof D]>>;
    private booleanEqualityComponent: React.ComponentType<BooleanEqualityComponentProps>;
    private numberEqualityComponent: React.ComponentType<NumberEqualityComponentProps>;
    private numberCountComponent: React.ComponentType<NumberCountComponentProps>;
    private numberRangeComponent: React.ComponentType<NumberRangeComponentProps>;
    private stringEqualityComponent: React.ComponentType<StringEqualityComponentProps>;
    private otherEqualityComponent: React.ComponentType<OtherEqualityComponentProps<D[keyof D]>>;
    private groupByValueComponent: React.ComponentType<GroupByValueComponentProps<D, keyof D>>;
    private anyValueComponent: React.ComponentType<AnyValueComponentProps>;
    private booleanValueComponent: React.ComponentType<BooleanValueComponentProps>;
    private numberValueComponent: React.ComponentType<NumberValueComponentProps>;
    private otherValueComponent: React.ComponentType<OtherValueComponentProps<D[keyof D]>>;
    private stringValueComponent: React.ComponentType<StringValueComponentProps>;
    private valueComponent: React.ComponentType<ValueComponentProps<D, keyof D>>;
    private valuesComponent: React.ComponentType<ValuesComponentProps<D>>;
    private tableComponent: React.ComponentType<TableProps<D>>;

    constructor(data: D[]) {
        this.data = data;
        this.fields = inferFields(data);
        this.filters = [];
        this.groupBy = { type: 'identity' };
        this.values = inferValues(this.fields);
        this.formats = inferFormats(this.fields);
        this.fieldComponent = FieldComponent;
        this.fieldsComponent = FieldsComponent;
        this.filterComponent = FilterComponent;
        this.andFilterComponent = AndFilterComponent;
        this.notFilterComponent = NotFilterComponent;
        this.equalsFilterComponent = EqualsFilterComponent;
        this.filterDescriptionComponent = FilterDescriptionComponent;
        this.filtersComponent = FiltersComponent;
        this.groupByComponent = GroupByComponent;
        this.booleanEqualityComponent = BooleanEqualityComponent;
        this.numberEqualityComponent = NumberEqualityComponent;
        this.numberCountComponent = NumberCountComponent;
        this.numberRangeComponent = NumberRangeComponent;
        this.stringEqualityComponent = StringEqualityComponent;
        this.otherEqualityComponent = OtherEqualityComponent;
        this.groupByValueComponent = GroupByValueComponent;
        this.anyValueComponent = AnyValueComponent;
        this.booleanValueComponent = BooleanValueComponent;
        this.numberValueComponent = NumberValueComponent;
        this.otherValueComponent = OtherValueComponent;
        this.stringValueComponent = StringValueComponent;
        this.valueComponent = ValueComponent;
        this.valuesComponent = ValuesComponent;
        this.tableComponent = Table;
    }

    withField<F extends keyof D>(name: F, field: Fields<D>[F]) {
        this.fields = Object.assign({}, this.fields, { [name]: field });
        return this;
    }

    withFields(fields: { [Key in keyof D]: Field<D[Key]> }) {
        this.fields = fields;
        return this;
    }

    withFieldComponent(fieldComponent: React.ComponentType<FieldComponentProps<D[keyof D]>>) {
        this.fieldComponent = fieldComponent;
        return this;
    }

    withFieldsComponent(fieldsComponent: React.ComponentType<FieldsComponentProps<D>>) {
        this.fieldsComponent = fieldsComponent;
        return this;
    }

    withFilters(filters: Filters<D>) {
        this.filters = filters;
        return this;
    }

    withFilter<F extends keyof D>(filter: FilterDescription<D, F>) {
        this.filters = [...this.filters, filter];
        return this;
    }

    withFilterComponent(filterComponent: React.ComponentType<FilterComponentProps<D[keyof D]>>) {
        this.filterComponent = filterComponent;
        return this;
    }

    withAndFilterComponent(andFilterComponent: React.ComponentType<AndFilterComponentProps<D[keyof D]>>) {
        this.andFilterComponent = andFilterComponent;
        return this;
    }

    withFilterDescriptionComponent(filterDescriptionComponent: React.ComponentType<FilterDescriptionComponentProps<D, keyof D>>) {
        this.filterDescriptionComponent = filterDescriptionComponent;
        return this;
    }

    withFiltersComponent(filtersComponent: React.ComponentType<FiltersComponentProps<D>>) {
        this.filtersComponent = filtersComponent;
        return this;
    }

    withGroupByIdentity() {
        this.groupBy = { type: 'identity' };
        return this;
    }

    withGroupByField<F extends keyof D>(name: F, groupBy: GroupBy<D[F]>) {
        // TypeScript is not helping here, force cast
        this.groupBy = {
            type: 'description',
            name,
            groupBy
        } as any as GroupByValue<D, keyof D>;
        return this;
    }

    withBooleanEqualityComponent(booleanEqualityComponent: React.ComponentType<BooleanEqualityComponentProps>) {
        this.booleanEqualityComponent = booleanEqualityComponent;
        return this;
    }

    withNumberEqualityComponent(numberEqualityComponent: React.ComponentType<NumberEqualityComponentProps>) {
        this.numberEqualityComponent = numberEqualityComponent;
        return this;
    }

    withNumberCountComponent(numberCountComponent: React.ComponentType<NumberCountComponentProps>) {
        this.numberCountComponent = numberCountComponent;
        return this;
    }

    withNumberRangeComponent(numberRangeComponent: React.ComponentType<NumberRangeComponentProps>) {
        this.numberRangeComponent = numberRangeComponent;
        return this;
    }

    withStringEqualityComponent(stringEqualityComponent: React.ComponentType<StringEqualityComponentProps>) {
        this.stringEqualityComponent = stringEqualityComponent;
        return this;
    }

    withOtherEqualityComponent(otherEqualityComponent: React.ComponentType<OtherEqualityComponentProps<D[keyof D]>>) {
        this.otherEqualityComponent = otherEqualityComponent;
        return this;
    }

    withGroupByValueComponent(groupByValueComponent: React.ComponentType<GroupByValueComponentProps<D, keyof D>>) {
        this.groupByValueComponent = groupByValueComponent;
        return this;
    }

    withValues(values: Values<D>) {
        this.values = values;
        return this;
    }

    withValue<F extends keyof D>(value: ValueDescription<D, F>) {
        // TypeScript is not helping here, force cast
        this.values = [...this.values, value as any as ValueDescription<D, keyof D>];
        return this;
    }

    withAnyValueComponent(anyValueComponent: React.ComponentType<AnyValueComponentProps>) {
        this.anyValueComponent = anyValueComponent;
        return this;
    }

    withBooleanValueComponent(booleanValueComponent: React.ComponentType<BooleanValueComponentProps>) {
        this.booleanValueComponent = booleanValueComponent;
        return this;
    }

    withNumberValueComponent(numberValueComponent: React.ComponentType<NumberValueComponentProps>) {
        this.numberValueComponent = numberValueComponent;
        return this;
    }

    withOtherValueComponent(otherValueComponent: React.ComponentType<OtherValueComponentProps<D[keyof D]>>) {
        this.otherValueComponent = otherValueComponent;
        return this;
    }

    withStringValueComponent(stringValueComponent: React.ComponentType<StringValueComponentProps>) {
        this.stringValueComponent = stringValueComponent;
        return this;
    }

    withValueComponent(valueComponent: React.ComponentType<ValueComponentProps<D, keyof D>>) {
        this.valueComponent = valueComponent;
        return this;
    }

    withValuesComponent(valuesComponent: React.ComponentType<ValuesComponentProps<D>>) {
        this.valuesComponent = valuesComponent;
        return this;
    }

    withFormats(formats: Formats<D>) {
        this.formats = formats;
        return this;
    }

    withFormat<F extends keyof D>(name: F, format: Format<D[F]>) {
        this.formats = Object.assign({}, this.formats, { [name]: format });
        return this;
    }

    build(): Configuration<D> {
        const filterComponentProvidedProps: { [Key: string]: React.ComponentType<any> } = {
            andFilterComponent: this.andFilterComponent,
            notFilterComponent: this.notFilterComponent,
            equalsFilterComponent: this.equalsFilterComponent
        };

        const specificFilterComponentProvidedProps = {
            filterComponent: providePropsComponentFactory(this.filterComponent, filterComponentProvidedProps)
        };

        for (const key of Object.keys(filterComponentProvidedProps)) {
            filterComponentProvidedProps[key] = providePropsComponentFactory(filterComponentProvidedProps[key], specificFilterComponentProvidedProps);
        }

        return {
            data: this.data,
            fields: this.fields,
            filters: this.filters,
            groupBy: this.groupBy,
            values: this.values,
            formats: this.formats,
            fieldsComponent: providePropsComponentFactory(this.fieldsComponent, {
                fieldComponent: this.fieldComponent
            }),
            filtersComponent: providePropsComponentFactory(this.filtersComponent, {
                filterDescriptionComponent: providePropsComponentFactory(this.filterDescriptionComponent, {
                    filterComponent: specificFilterComponentProvidedProps.filterComponent
                })
            }),
            groupByValueComponent: providePropsComponentFactory(this.groupByValueComponent, {
                groupByComponent: providePropsComponentFactory(this.groupByComponent, {
                    booleanEqualityComponent: this.booleanEqualityComponent,
                    numberEqualityComponent: this.numberEqualityComponent,
                    numberCountComponent: this.numberCountComponent,
                    numberRangeComponent: this.numberRangeComponent,
                    stringEqualityComponent: this.stringEqualityComponent,
                    otherEqualityComponent: this.otherEqualityComponent
                })
            }),
            valuesComponent: providePropsComponentFactory(this.valuesComponent, {
                valueComponent: providePropsComponentFactory(this.valueComponent, {
                    anyValueComponent: this.anyValueComponent,
                    booleanValueComponent: this.booleanValueComponent,
                    numberValueComponent: this.numberValueComponent,
                    stringValueComponent: this.stringValueComponent,
                    otherValueComponent: this.otherValueComponent
                })
            }),
            tableComponent: this.tableComponent
        };
    }
}
