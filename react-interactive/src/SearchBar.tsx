// ******************************************************************************************************
//  SearchBar.tsx - Gbtc
//
//  Copyright © 2020, Grid Protection Alliance.  All Rights Reserved.
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
//  01/06/2020 - Christoph Lackner
//       Generated original version of source code.
// ******************************************************************************************************

import * as React from 'react';
import Modal from './Modal';
import { Select, CheckBox } from '@gpa-gemstone/react-forms';

interface IProps<T> {
    CollumnList: Array<Search.IField<T>>,
    SetFilter: (filters: Search.IFilter<T>[]) => void,
    defaultCollumn?: Search.IField<T>,
    Direction?: 'left' | 'right',
    Width?: string|number,
    Label?: string,
    children: React.ReactNode
  }

export namespace Search {
  export type FieldType = ('string' | 'number' | 'enum' | 'integer' | 'datetime' | 'boolean')
  export interface IField<T> { label: string, key: keyof T, type: FieldType, enum?: Map<number, string> }
  export type OperatorType = ('=' | '<>' | '>' | '<' | '>=' | '<=' | 'LIKE' | 'NOT LIKE' | 'IN' | 'NOT IN')
  export interface IFilter<T> { FieldName: keyof T, SearchText: string, Operator: Search.OperatorType, Type: Search.FieldType }
}

export default function SearchBar<T> (props: IProps<T>)  {
  const [hover, setHover] = React.useState<boolean>(false);
  const [show, setShow] = React.useState<boolean>(false);

  const [filters, setFilters] = React.useState<Search.IFilter<T>[]>([]);
  const [filter, setFilter] = React.useState<Search.IFilter<T>>({ FieldName: props.CollumnList[0].key, SearchText: '', Operator: 'LIKE', Type: props.CollumnList[0].type });

  const [search, setSearch] = React.useState<string>("");
  const [searchFilter, setSearchFilter] = React.useState<Search.IFilter<T>|null>(null);

  // Update SearchFilter if there are any Character and only do it every 500ms to avoid hammering the server while typing
  React.useEffect(() => {
      let handle: any = null;
      if (search.length > 0 && props.defaultCollumn !== undefined)
          handle = setTimeout(() => {
              if (props.defaultCollumn !== undefined) setSearchFilter({ FieldName: props.defaultCollumn.key, Operator: 'LIKE', Type: props.defaultCollumn.type, SearchText: ('*' + search + '*') });
          }, 500);
      else
          handle = setTimeout(() => {
              setSearchFilter(null)
          }, 500);

      return () => { if (handle != undefined) clearTimeout(handle); };
  }, [search]);

  React.useEffect(() => {
    if (searchFilter != null)
      props.SetFilter([...filters, searchFilter]);
    if (searchFilter == null && props.defaultCollumn == undefined)
      props.SetFilter(filters);
  }, [searchFilter])

  function deleteFilter(f: Search.IFilter<T>) {
      let index = filters.findIndex(fs => fs == f);
      let filts = [...filters];
      filts.splice(index, 1);
      setFilters(filts);
      setHover(false);
      if (props.defaultCollumn != undefined && searchFilter != undefined)
          props.SetFilter([...filts, searchFilter]);
      else
          props.SetFilter(filts);
  }

  function addFilter() {
      let oldFilters = [...filters];
      oldFilters.push(filter);
      setFilters(oldFilters);
      setFilter({ FieldName: props.CollumnList[0].key, SearchText: '', Operator: 'LIKE', Type: props.CollumnList[0].type });
      if (props.defaultCollumn != undefined && searchFilter != undefined)
          props.SetFilter([...oldFilters, searchFilter]);
      else
          props.SetFilter(oldFilters);
  }

  const content = (
    <>
    <form>
    <div className="row">
    {props.defaultCollumn != undefined ?
        <div className="col">
          <input className="form-control mr-sm-2" type="search" placeholder={"Search " + props.defaultCollumn.label} onChange={(event) => setSearch(event.target.value as string)} />
        </div> : null}
      <div style={{ position: 'relative', display: 'inline-block' }} className='col'>
          <button className="btn btn-primary" onClick={(evt) => { evt.preventDefault(); setShow(!show);}} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>Add Filter</button>
          <div style={{ width: window.innerWidth / 3, display: hover ? 'block' : 'none', position: 'absolute', backgroundColor: '#f1f1f1', boxShadow: '0px 8px 16px 0px rgba(0,0,0,0.2)', zIndex: 1, right: (props.Direction == 'right' ? 0 : undefined), left: (props.Direction == 'left' ? 0: undefined) }} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
              <table className='table'>
                  <thead>
                      <tr><th>Column</th><th>Operator</th><th>Search Text</th><th>Remove</th></tr>
                  </thead>
                  <tbody>
                      {filters.map((f, i) => <tr key={i}><td>{f.FieldName}</td><td>{f.Operator}</td><td>{f.SearchText}</td><td><button className="btn btn-sm" onClick={(e) => deleteFilter(f)}><span><i className="fa fa-trash"></i></span></button></td></tr>)}
                  </tbody>
              </table>
          </div>
      </div>
    </div>
    </form>
  </>)

  return (
      <div style={{ width: '100%' }}>
          <nav className="navbar navbar-expand-lg navbar-light bg-light">
              <div className="collapse navbar-collapse" style={{ width: '100%' }}>
                  <ul className="navbar-nav mr-auto" style={{ width: '100%' }}>
                      {props.Direction == 'right' ? props.children : null }
                      {props.Label != undefined?
                      <li className="nav-item" style={{ minWidth: (props.Width == undefined? '150px' : undefined), width: props.Width, paddingRight: 10 }}>
                        <fieldset className="border" style={{ padding: '10px', height: '100%' }}>
                        <legend className="w-auto" style={{ fontSize: 'large' }}>{props.Label}:</legend>
                        {content}
                        </fieldset>
                        </li>:
                        <li className="nav-item" style={{ minWidth: (props.Width == undefined? '150px' : undefined), width: props.Width, paddingRight: 10 }}>
                          {content}
                        </li>}
                      {props.Direction == 'left' ? props.children : null }
                  </ul>
              </div>
          </nav>

          <Modal Title={'Add Filter'} Show={show} CallBack={(conf: boolean) => { if (conf) addFilter(); setShow(false)}} ConfirmText={'Add'} CancelText={'Close'}>
            <Select<Search.IFilter<T>> Record={filter} Field='FieldName' Options={props.CollumnList.map(fl => ({ Value: fl.key as string, Label: fl.label }))} Setter={(record) => {
                let operator = "IN" as any;
                let column = props.CollumnList.find(fl => fl.key == record.FieldName);

                if (column != undefined && column.type == 'string')
                    operator = "LIKE";

                  setFilter((prevFilter) => ({ ...prevFilter, FieldName: record.FieldName, SearchText: '', Operator: operator, Type: (column != undefined ? column.type : 'string') }))
            }} Label='Column' />
            <FilterCreator Filter={filter} Field={props.CollumnList.find(fl => fl.key == filter.FieldName)} Setter={(record) => setFilter(record)} />
          </Modal>
      </div>
  );

}

interface IPropsFilterCreator<T> { Filter: Search.IFilter<T>, Setter: (filter: React.SetStateAction<Search.IFilter<T>>) => void, Field: Search.IField<T>|undefined }

function FilterCreator<T>(props: IPropsFilterCreator<T> ) {

    if (props.Field == undefined)
        return null;
    if (props.Field.type == "string") {
        return (
            <>
                <label>Column type is string. Wildcard (*) can be used with 'LIKE' and 'NOT LIKE'</label>
                <div className='row'>
                    <div className='col-4'>
                        <select className='form-control' value={props.Filter.Operator} onChange={(evt) => {
                            let value = evt.target.value as 'LIKE' | 'NOT LIKE' | '=';
                            props.Setter((prevState) => ({ ...prevState, Operator: value }));
                        }}>
                            <option value='LIKE'>LIKE</option>
                            <option value='NOT LIKE'>NOT LIKE</option>
                        </select>
                    </div>
                    <div className='col'>
                        <input className='form-control' value={props.Filter.SearchText} onChange={(evt) => {
                            let value = evt.target.value as string;
                            props.Setter((prevState) => ({ ...prevState, SearchText: value }));
                        }} />
                    </div>

                </div>
            </>
        );
    }
    else if (props.Field.type == "integer" || props.Field.type == "number" || props.Field.type == "datetime") {
        return (
            <>
                <label>Column type is {props.Field.type}.</label>
                <div className='row'>
                    <div className='col-4'>
                        <select className='form-control' value={props.Filter.Operator} onChange={(evt) => {
                            let value = evt.target.value as '=' | '<>' | '>' | '<' | '>=' | '<=';
                            props.Setter((prevState) => ({ ...prevState, Operator: value }));
                        }}>
                            <option value='='>=</option>
                            <option value='<>'>!=</option>
                            <option value='>'>{`>`}</option>
                            <option value='>='>{`>=`}</option>
                            <option value='<'>{`<`}</option>
                            <option value='>='>{`>=`}</option>
                        </select>
                    </div>
                    <div className='col'>
                        <input className='form-control' value={props.Filter.SearchText} onChange={(evt) => {
                            let value = evt.target.value as string;
                            props.Setter((prevState) => ({ ...prevState, SearchText: value }));
                        }} />
                    </div>

                </div>
            </>
        );
    }
    else if (props.Field.type == "boolean") {
        return <CheckBox Record={props.Filter} Field='SearchText' Setter={(filter: Search.IFilter<T>) => {
            props.Setter((prevFilter) => ({ ...prevFilter, Operator: '=', SearchText: filter.SearchText.toString() == 'true' ? '1' : '0' }))
        }} Label="Column type is boolean. Yes/On is checked." />
    }
    else {
        if (props.Field.enum == undefined)
          return null;
        let valueList: Array<{ID: number, Text: string }> = [];
        props.Field.enum.forEach((value, key) => valueList.push({ ID: key, Text: value }));
        return (
            <>
                <label>Column type is enumerable. Select from below.</label>
                <ul style={{ listStyle: 'none' }}>
                    <li ><div className="form-check">
                        <input type="checkbox" className="form-check-input" style={{ zIndex: 1 }} onChange={(evt) => {
                            if (evt.target.checked)
                                props.Setter(prevSetter => ({ ...prevSetter, SearchText: `(${valueList.map(x => x.Text).join(',')})` }));
                            else
                                props.Setter(prevSetter => ({ ...prevSetter, SearchText: '' }));
                        }} defaultValue='off' />
                        <label className="form-check-label" >Select All</label>

                    </div></li>
                    {valueList.map(vli => <li key={vli.ID} ><div className="form-check">
                        <input type="checkbox" className="form-check-input" style={{ zIndex: 1 }} onChange={(evt) => {
                            if (evt.target.checked) {
                                let list = props.Filter.SearchText.replace('(', '').replace(')', '').split(',');
                                list = list.filter(x => x != "")
                                list.push(vli.Text)
                                let text = `(${list.join(',')})`;
                                props.Setter(prevSetter => ({ ...prevSetter, SearchText: text }));
                            }
                            else {
                                let list = props.Filter.SearchText.replace('(', '').replace(')', '').split(',');
                                list = list.filter(x => x != "")
                                list = list.filter(x => x != vli.Text)
                                let text = `(${list.join(',')})`;
                                props.Setter(prevSetter => ({ ...prevSetter, SearchText: text }));
                            }

                        }} value={props.Filter.SearchText.indexOf(vli.Text) >= 0 ? 'on' : 'off'} checked={props.Filter.SearchText.indexOf(vli.Text) >= 0 ? true : false} />
                        <label className="form-check-label" >{vli.Text}</label>

                    </div></li>)}
                </ul>
            </>
        );
    }
}
