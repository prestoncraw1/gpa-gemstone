# react-forms

![gemstone logo](https://raw.githubusercontent.com/gemstone/web/master/docs/img/gemstone-wide-600.png)

The Gemstone Web Library organizes all Gemstone functionality related to web.

[![GitHub license](https://img.shields.io/github/license/gemstone/web?color=4CC61E)](https://github.com/gemstone/web/blob/master/LICENSE)

This library includes helpful npm package for creating strongly typed form components in react.

* Input
* CheckBox
* TextArea
* DatePicker
* Select
* EnumCheckBoxes
* DateRangePicker
* ArrayCheckBoxes
* ArrayMultiSelect

## Usage

```ts
    interface iType = { Field1: string, Field2: number, Field3: boolean, Field4: string, Field5: string, EnumField: number, FromField: string, ToField: string}
    let record:iType = {Field1: 'Hello', Field2: 1, Field3: false, Field4: 'alot of text blah blah blah', Field5: '01/01/2021', FromField: '01/01/2020', ToField: '01/01/2021'}
    let options = [{Value: 1, Label: 'first'}, {Value:2, Label: 'second'}]

    <Input<iType> Record={record} Field="Field1" Setter={(event) => record.Field1 = event.target.value} Valid={(field) => /*some criteria*/}>
    <CheckBox<iType> Record={record} Field="Field3" Setter={(event) => record.Field3 = event.target.value}}>
    <Select<iType> Record={record} Field="Field2" Setter={(event) => record.Field3 = event.target.value}} Options={options}>
    <TextArea<iType> Record={record} Field="Field4" Setter={(event) => record.Field1 = event.target.value} Valid={(field) => /*some criteria*/}>
    <DatePicker<iType> Record={record} Field="Field5" Setter={(event) => record.Field1 = event.target.value}>
    <DateRangePicker<iType> Record={record} FromField="FromField" ToField="ToField" Label="Date Range" Setter={(event) => record.Field1 = event.target.value}>
    <EnumCheckBoxes<iType> Record={record} Field="EnumField" Setter={(event) => record.Field3 = event.target.value}} Enum={['Monday', 'Tuesday','Wednesday']}>
```
