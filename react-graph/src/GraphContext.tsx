// ******************************************************************************************************
//  GraphContext.tsx - Gbtc
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
//  03/18/2021 - C Lackner
//       Generated original version of source code.
//
// ******************************************************************************************************
import * as React from 'react';

export interface IGraphContext {
  XDomain: [number, number],
  XScale: number,
  XOffset: number,

  XHover: number,
  YDomain: [number, number],
  YScale: number,
  YOffset: number,

  Data: Map<string, IDataSeries>,
  AddData: ((d: IDataSeries) => string),
  RemoveData: (key: string) => void,
  UpdateData: (key: string, d: IDataSeries) => void,
  SetLegend: (key: string, legend: HTMLElement|undefined) => void
};

export const GraphContext = React.createContext({
  XDomain: [0, 0],
  XScale: 0,
  XOffset: 0,

  XHover: NaN,
  YDomain: [0, 0],
  YScale: 0,
  YOffset: 0,

  Data: new Map<string, IDataSeries>(),
  AddData: ((_: IDataSeries) => ""),
  RemoveData: (_: string) => undefined,
  UpdateData: (_) => undefined,
  SetLegend: (_) => undefined
} as IGraphContext);

export interface IDataSeries {
  getMin: (tDomain: [number, number]) => number,
  getMax: (tDomain: [number, number]) => number,
  legend?: HTMLElement,
};

export type LineStyle = '-'|':';
