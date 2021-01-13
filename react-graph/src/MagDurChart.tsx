//******************************************************************************************************
//  MagDurChart.tsx - Gbtc
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
//  06/23/2020 - Billy Ernest
//       Generated original version of source code.
//
//******************************************************************************************************

import React from 'react';
import _ from 'lodash';
import Plot from './Plot';
import XAxis from './XAxis';
import YAxis from './YAxis';
import Series from './Series';
import Legend from './Legend';

interface iData {
    ID: number,
    Name: string,
    Visible: boolean,
    Color: string,
    PerUnitMagnitude: number,
    DurationSeconds: number,
    LoadOrder: number
}

export interface Point {
    EventID: number,
    PerUnitMagnitude: number,
    DurationSeconds: number
}

const MagDurChart = (props: { Width: number, Height: number, Points?: Point[], OnSelect?: (evt: any, point: Point) => void }) => {
    const [curves, setCurves] = React.useState<any>([]);
    const [points, setPoints] = React.useState<Point[]>([]);

    React.useEffect(() => {

        let handle1 = GetMagDurCurves();
        let handle2 = GetMagDurPoints();

        handle1.done((data: iData[]) => {
            let cs = [...new Set(data.map(a => a.Name))].map(a => {
                let c = data.filter(b => b.Name === a);
                return { Color: c[0].Color, Data: c, Visible: c[0].Visible, Name: a }
            });

            setCurves(cs);
        });

        handle2.done((data: Point[]) => {
            setPoints(data);
        });


        return function () {
            if (handle1.abort != undefined) handle1.abort();
            if (handle2.abort != undefined) handle2.abort();

        }
    }, []);


    function GetMagDurCurves(): JQuery.jqXHR<iData[]> {
        return $.ajax({
            type: "GET",
            url: `${homePath}api/MagDurCurves`,
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            cache: true,
            async: true
        });
    }


    function GetMagDurPoints(): JQuery.jqXHR<Point[]> {
        return $.ajax({
            type: "GET",
            url: `${homePath}api/MagDurPoints`,
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            cache: true,
            async: true
        });
    }



    function xAxisText(value: number): string {
        if (value < 0.0000001) return (value * 1000000000).toFixed(0) + 'n';
        if (value < 0.001) return (value * 1000000).toFixed(0) + 'µ';
        if (value > 1000 && value < 1000000) return (value / 1000).toFixed(0) + 'k';
        if (value > 100000) return (value / 1000000).toFixed(0) + 'M';
        if (value < 1) return value.toPrecision(1).toString()
        return value.toString()
    }

    return (
        <Plot Height={props.Height} Width={props.Width} Zoom={true} Drag={true} Margin={{ top: 15, right: 20, bottom: 60, left: 50 }}>
            <XAxis Label='Duration' Unit='s' Type='Log' Grid={true} TickFormatter={xAxisText}>
                <YAxis Label='Magnitude' Unit='pu' Grid={true} Type='Linear' Range={[0,2.5]}>
                    <Series<Point> Color='blue' XField='DurationSeconds' YField='PerUnitMagnitude' Label='Events' Data={points} Type='points'/>
                    {curves.map(mdc => <Series<iData> key={mdc.Name} Label={mdc.Name} XField='DurationSeconds' YField='PerUnitMagnitude' Type='line' Color={mdc.Color} ShowInitially={mdc.Visible} Data={mdc.Data} />)}
                </YAxis>
            </XAxis>
            <Legend Position='bottomleft' Layout='horizontal'/>
        </Plot>
    )
}

export default MagDurChart;