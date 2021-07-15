// ******************************************************************************************************
//  SliceInterfaces.tsx - Gbtc
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
//  07/15/2021 - C. Lackner
//       Generated original version of source code.
//
// ******************************************************************************************************
import { Application } from '@gpa-gemstone/application-typings';
import { Search } from '@gpa-gemstone/react-interactive';
import { ActionCreatorWithPayload, AsyncThunk } from '@reduxjs/toolkit';

type DBAction = 'POST' | 'DELETE' | 'PATCH';

export interface iGenericSlice<T> {
  Fetch: (AsyncThunk<any, void | number, {}>),
	DBAction: (AsyncThunk<any, { verb: DBAction, record: T }, {}> ),
  Sort: ActionCreatorWithPayload<{ SortField: keyof T, Ascending: boolean}, string>,

	Data: (state: any) => T[],
	Status: (state: any) => Application.Types.Status,
	SortField: (state: any) => keyof T,
	Ascending: (state: any) => boolean,
	ParentID?: (state: any) => number| null
}

export interface iSearchableSlice<T> extends iGenericSlice<T> {
	DBSearch: (AsyncThunk<any, { filter: Search.IFilter<T>[], sortField?: keyof T, ascending?: boolean }, {}> ),

	SearchFilters: (state: any) => Search.IFilter<T>[],
	SearchResults: (state: any) => T[],
	SearchStatus: (state: any) => Application.Types.Status,
}

export interface iUserAccountSlice extends iGenericSlice<Application.Types.UserAccount> {
	ValidateAD: (AsyncThunk<any, {}, {}>),
	ADUpdate: (AsyncThunk<any, {}, {}>),
	SetCurrentUser: (AsyncThunk<any, string, {}>),
	CurrentID: (state: any) => string,
	CurrentUser: (state: any) => Application.Types.UserAccount,
	Status: (state: any) => Application.Types.Status,
}

export interface iAdditionaFieldSlice<T,U> {
	FetchField: AsyncThunk<any, {}, {}>,
	FieldAction: AsyncThunk<any, { verb: DBAction, record: T }, {}>,
	SetParent: AsyncThunk<any, number|string, {}>,
	Fields: (state: any) => T[],
	Field: (state: any, id: number) => T,
}
