//******************************************************************************************************
//  YAxis.tsx - Gbtc
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
//  12/30/2020 - Billy Ernest
//       Generated original version of source code.
//
//******************************************************************************************************
import { useSelector, useDispatch } from 'react-redux';
import { Add, SelectYAxis, SetRange } from './Store/YAxisSlice';

import React, { ReactElement } from 'react';
import { scaleLog, scaleLinear, scaleOrdinal, min, max } from 'd3';
import { PlotContext, AxisMap } from './Plot';
import { CreateGuid } from '@gpa-gemstone/helper-functions';
import { SeriesProps } from './Series';
import { GetScale } from './Helper';

export interface YAxisProps {
    children?: ReactElement<SeriesProps<any>> | ReactElement<SeriesProps<any>>[] /*JSX.Element | JSX.Element[]*/,
    Label: string,
    Grid?: boolean,
    Type?: 'DateTime' | 'Linear' | 'Log' | 'Ordinal',
    Unit?: string,
    TickNumber?: number,
    Ticks?: string[],
    Range?: [number, number]
}

const YAxisContext = React.createContext('nothing');

const YAxis = (props: YAxisProps) => {
    const { margin, svgWidth, svgHeight, top, bottom} = React.useContext(PlotContext);
    const [guid] = React.useState(CreateGuid());
    const dispatch = useDispatch();
    const series = useSelector(state => SelectYAxis(state, guid));

    React.useEffect(() => {
        let range = getRange();

        if (series === undefined) 
            dispatch(Add({ ID: guid, Type: props.Type, Range: range, Domain: range, Start: bottom, End: top  }));
        else 
            dispatch(SetRange({ ID: guid, Range: range}));
    },[props.children]);

    function getRange(): any[] {
        if (props.Range !== undefined) return props.Range;
        else if ((props.children as ReactElement<SeriesProps<any>>) === undefined) {
            return [0, 10]
        }
        else if ((props.children as JSX.Element[]).length === 0) {
            return [0, 10]
        }
        else if ((props.children as JSX.Element[]).length === undefined) {
            let range = ((props.children as JSX.Element).props as SeriesProps<any>).Data.map(d => d[(props.children as JSX.Element).props.YField]);

            if (props.Type === 'Ordinal') {
                return range;
            }
            else {
                return [min(range), max(range)]
            }
        }
        else {
            let children: ReactElement<SeriesProps<any>>[] = [].concat(...props.children as ReactElement<SeriesProps<any>>[])

            let range = [... new Set([].concat(...children.map(c => (c.props as SeriesProps<any>).Data.map(d => d[(c.props as SeriesProps<any>).YField]))))];

            if (props.Type === 'Ordinal') {
                return range;
            }
            else {
                return [min(range), max(range)]
            }
        }
    }

    function GenerateAxis(): JSX.Element[] {
        if (series === undefined) return [];
        if (props.Type === 'Log') return GenerateLogAxis();
        else if (props.Type === 'Ordinal') return GenerateOrdinalAxis();
        else return GenerateLinearAxis();
    }

    function GenerateLogAxis(): JSX.Element[] {
        let y = scaleLog().rangeRound([svgHeight, margin.top]).domain(series.Domain);

        let i = parseFloat(Math.pow(10, Math.floor(Math.log(series.Domain[0]) / Math.log(10))).toPrecision(1));
        let ticks: JSX.Element[] = []
        let logDomain = y.domain().map(l => Math.log(l) / Math.log(10));
        let ldDiff = logDomain[1] - logDomain[0];
        for (; i <= series.Domain[1]; i = i * 10) {
            ticks.push(
                <g key={i} className="tick" transform={`translate(${margin.left},${y(i)})`} style={{ opacity: i < y.domain()[0] || i > y.domain()[1] ? 0 : 1 }}>
                    {props.Grid ? <path stroke='black' d={`M -6,0 H -${svgHeight - margin.top}`} strokeWidth={0.25}></path> : null}
                    <text fill="black" fontSize="small" y="20" textAnchor='middle'>{i}</text>
                    {(props.Grid && ldDiff < 5 ?
                        <g>
                            {([1, 2, 3, 4, 5, 6, 7, 8, 9]).map(num => <path stroke='black' key={num} d={`M -6,${y(num * i) - y(i)} H -${svgHeight - margin.top}`} strokeWidth={0.25} />)}
                        </g>
                        : null)}
                </g>
            );

        }
        return ticks;
    }

    function GenerateLinearAxis(): JSX.Element[] {
        let y = scaleLinear().rangeRound([svgHeight, margin.top]).domain(series.Domain);

        let ticks: JSX.Element[] = []
        let step = 0.1;
        if (y.domain()[1] - y.domain()[0] >  5)
            step = Math.round((y.domain()[1] - y.domain()[0]) / (props.TickNumber != null ? props.TickNumber : 10));
        else 
            step = (y.domain()[1] - y.domain()[0]) / (props.TickNumber != null ? props.TickNumber : 10);

        for (let i = Math.floor(series.Domain[0]); i <= series.Domain[1]; i = step + i) {
            ticks.push(
                <g key={i} className="tick" transform={`translate(${margin.left},${y(i)})`} style={{ opacity: i < y.domain()[0] || i > y.domain()[1] ? 0 : 1 }}>
                    {props.Grid ? <path stroke='black' d={`M -6,0 H ${svgWidth}`} strokeWidth={0.25}></path> : null }
                    <text fill="black" fontSize="small" x="-15" dy="0.32em" textAnchor='middle'>{i.toFixed(1)}</text>

                </g>
            );

        }
        return ticks;
    }

    function GenerateOrdinalAxis(): JSX.Element[] {
        if (props.Ticks === null || props.Ticks.length === 0) return null;

        let scale = scaleOrdinal().domain(props.Ticks).range(props.Ticks.map((tick, i) => i * (svgHeight) / props.Ticks.length + margin.top + (svgHeight) / props.Ticks.length / 2));
        return props.Ticks.map(tick => (
            <g key={tick} className="tick" transform={`translate(${margin.left},${scale(tick)})`}>
                {props.Grid ? <path stroke='black' d={`M -6,0 H ${svgWidth}`} strokeWidth={0.25}></path> : null}
                <text fill="black" fontSize="small" x="-15" dy="0.32em" textAnchor='middle'>{tick}</text>
            </g>
        ));
    }


    return (
        <YAxisContext.Provider value={guid}>
            {props.children}
            {GenerateAxis()}
            <text fill="black" fontSize="small" transform={`rotate(-90 0,0)`} y={margin.left/2} x={-svgHeight / 2 - margin.bottom}>{props.Label}{props.Unit != null ? `(${props.Unit})` : ''}</text>
        </YAxisContext.Provider>
    )
}

export default YAxis;
export { YAxisContext };