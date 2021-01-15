// ******************************************************************************************************
//  XAxis.tsx - Gbtc
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
// ******************************************************************************************************

import * as React from 'react';
import { scaleLog, scaleLinear, scaleOrdinal, min, max, Series} from 'd3';
import { PlotContext} from './Plot';
import { CreateGuid } from '@gpa-gemstone/helper-functions';
import YAxis, { YAxisProps } from './YAxis';
import { SeriesProps } from './Series';
import { useSelector, useDispatch } from 'react-redux';
import { Add, SelectXAxis, SetRange } from './Store/XAxisSlice';
import { AxisType, State } from './global';

const XAxisContext = React.createContext('nothing');

const XAxis = (props: {
    children?: React.ReactElement<YAxisProps> | React.ReactElement<YAxisProps>[] | React.ReactElement<SeriesProps<any>> | React.ReactElement<SeriesProps<any>>[] /*| JSX.Element | JSX.Element[]*/,
    Label: string,
    Grid?: boolean,
    Type?: AxisType,
    Unit?: string,
    TickNumber?: number,
    Ticks?: string[],
    Placement?: 'Top' | 'Bottom',
    TickFormatter?: (tick: number) => string, 
    Range?: [number, number]
}) => {
    const { svgWidth, top, left, right, bottom, margin} = React.useContext(PlotContext);
    const [guid] = React.useState(CreateGuid());
    const dispatch = useDispatch();
    const axis = useSelector((state: State) => SelectXAxis(state, guid));

    React.useEffect(() => {
        const range = getRange();

        if (axis === undefined)
            dispatch(Add({ ID: guid, Type: (props.Type ? props.Type : 'Linear'), Range: range, Domain: range, Start: left, End: right}));
        else
            dispatch(SetRange({ ID: guid, Range: range }));
    }, [props.children]);

    function getRange(): any[] {
        if (props.Range !== undefined) return props.Range;
        else if ((props.children as React.ReactElement<YAxisProps> ) === undefined) {
            return [1, 10]
        }
        else if ((props.children as React.ReactElement<YAxisProps> []).length === 0) {
            return [1, 10]
        }
        else if ((props.children as React.ReactElement<YAxisProps>[]).length === undefined) {
            const yaxis = props.children as React.ReactElement<YAxisProps>;
            let series = (yaxis.props.children as React.ReactElement<SeriesProps<any>>[]);
            if (series.length === undefined) {
                const s = yaxis.props.children as React.ReactElement<SeriesProps<any>>;
                const range = s.props.Data.map(d => d[s.props.XField]);

                if (props.Type === 'Ordinal') {
                    return range;
                }
                else {
                    return [min(range), max(range)]
                }

            }
            else {
                series = [].concat(...series as any);
                const range = [... new Set([].concat(...series.map(s => s.props.Data.map(d => d[s.props.XField]) as any)))];
                if (props.Type === 'Ordinal') {
                    return range;
                }
                else {
                    return [min(range), max(range)]
                }

            }
        }
        else {
            const yaxis = props.children as React.ReactElement<YAxisProps>[];
            const series: React.ReactElement<SeriesProps<any>>[] = [].concat(...yaxis.map(y => y.props.children as React.ReactElement<SeriesProps<any>> as any));
            const range = [...new Set([].concat(...series.map(s => s.props.Data.map(d => d[s.props.XField])) as any))];

            if (props.Type === 'Ordinal') {
                return range;
            }
            else {
                return [min(range), max(range)]
            }
        }
    }

    function GenerateAxis(): JSX.Element[] {
        if (axis === undefined) return [];
        else if (props.Type === 'Log') return GenerateLogAxis();
        else if (props.Type === 'Ordinal') return GenerateOrdinalAxis();
        else return GenerateLinearAxis();
    }

    function GenerateLogAxis(): JSX.Element[] {
        const x = scaleLog().rangeRound([left, right]).domain(axis?.Domain ?? []);

        let i = parseFloat(Math.pow(10, Math.floor(Math.log(axis?.Domain[0] ?? 0) / Math.log(10))).toPrecision(1));
        const ticks: JSX.Element[] = []
        const logDomain = x.domain().map(l => Math.log(l) / Math.log(10));
        const ldDiff = logDomain[1] - logDomain[0];
        for (; i <= axis?.Domain[1]; i = i * 10) {
            ticks.push(
                <g key={i} className="tick" transform={`translate(${x(i)},${bottom})`} style={{ opacity: i < x.domain()[0] || i > x.domain()[1] ? 0 : 1 }}>
                    {props.Grid ? <path stroke='black' d={`M 0,6 V -${bottom - top}`} strokeWidth={0.25}></path> : null}
                    <text fill="black" fontSize="small" y="20" textAnchor='middle'>{props.TickFormatter === undefined ? i : props.TickFormatter(i)}</text>
                    {(props.Grid && ldDiff < 5 ?
                        <g>
                            {([1, 2, 3, 4, 5, 6, 7, 8, 9]).map(num => <path stroke='black' key={num} d={`M ${x(num * i) - x(i)},6 V -${bottom - top}`} strokeWidth={0.25} />)}
                        </g>
                        : null)}
                </g>
            );

        }
        return ticks;
    }

    function GenerateLinearAxis(): JSX.Element[] {
        const x = scaleLinear().rangeRound([left, right]).domain(axis?.Domain ?? []);

        const ticks: JSX.Element[] = []
        const step = Math.round((x.domain()[1] - x.domain()[0])/(props?.Ticks !== undefined ? props?.TickNumber  ?? 10: 10));
        for (let i = Math.floor(axis?.Domain[0] ?? 0); i <= axis?.Domain[1] ?? 10; i = step + i)  {
            ticks.push(
                <g key={i} className="tick" transform={`translate(${x(i)},${bottom})`} style={{ opacity: i < x.domain()[0] || i > x.domain()[1] ? 0 : 1 }}>
                    {props.Grid ? <path stroke='black' d={`M 0,6 V -${bottom - top}`} strokeWidth={0.25}></path> : null}
                    <text fill="black" fontSize="small" y="20" textAnchor='middle'>{props.TickFormatter === undefined ? i : props.TickFormatter(i)}</text>
                </g>
            );

        }
        return ticks;
    }

    function GenerateOrdinalAxis(): JSX.Element[] {
        if (props.Ticks === null || props?.Ticks?.length === 0) return [];

        const x = scaleOrdinal().domain(props?.Ticks ?? []).range(props?.Ticks?.map((tick, i) => i * (svgWidth) / (props?.Ticks?.length ?? 10) + left +  (svgWidth) / (props?.Ticks?.length ?? 10)/2) ?? []);
        return (props?.Ticks ?? []).map(tick => (
            <g key={tick} className="tick" transform={`translate(${x(tick)},${bottom})`}>
                {props.Grid ? <path stroke='black' d={`M 0,6 V -${bottom - top}`} strokeWidth={0.25}></path> : null}
                <text fill="black" fontSize="small" y="20" textAnchor='middle'>{tick}</text>
            </g>
        ));
    }

    function YAxisNotExists(): boolean {
        const children = props.children;
        if (children === undefined) return true;
        else if ((children as JSX.Element[]).length === undefined) {
            if ((children as JSX.Element).type.name !== 'YAxis') return true;
            else return false;
        }
        else if ((children as JSX.Element[]).find(a => a.type.name === 'YAxis')?.type.name !== 'YAxis') return true;
        else return false;
    }
    return (
        <XAxisContext.Provider value={guid}>
            {
               YAxisNotExists() ?
                    <YAxis Label='' Type='Linear' TickNumber={10}>
                        {props.children as React.ReactElement<SeriesProps<any>> | React.ReactElement<SeriesProps<any>>[] }
                    </YAxis>
                    :  props.children
            }        
            {GenerateAxis()}
            <text fill="black" fontSize="small" x={svgWidth / 2} y={bottom + margin.bottom/2 }>{props.Label}{props.Unit != null?`(${props.Unit})` :''}</text>
        </XAxisContext.Provider>     
    )
}

export default XAxis;
export { XAxisContext};