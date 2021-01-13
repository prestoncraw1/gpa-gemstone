//******************************************************************************************************
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
//******************************************************************************************************

import { useSelector, useDispatch } from 'react-redux';
import React from 'react';
import { scaleLog, scaleLinear, scaleOrdinal, line, min, max } from 'd3';
import { XAxisContext } from './XAxis';
import { PlotContext, AxisMap } from './Plot';
import { Add, SelectLegendSeries } from './Store/LegendSlice';
import { YAxisContext } from './YAxis';
import { SelectYAxis } from './Store/YAxisSlice';
import { SelectXAxis } from './Store/XAxisSlice';
import { GetTextWidth } from '@gpa-gemstone/helper-functions';
import { GetScale } from './Helper';
export interface SeriesProps<T> {
    Label: string,
    XField: keyof T,
    YField: keyof T,
    Type: 'points' | 'line' | 'histogram' | 'stacked',
    Style?: React.SVGProps<SVGCircleElement> | React.SVGProps<SVGPathElement>  ,
    Click?: () => void,
    Color: string,
    Data: T[],
    ShowInitially?:boolean

}
function Series<T>(props: SeriesProps<T>) {
    const { svgWidth, left, right, top, bottom, margin } = React.useContext(PlotContext);
    const yGuid = React.useContext(YAxisContext);
    const xGuid = React.useContext(XAxisContext);

    const dispatch = useDispatch();
    const series = useSelector(state => SelectLegendSeries(state, props.Label));
    const yAxis: AxisMap = useSelector(state => SelectYAxis(state, yGuid));
    const xAxis: AxisMap = useSelector(state => SelectXAxis(state, xGuid));

    React.useEffect(() => {
        if (series === undefined)
            dispatch(Add({ Label: props.Label, Color: props.Color, Show: props.ShowInitially === false ? false : true, Width: GetTextWidth("BlinkMacSystemFont", '13px', props.Label) }));
    },[]);

    if (yAxis === undefined || xAxis === undefined) return <></>;
    let x = GetScale(xAxis.Type, left, right, xAxis.Domain );
    let y = GetScale(yAxis.Type, bottom, top, yAxis.Domain);

    if (series !== undefined ? !series.Show : false) {
        return (
            <>
            </>
        )

    }
    else if (props.Type === 'points') {
        return (
            <>
                {props.Data.filter(point => point[props.YField] >= yAxis.Domain[0] && point[props.YField] <= yAxis.Domain[1] && point[props.XField] >= xAxis.Domain[0] && point[props.XField] <= xAxis.Domain[1]).map((point, index) => <circle  {...props.Style as React.SVGProps<SVGCircleElement>} key={index} className="dot" r={3} cx={xAxis.Scale(point[props.XField] as any) as number} cy={yAxis.Scale(point[props.YField] as any) as number} fill='blue' style={{ cursor: 'pointer' }} onClick={props.Click} />) }
            </>
        )
    }
    else if (props.Type === 'line') {
        let linefunc = line<T>().x(d => x(d[props.XField] as any) as any).y(d => y(d[props.YField] as any) as any);

        return <path
            {...props.Style as React.SVGProps<SVGPathElement>}
            d={linefunc(props.Data)}
            stroke={props.Color}
        />;
    }
    else if (props.Type === 'histogram') {
        return (
            <>
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