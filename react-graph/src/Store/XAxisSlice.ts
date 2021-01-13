//******************************************************************************************************
//  XAxisSlice.ts - Gbtc
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
//******************************************************************************************************

import { createSlice } from '@reduxjs/toolkit';
import { ScaleLogarithmic, ScaleLinear, ScaleOrdinal } from 'd3';
import { AxisMap, AxisType } from '../Plot';
import { GetScale } from '../Helper';

// #region [ Slice ]
export const XAxisSlice = createSlice({
    name: 'XAxis',
    initialState: [] as AxisMap[],
    reducers: {
        Add: (state, action: { payload: AxisMap, type: string }) => {
            state.push(action.payload)
        },
        SetType: (state, action: { payload: { ID: string, Type: AxisType }, type: string }) => {
            state.find(s => s.ID === action.payload.ID).Type = action.payload.Type;
        },
        SetDomain: (state, action: { payload: { ID: string, Domain: any[] }, type: string }) => {
            state.find(s => s.ID === action.payload.ID).Domain = action.payload.Domain;
        },
        SetRange: (state, action: { payload: { ID: string, Range: any[] }, type: string }) => {
            state.find(s => s.ID === action.payload.ID).Range = action.payload.Range;
            state.find(s => s.ID === action.payload.ID).Domain = action.payload.Range;
        },
        ResetZoom: (state) => {
            state.forEach(s => { s.Domain = s.Range });
        },
        Drag: (state, action: { payload: { Click: number, Drag: number }, type: string }) => {
            state.forEach(s => {
                const scale = GetScale(s.Type, s.Start, s.End, s.Domain)
                s.Domain = s.Domain.map(d => (scale as any).invert(scale(d) as number + action.payload.Click - action.payload.Drag));
            })
        },
        Zoom: (state, action: { payload: { Point: number, Multiplier: number }, type: string }) => {
            state.forEach(s => {
                const length = (s.End - s.Start) * action.payload.Multiplier;
                const scale = GetScale(s.Type, s.Start, s.End, s.Domain);
                s.Domain = [(scale as any).invert(action.payload.Point - length / 2), (scale as any).invert(action.payload.Point + length / 2)];
            })
        }
    }
});
// #endregion

// #region [ Selectors ]
export const { Add, SetType, SetDomain, SetRange, ResetZoom, Drag, Zoom  } = XAxisSlice.actions;
export default XAxisSlice.reducer;
export const SelectXAxes = (state) => state.XAxis;
export const SelectXAxis = (state, key: string) => {
    let axis = state.XAxis.find(l => l.ID === key);
    if (axis === undefined) return axis;
    return { ...axis, Scale: GetScale(axis.Type, axis.Start, axis.End, axis.Domain) };
};
export const SelectXAxesReset = (state) => state.XAxis.every(a => a.Domain.every((d,i) => d === a.Range[i]))
// #endregion

