// ******************************************************************************************************
//  global.d.ts - Gbtc
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
//  06/15/2020 - Billy Ernest
//       Generated original version of source code.
//
// ******************************************************************************************************

import { ScaleLinear, ScaleLogarithmic, ScaleOrdinal } from "d3";


export interface State{
        Legend: LegendSeries[],
        YAxis: AxisMap[],
        XAxis: AxisMap[],
}

export interface LegendSeries {
    Label: string,
    Color: string,
    Show: boolean,
    Width: number
}

export type AxisType = 'DateTime' | 'Linear' | 'Log' | 'Ordinal';
export interface AxisMap {
    ID: string,
    Domain: any[],
    Type: AxisType,
    Range: any[],
    Start: number,
    End: number,
    Scale?: ScaleLinear<number, number> | ScaleLogarithmic<number, number> | ScaleOrdinal<string, any>
}