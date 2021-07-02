//  ******************************************************************************************************
//  Table.tsx - Gbtc
//
//  Copyright © 2018, Grid Protection Alliance.  All Rights Reserved.
//
//  Licensed to the Grid Protection Alliance (GPA) under one or more contributor license agreements. See
//  the NOTICE file distributed with this work for additional information regarding copyright ownership.
//  The GPA licenses this file to you under the MIT License (MIT), the "License"; you may not use this
//  file except in compliance with the License. You may obtain a copy of the License at:
//
//      http://opensource.org/licenses/MIT
//
//  Unless agreed to in writing, the subject software distributed under the License is distributed on an
//  "AS-IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. Refer to the
//  License for the specific language governing permissions and limitations.
//
//  Code Modification History:
//  ----------------------------------------------------------------------------------------------------
//  08/02/2018 - Billy Ernest
//       Generated original version of source code.
//
//  ******************************************************************************************************

import * as React from 'react';
import {CreateGuid} from '@gpa-gemstone/helper-functions';


interface Column<T> {
  key: (keyof T|null);
  label: string;
  headerStyle?: React.CSSProperties;
  rowStyle?: React.CSSProperties;
  content?(item: T, key: keyof T|null, style: React.CSSProperties, index: number): React.ReactNode;
}
export interface TableProps<T> {
  cols: Column<T>[];
  data: T[];
  onClick: (data: { col: keyof T|null; row: T; data: T[keyof T]|null, index: number }, event: any) => void;
  sortField: (keyof T|null);
  ascending: boolean;
  onSort(data: { col: keyof T|null; ascending: boolean }): void;
  tableClass?: string;
  tableStyle?: React.CSSProperties;
  theadStyle?: React.CSSProperties;
  theadClass?: string;
  tbodyStyle?: React.CSSProperties;
  tbodyClass?: string;
  selected?(data: T): boolean;
  rowStyle?: React.CSSProperties;
}

export default function Table<T> (props: TableProps<T>){
    return (
      <table className={props.tableClass !== undefined ? props.tableClass : ''} style={props.tableStyle}>
          <Header<T> Class={props.theadClass} Style={props.theadStyle} Cols={props.cols} SortField={props.sortField} Ascending={props.ascending} Click={(d,e) => handleSort(d,e)}/>
          <Rows<T> Data={props.data} Cols={props.cols} RowStyle={props.rowStyle} BodyStyle={props.tbodyStyle} BodyClass={props.tbodyClass} Click={(data,e) => props.onClick(data, e)} Selected={props.selected}/>
      </table>
    );

  function handleSort(
    data: { col: keyof T|null; ascending: boolean },
    event: React.MouseEvent<HTMLTableHeaderCellElement, MouseEvent>,
  ) {
    if (data.col !== null)
      props.onSort(data);
  }
}

function Rows<T>(props: {
  Data: T[], 
  Cols:Column<T>[], 
  RowStyle: React.CSSProperties | undefined, 
  BodyStyle: React.CSSProperties | undefined,
  BodyClass: string | undefined,
  Click :( data: { col: keyof T|null, row: T, data: T[keyof T] | null, index: number },e : React.MouseEvent<HTMLTableHeaderCellElement, MouseEvent>) => void,
  Selected: ((data: T) => boolean) | undefined,
})
{
  if (props.Data.length === 0) return null;
  const rows = props.Data.map((item, rowIndex) => {
    const cells = props.Cols.map((colData, colIndex) => {
      return <Cell<T> key={CreateGuid()} Style={colData.rowStyle} DataKey={colData.key} Object={item} RowIndex={rowIndex} Content={colData.content} Click={(data,e) => props.Click(data,e)}/>
    });

    const style: React.CSSProperties = (props.RowStyle !== undefined) ? { ...props.RowStyle } : {};

      if (style.cursor === undefined)
        style.cursor = 'pointer';

      if (props.Selected !== undefined && props.Selected(item))
        style.backgroundColor = 'yellow';

    return (
      <tr style={props.RowStyle} key={CreateGuid()}>
        {cells}
      </tr>
    );


  });

  return (
    <tbody style={props.BodyStyle} className={props.BodyClass}>{rows}</tbody>
  );

}


function Cell<T>(props: {
  Style: React.CSSProperties | undefined, 
  DataKey: keyof T | null, 
  Object: T, 
  RowIndex: number,  
  Content: ((item: T, key: keyof T|null, style: React.CSSProperties, index: number) => React.ReactNode) | undefined ,
  Click :( data: { col: keyof T|null, row: T, data: T[keyof T] | null, index: number },e: React.MouseEvent<HTMLTableHeaderCellElement, MouseEvent>) => void
}){
  const css: React.CSSProperties = (props.Style !== undefined)  ? { ...props.Style } : {};

  const getFieldValue = () => props.DataKey !== null ? props.Object[props.DataKey] : null;

  const getFieldContent = () => props.Content !== undefined  ?  props.Content(props.Object, props.DataKey, css, props.RowIndex) : getFieldValue();

return (
  <td
    style={css}
    onClick={(e) => props.Click({col: props.DataKey, row: props.Object, data: getFieldValue(), index: props.RowIndex }, e)}
  >
    {getFieldContent()}
  </td>
);
}


function Header<T>(props: {
  Class: string | undefined,
  Style: React.CSSProperties | undefined,
  Cols: Column<T>[], 
  SortField: keyof T | null, 
  Ascending: boolean, 

  Click: (data: { col: keyof T|null; ascending: boolean }, event: React.MouseEvent<HTMLTableHeaderCellElement, MouseEvent>) => void
}){

  return (<thead className={props.Class} style={props.Style}><tr>{props.Cols.map((col,index) => <HeaderCell<T> key={index} HeaderStyle={col.headerStyle} DataKey={col.key} Click={(e) => props.Click({col: col.key, ascending: props.Ascending},e)} Label={col.label} SortField={props.SortField} Ascending={props.Ascending} />)}</tr></thead>)

}
function HeaderCell<T> (props: {HeaderStyle: React.CSSProperties | undefined, DataKey: keyof T | null, Click: (e: any) => void, Label: string, SortField: keyof T | null, Ascending: boolean}){
  const style: React.CSSProperties = (props.HeaderStyle !== undefined) ? props.HeaderStyle : {};

  if (style.cursor === undefined && props.DataKey !== null){
    style.cursor = 'pointer';
  }

  if (style.position === undefined){
    style.position = 'relative';
  }

return (
  <th
    style={style}
    onClick={(e) => props.Click(e)}
  >
    
    <RenderAngleIcon<T> SortField={props.SortField} Key={props.DataKey} Ascending={props.Ascending} />
    <div style={{marginLeft: 10}}>{props.Label}</div>
  </th>
  );
}


function RenderAngleIcon<T>(props:{
  SortField: keyof T |null, 
  Key: keyof T | null, 
  Ascending: boolean
}) {

  const AngleIcon: React.FunctionComponent<{ ascending: boolean }> = () => (
    <div
      style={{ position: 'absolute', top: 10, transform: (props.Ascending ?'rotate(0deg)' : 'rotate(180deg)') }}>{ '^'}</div>
  );

  if (props.SortField === null)
    return null;

  if (props.SortField !== props.Key)
    return null;

  return <AngleIcon ascending={props.Ascending} />
};