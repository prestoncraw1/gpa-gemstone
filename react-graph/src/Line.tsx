// ******************************************************************************************************
//  Line.tsx - Gbtc
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
import {IDataSeries, GraphContext, LineStyle} from './GraphContext';
import * as moment from 'moment';
import {PointNode} from './PointNode';


export interface IProps {
    showPoints?: boolean,
    legend?: string,
    highlightHover?: boolean,
    data: [number, number][],
    color: string,
    lineStyle: LineStyle,
}

function Line(props: IProps) {
  /*
    Single Line with ability to turn off and on.
  */
  const [guid, setGuid] = React.useState<string>("");
  const [highlight, setHighlight] = React.useState<[number, number]>([NaN,NaN]);
  const [enabled, setEnabled] = React.useState<boolean>(true);
  const [data, setData] = React.useState<PointNode|null>(null);
  const context = React.useContext(GraphContext)

   React.useEffect(() => {
       if (guid === "")
           return;

       context.UpdateData(guid, {
           color: props.color,
           lineStyle: props.lineStyle,
           legend: props.legend,
           getMax: (t) => (data == null? NaN : data.GetLimits(t[0],t[1])[1]) ,
           getMin: (t) => (data == null? NaN : data.GetLimits(t[0],t[1])[0]),
           legendClick: () => { setEnabled((e) => !e); },
           legendOpacity: 1
       } as IDataSeries)
   }, [props, data])

   React.useEffect(() => {
       if (props.data.length === 0 || isNaN(context.XHover) || data === null)
           setHighlight([NaN, NaN]);
       else
           setHighlight(data.GetPoint(context.XHover));

   }, [data, context.XHover])

   React.useEffect(() => {
      setData(new PointNode(props.data));
   },[props.data]);

   React.useEffect(() => {
       if (guid === "")
           return;
       if (isNaN(highlight[0]) || isNaN(highlight[1]))
           context.SetLegend(guid, props.legend, (enabled ? 1 : 0.5));
       else
           context.SetLegend(guid, props.legend + ` (${moment(highlight[0]).format('MM/DD/YY hh:mm:ss')}: ${highlight[1]> 0? ' ': ''}${highlight[1].toPrecision(6)})`, (enabled? 1: 0.5))
   }, [highlight, enabled]);

   React.useEffect(() => {
       setGuid(context.AddData({
           color: props.color,
           lineStyle: props.lineStyle,
           legend: props.legend,
           getMax: (t) => (data == null? NaN : data.GetLimits(t[0],t[1])[1]) ,
           getMin: (t) => (data == null? NaN : data.GetLimits(t[0],t[1])[0]),
           legendClick: () => { setEnabled((e) => !e); },
           legendOpacity: 1
       }))
       return () => { context.RemoveData(guid) }
   }, []);


   function generateData() {
       let result = "M ";
       if (data == null)
        return ""
     result = result + data!.GetFullData().map((pt, _) => {
           const x = pt[0] * context.XScale + context.XOffset;
           const y = pt[1] * context.YScale + context.YOffset;

           return `${x},${y}`
       }).join(" L ")

       return result
   }


   return (
       enabled?
       <g>
           <path d={generateData()} style={{ fill: 'none', strokeWidth: 3, stroke: props.color, transition: 'd 0.5s' }} />
           {data != null? data.GetFullData().map((pt, i) => <circle key={i} r={3} cx={pt[0] * context.XScale + context.XOffset} cy={pt[1] * context.YScale + context.YOffset} fill={props.color} stroke={'black'} style={{ opacity: 0.8, transition: 'cx 0.5s,cy 0.5s' }} />) : null}
          {props.highlightHover && !isNaN(highlight[0]) && !isNaN(highlight[1])?
          <circle r={5} cx={highlight[0] * context.XScale + context.XOffset} cy={highlight[1] * context.YScale + context.YOffset} fill={props.color} stroke={'black'} style={{ opacity: 0.8, transition: 'cx 0.5s,cy 0.5s' }} /> : null}
       </g > : null
   );
}


export default Line;
