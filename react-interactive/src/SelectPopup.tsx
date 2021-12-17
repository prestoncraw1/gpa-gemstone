// ******************************************************************************************************
//  SelectDefault.tsx - Gbtc
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
//  12/17/2021 - Samuel Robinson
//       Generated original version of source code.
// ******************************************************************************************************

import Table, { Column } from "@gpa-gemstone/react-table";
import React = require("react");
import { useDispatch, useSelector } from "react-redux";
import GenericSlice from "./GenericSlice";
import { Search } from "./SearchBar";
import Modal from "./Modal";
import { SearchBar } from ".";
import _ = require("lodash");
import { CrossMark } from "@gpa-gemstone/gpa-symbols";

interface U { ID: number|string }

interface ISearchbarProps<T> {
    CollumnList: Search.IField<T>[],
    defaultCollumn?: Search.IField<T>,
    Label?: string,
    GetEnum?: EnumSetter<T>,
    ResultNote?: string,
}

interface IProps<T extends U> {
    Slice: GenericSlice<T>,
    Selection: T[],
    OnClose: (selected: T[], conf: boolean ) => void
    Show: boolean,
    Searchbar: ISearchbarProps<T>,
    Type?: 'single'|'multiple',
    Columns: Column<T>[],
    Title: string,
    MinSelection?: number
}

interface IOptions {Value: string, Label: string}
type EnumSetter<T> = (setOptions: (options: IOptions[]) => void, field: Search.IField<T>) => () => void

export default function SelectPopup<T extends U>(props: IProps<T>) {
    const dispatch = useDispatch();
    const sortField = useSelector(props.Slice.SortField) as keyof T;
    const ascending = useSelector(props.Slice.Ascending);
    const data: T[] = useSelector(props.Slice.SearchResults);
    const searchStatus = useSelector(props.Slice.SearchStatus);

    const [selectedData, setSelectedData] = React.useState<T[]>(props.Selection);

    const [sortKeySelected, setSortKeySelected] = React.useState<string>('');
    const [ascendingSelected, setAscendingSelected] = React.useState<boolean>(false);

    React.useEffect (() => {
        setSelectedData(props.Selection);
    }, [props.Selection])

    function AddCurrentList() {
        let updatedData: any[];
        updatedData = (selectedData as any[]).concat(data);
        setSelectedData(_.uniqBy((updatedData as T[]), (d) => d.ID));
    }

    return (<>
        <Modal Show={props.Show} Title={props.Title} ShowX={true} Size={'xlg'} CallBack={(conf) => props.OnClose(selectedData, conf)} 
        DisableConfirm={props.MinSelection !== undefined && selectedData.length < props.MinSelection} 
        ConfirmShowToolTip={props.MinSelection !== undefined && selectedData.length < props.MinSelection}
        ConfirmToolTipContent={<p>{CrossMark} Atleast {props.MinSelection} items must be selected. </p>}
        >
            <div className="row">
                <div className="col">
                    <SearchBar<T> {...props.Searchbar} 
                    SetFilter={(flds) => dispatch(props.Slice.DBSearch({ filter: flds, sortField, ascending }))}
                    Width={'50%'}
                    Label={'Search'}
                    ShowLoading={searchStatus === 'loading'}
                    >
                    <li className="nav-item" style={{ width: '20%', paddingRight: 10 }}>
                            <fieldset className="border" style={{ padding: '10px', height: '100%' }}>
                                <legend className="w-auto" style={{ fontSize: 'large' }}>Quick Selects:</legend>
                                <form>
                                    <div className="form-group">
                                        <div className="btn btn-primary" onClick={(event) => { event.preventDefault(); AddCurrentList(); }}>Add Current List to Selection</div>
                                    </div>
                                    <div className="form-group">
                                        <div className="btn btn-danger" onClick={(event) => { event.preventDefault(); setSelectedData([]) }}>Remove All</div>
                                    </div>
                                </form>
                            </fieldset>
                        </li>    
                    </SearchBar>
                </div>
            </div>
            <div className="row">
                <div className="col" style={{ width: (props.Type === undefined || props.Type === 'single' ? '100%' : '60%') } }>
                    <Table<T>
                        cols={props.Columns}
                        tableClass="table table-hover"
                        data={data}
                        sortKey={sortField as string}
                        ascending={ascending}
                        onSort={(d) => {
                            if (d.colKey === "Scroll")
                                return;

                            if (d.colKey === sortField)
                                dispatch(props.Slice.Sort({SortField: sortField, Ascending: ascending}));
                            else {
                                dispatch(props.Slice.Sort({SortField: d.colField as keyof T, Ascending: true}));
                            }
                        }}
                        onClick={(d) => setSelectedData([...selectedData.filter(item => item.ID !== d.row.ID), d.row])}
                        theadStyle={{ fontSize: 'smaller', display: 'table', tableLayout: 'fixed', width: '100%' }}
                        tbodyStyle={{ display: 'block', overflowY: 'scroll', maxHeight: '400px', width: '100%' }}
                        rowStyle={{ fontSize: 'smaller', display: 'table', tableLayout: 'fixed', width: '100%' }}
                        selected={props.Type === undefined || props.Type === 'single' ? (item) => selectedData.findIndex(d => d.ID === item.ID) > -1 : (item) => false}
                    />
                </div>
                {props.Type === 'multiple' ? <div className="col" style={{ width: '40%' }}>
                    <div style={{ width: '100%' }}>
                        <h3> Selected Assets </h3>
                    </div>
                    <Table
                        cols={props.Columns}
                        tableClass="table table-hover"
                        data={selectedData}
                        sortKey={sortKeySelected}
                        ascending={ascendingSelected}
                        onSort={(d) => {
                            if (d.colKey === sortKeySelected) {
                                const ordered = _.orderBy(selectedData, [d.colKey], [(!ascendingSelected ? "asc" : "desc")]);
                                setAscendingSelected(!ascendingSelected);
                                setSelectedData(ordered);
                            }
                            else {
                                const ordered = _.orderBy(selectedData, [d.colKey], ["asc"]);
                                setAscendingSelected(!ascendingSelected);
                                setSelectedData(ordered);
                                setSortKeySelected(d.colKey);
                            }
                        }}
                        onClick={() => true}
                        theadStyle={{ fontSize: 'smaller', display: 'table', tableLayout: 'fixed', width: '100%' }}
                        tbodyStyle={{ display: 'block', overflowY: 'scroll', maxHeight: '400px', width: '100%' }}
                        rowStyle={{ fontSize: 'smaller', display: 'table', tableLayout: 'fixed', width: '100%' }}
                        selected={(item) => false}
                    />
                </div> : null}
            </div>
        </Modal>
        </>)

}