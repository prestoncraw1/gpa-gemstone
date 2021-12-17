// ******************************************************************************************************
//  SearchBarDefault.tsx - Gbtc
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

import * as React from 'react';
import GenericSlice from './GenericSlice';
import { Application, OpenXDA, SystemCenter } from '@gpa-gemstone/application-typings';
import { useDispatch, useSelector } from 'react-redux';
import  SearchBar, { Search }  from './SearchBar';

interface U { ID: number|string }

interface IProps<T extends U> {
    Slice: GenericSlice<T>,
    GetEnum: EnumSetter<T>,
    children: React.ReactNode,
}

interface IOptions {Value: string, Label: string}
type EnumSetter<T> = (setOptions: (options: IOptions[]) => void, field: Search.IField<T>) => () => void

export namespace DefaultSearch {

    export function Meter (props: IProps<SystemCenter.Types.DetailedMeter>) {

        const dispatch = useDispatch();
        const searchStatus = useSelector(props.Slice.SearchStatus)
        const sortField = useSelector(props.Slice.SortField)
        const ascending = useSelector(props.Slice.Ascending)
        const data: SystemCenter.Types.DetailedMeter[] = useSelector(props.Slice.SearchResults);

        const defaultSearchcols: Array<Search.IField<SystemCenter.Types.DetailedMeter>> = [
            { label: 'AssetKey', key: 'AssetKey', type: 'string', isPivotField: false },
            { label: 'Name', key: 'Name', type: 'string', isPivotField: false },
            { label: 'Location', key: 'Location', type: 'string', isPivotField: false },
            { label: 'Make', key: 'Make', type: 'string', isPivotField: false },
            { label: 'Model', key: 'Model', type: 'string', isPivotField: false },
            { label: 'Number of Assets', key: 'MappedAssets', type: 'number', isPivotField: false },
        ];
        const standardSearch: Search.IField<SystemCenter.Types.DetailedMeter> = { label: 'Name', key: 'Name', type: 'string', isPivotField: false };

        return <SearchBar<SystemCenter.Types.DetailedMeter>
            CollumnList={defaultSearchcols}
            SetFilter={(flds) => dispatch(props.Slice.DBSearch({ filter: flds, sortField, ascending }))}
            Direction={'left'}
            defaultCollumn={standardSearch}
            Width={'50%'}
            Label={'Search'}
            ShowLoading={searchStatus == 'loading'}
            ResultNote={searchStatus == 'error' ? 'Could not complete Search' : 'Found ' + data.length + ' Meters'}
            GetEnum={props.GetEnum}
        >
            {props.children}
        </SearchBar>
    }

    export function Location (props: IProps<SystemCenter.Types.DetailedLocation>) {

        const standardSearch: Search.IField<SystemCenter.Types.DetailedLocation> = { label: 'Name', key: 'Name', type: 'string', isPivotField: false };

        const dispatch = useDispatch();
        const searchStatus = useSelector(props.Slice.SearchStatus)
        const sortField = useSelector(props.Slice.SortField)
        const ascending = useSelector(props.Slice.Ascending)
        const data: SystemCenter.Types.DetailedLocation[] = useSelector(props.Slice.SearchResults);

        const defaultSearchcols: Array<Search.IField<SystemCenter.Types.DetailedLocation>> = [
            { label: 'Name', key: 'Name', type: 'string', isPivotField: false },
            { label: 'Key', key: 'LocationKey', type: 'string', isPivotField: false },
            { label: 'Asset', key: 'Asset', type: 'string', isPivotField: false },
            { label: 'Meter', key: 'Meter', type: 'string', isPivotField: false },
            { label: 'Number of Assets', key: 'Assets', type: 'integer', isPivotField: false },
            { label: 'Number of Meters', key: 'Meters', type: 'integer', isPivotField: false },
        ]; 

        return <SearchBar<SystemCenter.Types.DetailedLocation> 
            CollumnList={defaultSearchcols} 
            SetFilter={(flds) => dispatch(props.Slice.DBSearch({ filter: flds, sortField, ascending }))}
            Direction={'left'} 
            defaultCollumn={standardSearch} 
            Width={'50%'} 
            Label={'Search'}
            ShowLoading={searchStatus == 'loading'} 
            ResultNote={searchStatus == 'error' ? 'Could not complete Search' : 'Found ' + data.length + ' Locations'}
            GetEnum={props.GetEnum}
        >
            {props.children}
        </SearchBar>
    }

    export function Asset (props: IProps<SystemCenter.Types.DetailedAsset>) {

        const standardSearch: Search.IField<SystemCenter.Types.DetailedAsset> = { label: 'Name', key: 'AssetName', type: 'string', isPivotField: false };
        
        const dispatch = useDispatch();
        const searchStatus = useSelector(props.Slice.SearchStatus)
        const sortField = useSelector(props.Slice.SortField)
        const ascending = useSelector(props.Slice.Ascending)
        const data: SystemCenter.Types.DetailedAsset[] = useSelector(props.Slice.SearchResults);

        const defaultSearchcols: Array<Search.IField<SystemCenter.Types.DetailedAsset>> = [
            { label: 'Key', key: 'AssetKey', type: 'string', isPivotField: false },
            { label: 'Name', key: 'AssetName', type: 'string', isPivotField: false },
            { label: 'Voltage (kV)', key: 'VoltageKV', type: 'number', isPivotField: false },
            { label: 'Type', key: 'AssetType', type: 'enum', isPivotField: false },
            { label: 'Meters', key: 'Meters', type: 'integer', isPivotField: false },
            { label: 'Substations', key: 'Locations', type: 'integer', isPivotField: false },
        ];

        return <SearchBar<SystemCenter.Types.DetailedAsset> 
            CollumnList={defaultSearchcols} 
            SetFilter={(flds) => dispatch(props.Slice.DBSearch({ filter: flds, sortField, ascending }))} 
            Direction={'left'} 
            defaultCollumn={standardSearch} 
            Width={'50%'} 
            Label={'Search'}
            ShowLoading={searchStatus == 'loading'} 
            ResultNote={searchStatus == 'error' ? 'Could not complete Search' : 'Found ' + data.length + ' Transmission Assets'}
            GetEnum={props.GetEnum}

        >
            {props.children}
        </SearchBar>
    }

    export function AssetGroup (props: IProps<OpenXDA.Types.AssetGroup>) {

        const standardSearch: Search.IField<OpenXDA.Types.AssetGroup> = { label: 'Name', key: 'AssetName', type: 'string', isPivotField: false };
        
        const dispatch = useDispatch();
        const searchStatus = useSelector(props.Slice.SearchStatus)
        const sortField = useSelector(props.Slice.SortField)
        const ascending = useSelector(props.Slice.Ascending)
        const data: OpenXDA.Types.AssetGroup[] = useSelector(props.Slice.SearchResults);

        const defaultSearchcols: Array<Search.IField<OpenXDA.Types.AssetGroup>> = [
            { label: 'Name', key: 'Name', type: 'string', isPivotField: false },
            { label: 'Number of Meter', key: 'Meters', type: 'integer', isPivotField: false },
            { label: 'Number of Transmission Assets', key: 'Assets', type: 'integer', isPivotField: false },
            { label: 'Number of Users', key: 'Users', type: 'integer', isPivotField: false },
            { label: 'Show in PQ Dashboard', key: 'DisplayDashboard', type: 'boolean', isPivotField: false },      
        ];

        return <SearchBar<OpenXDA.Types.AssetGroup> 
            CollumnList={defaultSearchcols} 
            SetFilter={(flds) => dispatch(props.Slice.DBSearch({ filter: flds, sortField, ascending }))} 
            Direction={'left'} 
            defaultCollumn={standardSearch} 
            Width={'50%'} 
            Label={'Search'}
            ShowLoading={searchStatus == 'loading'} 
            ResultNote={searchStatus == 'error' ? 'Could not complete Search' : 'Found ' + data.length + ' Asset Group(s)'}
            GetEnum={props.GetEnum}
        >
            {props.children}
        </SearchBar>
    }


}