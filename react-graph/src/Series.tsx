// ******************************************************************************************************
//  Series.tsx - Gbtc
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
//  12/31/2020 - Billy Ernest
//       Generated original version of source code.
//
// ******************************************************************************************************

import { useSelector, useDispatch } from 'react-redux';
import * as React from 'react';
import * as d3 from 'd3';
import { XAxisContext } from './XAxis';
import { PlotContext } from './Plot';
import { Add, SelectLegendSeries } from './Store/LegendSlice';
import { YAxisContext } from './YAxis';
import { SelectYAxis } from './Store/YAxisSlice';
import { SelectXAxis } from './Store/XAxisSlice';
import { GetTextWidth } from '@gpa-gemstone/helper-functions';
import { GetScale } from './Helper';
import { AxisMap, State } from './global';


export interface SeriesProps<T> {
    Label: string,
    XField: keyof T,
    YField: keyof T,
    Type: 'points' | 'line' | 'histogram' | 'stacked',
    Style?: React.SVGProps<SVGCircleElement | SVGRectElement | SVGPathElement>,
    Click?: () => void,
    Color: string,
    Data: T[],
    ShowInitially?:boolean,
    bins?: number

}
function Series<T>(props: SeriesProps<T>) {
    /*
      Used to show data on plot.
    */
    const { svgWidth, left, right, top, bottom, margin } = React.useContext(PlotContext);
    const yGuid = React.useContext(YAxisContext);
    const xGuid = React.useContext(XAxisContext);

    const dispatch = useDispatch();
    const series = useSelector((state: State) => SelectLegendSeries(state, props.Label));
    const yAxis = useSelector((state: State) => SelectYAxis(state, yGuid as string)) as AxisMap;
    const xAxis = useSelector((state: State) => SelectXAxis(state, xGuid as string)) as AxisMap;

    React.useEffect(() => {
        if (series === undefined)
            dispatch(Add({ Label: props.Label, Color: props.Color, Show: props.ShowInitially === false ? false : true, Width: GetTextWidth("BlinkMacSystemFont", '13px', props.Label) }));
    },[]);

    if (yAxis === undefined || xAxis === undefined) return <></>;
    const x = GetScale(xAxis.Type, left, right, xAxis.Domain );
    const y = GetScale(yAxis.Type, bottom, top, yAxis.Domain);

    if (series !== undefined ? !series.Show : false) {
        return (
            <>
            </>
        )

    }
    else if (props.Type === 'points') {
        return (
            <>
                {props.Data.filter(point => point[props.YField] >= yAxis.Domain[0] && point[props.YField] <= yAxis.Domain[1] && point[props.XField] >= xAxis.Domain[0] && point[props.XField] <= xAxis.Domain[1]).map((point, index) => <circle  {...props.Style as React.SVGProps<SVGCircleElement>} key={index} className="dot" r={3} cx={(xAxis.Scale ? xAxis.Scale(point[props.XField] as any) as number: 0)} cy={(yAxis.Scale ? yAxis.Scale(point[props.YField] as any) as number:0)} fill='blue' style={{ cursor: 'pointer' }} onClick={props.Click} />) }
            </>
        )
    }
    else if (props.Type === 'line') {
        const linefunc = d3.line<T>().x(d => x(d[props.XField] as any) as any).y(d => y(d[props.YField] as any) as any);

        return <path
            {...props.Style as React.SVGProps<SVGPathElement>}
            d={linefunc(props.Data) as string}
            stroke={props.Color}
        />;
    }
    else if (props.Type === 'histogram') {
        const histogram = d3.bin<T, any>().thresholds((data, min, max) => 
              d3.range(props?.bins ?? 10).map(t => min + (t / (props?.bins ?? 10)) * (max - min))
            ).value(d => d[props.XField]);
        const bars = histogram(props.Data);
        return (
            <>
                {bars.map(bar => (
                <rect
                    {...props.Style as React.SVGProps<SVGRectElement>}
                    x={0}
                    transform={`translate(${x(bar.x0 as any)},${y(bar.length as any)})`}
                    width={(x(bar.x1) as number) - (x(bar.x0) as number) - 1}
                ></rect>
                ))}
            </>
        )
    }
    else if (props.Type === 'stacked') {
        return (
            <>
            </>
        )
    }
    else {
        return (
            <>
            </>
        )
    }

}


export default Series;