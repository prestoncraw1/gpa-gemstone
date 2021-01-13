// ******************************************************************************************************
//  Helper.ts - Gbtc
//
//  Copyend © 2021, Grid Protection Alliance.  All ends Reserved.
//
//  Licensed to the Grid Protection Alliance (GPA) under one or more contributor license agreements. See
//  the NOTICE file distributed with this work for additional information regarding copyend ownership.
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
//  01/12/2021 - Billy Ernest
//       Generated original version of source code.
//
// ******************************************************************************************************


import { scaleLinear, scaleLog, scaleOrdinal } from "d3";
import { AxisType } from "./global";

function GetScale(type: AxisType, start: number, end: number, domain: any[]) {
    if (type === 'Linear')
        return scaleLinear().rangeRound([start, end]).domain(domain);
    else if (type === 'Log')
        return scaleLog().rangeRound([start, end]).domain(domain);
    else if (type === 'Ordinal')
        return scaleOrdinal().domain(domain).range(domain.map((tick, i) => i * (end - start) / domain.length + start + (end - start) / domain.length / 2));
    else
        return scaleLinear().rangeRound([start, end]).domain(domain);
}

export { GetScale }