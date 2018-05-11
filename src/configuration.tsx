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
import { FilterComponentProps, FilterComponent } from './filters/filter-components/filter-component';
import { AndFilterComponentProps, AndFilterComponent } from './filters/filter-components/and-filter-component';
import { NotFilterComponent, NotFilterComponentProps } from './filters/filter-components/not-filter-components';
import { EqualsFilterComponent, EqualsFilterComponentProps } from './filters/filter-components/equals-filter-component';
import { GroupByValueComponentProps, GroupByValueComponent, GroupByValueComponentProvidedProps } from './group-by/group-by-value-component';
import { GroupByValue, GroupByDescription, GroupBy } from './group-by/model';
import { GroupByComponentProps, GroupByComponent } from './group-by/group-by-components/group-by-component';
import { NumberEqualityComponent } from './group-by/group-by-components/number-equality-component';
import { StringEqualityComponent } from './group-by/group-by-components/string-equality-component';
import { BooleanEqualityComponent } from './group-by/group-by-components/boolean-equality-component';
import { NumberCountComponent } from './group-by/group-by-components/number-count-component';
import { NumberRangeComponent } from './group-by/group-by-components/number-range-component';
import { OtherEqualityComponent } from './group-by/group-by-components/other-equality-component';

export interface Configuration<D> {
    data: D[];
    fields: Fields<D>;
    filters: Filters<D>;
    groupBy: GroupByValue<D, keyof D>;
    formats: Formats<D>;
    fieldsComponent: React.ComponentType<Pick<FieldsComponentProps<D>, Exclude<keyof FieldsComponentProps<D>, FieldsComponentProvidedProps>>>;
    filtersComponent: React.ComponentType<Pick<FiltersComponentProps<D>, Exclude<keyof FiltersComponentProps<D>, FiltersComponentProvidedProps>>>;
    groupByValueComponent: React.ComponentType<Pick<GroupByValueComponentProps<D, keyof D>, Exclude<keyof GroupByValueComponentProps<D, keyof D>, GroupByValueComponentProvidedProps>>>;
}

export function providePropsComponentFactory<P, U>(Component: React.ComponentType<P>, providedProps: U): React.ComponentType<Pick<P, Exclude<keyof P, keyof U>>> {
    return (props: Pick<P, Exclude<keyof P, keyof U>>) => <Component {...providedProps} {...props} />;
}

export class ConfigurationBuilder<D> {
    private data: D[];
    private fields: Fields<D>;
    private filters: Filters<D>;
    private groupBy: GroupByValue<D, keyof D>;
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
    private groupByValueComponent: React.ComponentType<GroupByValueComponentProps<D, keyof D>>;

    constructor(data: { [Key in keyof D]: D[Key] }[]) {
        this.data = data;
        this.fields = inferFields(data);
        this.filters = [];
        this.groupBy = { type: 'identity' };
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
        this.groupByValueComponent = GroupByValueComponent;
    }

    withData(data: D[]) {
        this.data = data;
        return this;
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

    withGroupByField(groupByDescription: Pick<GroupByDescription<D, keyof D>, Exclude<keyof GroupByDescription<D, keyof D>, 'type'>>) {
        const typeDescription: { type: 'description' } = { type: 'description' };
        this.groupBy = Object.assign({}, groupByDescription, typeDescription);
        return this;
    }

    withGroupByValueComponent(groupByValueComponent: React.ComponentType<GroupByValueComponentProps<D, keyof D>>) {
        this.groupByValueComponent = groupByValueComponent;
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
                    booleanEqualityComponent: BooleanEqualityComponent,
                    numberEqualityComponent: NumberEqualityComponent,
                    numberCountComponent: NumberCountComponent,
                    numberRangeComponent: NumberRangeComponent,
                    stringEqualityComponent: StringEqualityComponent,
                    otherEqualityComponent: OtherEqualityComponent
                })
            })
        };
    }
}
