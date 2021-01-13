// ******************************************************************************************************
//  LegendSlice.ts - Gbtc
//
//  Copyright © 2021, Grid Protection Alliance.  All Rights Reserved.
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
//  01/11/2021 - Billy Ernest
//       Generated original version of source code.
//
// ******************************************************************************************************
import { createSlice } from '@reduxjs/toolkit';
import { LegendSeries, State } from '../global';


// #region [ Slice ]
export const LegendSlice = createSlice({
    name: 'Legend',
    initialState: [] as LegendSeries[],
    reducers: {
        Add: (state: LegendSeries[], action: { payload: LegendSeries, type: string } ) => {
            state.push(action.payload)
        },
        Show: (state: LegendSeries[], action: { payload: {Index: number, Show: boolean}, type: string}) => {
            state[action.payload.Index].Show = action.payload.Show;
        },
    }
});
// #endregion

// #region [ Selectors ]
export const { Add, Show} = LegendSlice.actions;
export default LegendSlice.reducer;
export const SelectLegend = (state: State) => state.Legend;
export const SelectLegendSeries = (state: State, key: string) => state.Legend.find(l => l.Label === key) ;

// #endregion

