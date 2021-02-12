# react-table

![gemstone logo](https://raw.githubusercontent.com/gemstone/web/master/docs/img/gemstone-wide-600.png)

The Gemstone Web Library organizes all Gemstone functionality related to web.

[![GitHub license](https://img.shields.io/github/license/gemstone/web?color=4CC61E)](https://github.com/gemstone/web/blob/master/LICENSE)

This library includes helpful npm package component for creating strongly typed tables in react.

## Usage Table

```ts
    interface iType = { Field1: string, Field2: number, Field3: boolean, Field4: string, Field5: string}
    let records:iType[] = [{Field1: 'Hello', Field2: 1, Field3: false, Field4: 'alot of text blah blah blah', Field5: '01/01/2021'}]
    let ascending: boolean = true;

    <Table<iType>
    cols={[
        { key: 'Field1', label: 'Field1' },
        { key: 'Field2', label: 'Field2', content: (item, key, style) => item[key] },
        { key: 'Field3', label: 'Field3' },
        { key: 'Field4', label: 'Field4' },
        { key: 'Field5', label: 'Field5' },
    ]}
    tableClass="table table-hover"
    theadStyle={{ fontSize: 'smaller', display: 'table', tableLayout: 'fixed', width: '100%', height: 50 }}
    tbodyStyle={{ display: 'block', overflowY: 'scroll', width: '100%' }}
    rowStyle={{ fontSize: 'smaller', display: 'table', tableLayout: 'fixed', width: '100%' }}
    sortField={''}
    onClick={() => { }}
    onSort={() => { }}
    data={records}
    ascending={ascending}
        />

```

## Usage SelectTable

```ts
    interface iType = { Field1: string, Field2: number, Field3: boolean, Field4: string, Field5: string}
    let records:iType[] = [{Field1: 'Hello', Field2: 1, Field3: false, Field4: 'alot of text blah blah blah', Field5: '01/01/2021'}]
    let ascending: boolean = true;
	let selectedItems: iType[] = [];
	
    <SelectTable<iType>
    cols={[
        { key: 'Field1', label: 'Field1' },
        { key: 'Field2', label: 'Field2', content: (item, key, style) => item[key] },
        { key: 'Field3', label: 'Field3' },
        { key: 'Field4', label: 'Field4' },
        { key: 'Field5', label: 'Field5' },
    ]}
    tableClass="table table-hover"
    theadStyle={{ fontSize: 'smaller', display: 'table', tableLayout: 'fixed', width: '100%', height: 50 }}
    tbodyStyle={{ display: 'block', overflowY: 'scroll', width: '100%' }}
    rowStyle={{ fontSize: 'smaller', display: 'table', tableLayout: 'fixed', width: '100%' }}
	KeyField={'Field1'}
    data={records}
	onSelection={(d) => {selectedItems = d}}
        />

```

