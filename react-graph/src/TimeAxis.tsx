// ******************************************************************************************************
//  TimeAxis.tsx - Gbtc
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
import {GraphContext} from './GraphContext'
import * as moment from 'moment';
import {GetTextHeight} from '@gpa-gemstone/helper-functions';

export interface IProps {
  offsetLeft: number,
  offsetRight: number,
  offsetBottom: number,
  heightAxis: number,
  height: number
  width: number,
  setHeight: (h: number) => void,
  label?: string,
  showTicks?: boolean
}

const msPerSecond = 1000.00;
const msPerMinute = msPerSecond* 60.0;
const msPerHour = msPerMinute* 60.0;
const msPerDay = msPerHour* 24.0;
const msPerYear = msPerDay* 365;

type TimeStep = ('y'|'M'|'w'|'d'|'h'|'m'|'s'|'ms');

function TimeAxis(props: IProps) {
    /*
      Used on bottom of Plot.
    */
    const context = React.useContext(GraphContext)
    const [tick,setTick] = React.useState<number[]>([]);
    const [hLabel, setHlabel] = React.useState<number>(0);
    const [hAxis, setHAxis] = React.useState<number>(0);
    const [tFormat, setTformat] = React.useState<string>('YYYY');

    // Adjust space for X Axis labels
    React.useEffect(() => {
      const dX =  (props.label !== undefined? GetTextHeight("Segoe UI", '1em', props.label + GetUnitLabel()) : 0);
      setHlabel(dX)
    }, [tick,props.label,tFormat]);

    // Adjust space for X Tick labels
    React.useEffect(() => {
      let dX = Math.max(...tick.map(t => GetTextHeight("Segoe UI", '1em', formatTS(t))));
      dX = (isFinite(dX) ? dX : 0) + 4
      setHAxis(dX);
    },[tick,tFormat]);

    React.useEffect(()=> {
      if (hAxis + hLabel !== props.heightAxis)
        props.setHeight(hAxis + hLabel);
    }, [hAxis,hLabel, props.heightAxis, props.setHeight])

    React.useEffect(() => {
      const deltaT = context.XDomain[1] - context.XDomain[0];
      if (deltaT === 0)
        return;

      let format = 'YYYY'
      if (deltaT < msPerYear*15 && deltaT >= msPerYear)
        format = 'MM YY';
      if (deltaT < msPerYear && deltaT >= 30 * msPerDay)
        format = 'MM/DD';
      if (deltaT < 30 * msPerDay && deltaT >=  2* msPerDay)
        format = 'MM/DD hh';
      if (deltaT < 2* msPerDay && deltaT >=  30* msPerHour)
        format = 'hh';
      if (deltaT < 30* msPerHour && deltaT >=  msPerHour)
        format = 'hh:mm';
      if (deltaT < msPerHour && deltaT >=  30* msPerMinute)
        format = 'mm';
      if (deltaT < 30* msPerMinute && deltaT >=   msPerMinute)
        format = 'mm:ss';
      if (deltaT < 30*msPerSecond && deltaT >=  msPerSecond)
        format = 'ss.SS';
      if (deltaT < msPerSecond)
        format = 'SSS';

      const Tstart = moment(context.XDomain[0]);
      const Tend = moment(context.XDomain[1]);
      const step = 10;
      const stepType: TimeStep = 'y'


      const newTicks = [Tstart.add(step, stepType)];
      while (newTicks[newTicks.length - 1] < Tend)
        newTicks.push(newTicks[newTicks.length - 1].clone().add(step, stepType));


      newTicks.pop();

      setTick(newTicks.map(t => t.valueOf()));

      setTformat(format);
    }, [context.XDomain]);

    function GetUnitLabel(): string {
      if (tFormat === 'SSS')
        return " (ms)";
      if (tFormat === 'ss.SS')
        return " (sec)";
      if (tFormat === 'mm:sss')
        return " (min:sec)";
      if (tFormat === 'mm')
        return " (min)";
      if (tFormat === 'hh:mm')
        return " (hour:min)";
      if (tFormat === 'hh')
        return " (hour)"
      if (tFormat === 'MM/DD hh')
        return " (month/day hour)"
      if (tFormat === 'MM/DD')
        return " (month/day)"

      return ""

    }

    function formatTS(t: number): string {
      const TS = moment(t);
      return TS.format(tFormat);
    }

    return (<g>
     <path stroke='black' style={{ strokeWidth: 1 }} d={`M ${props.offsetLeft - 8} ${props.height - props.offsetBottom} H ${props.width - props.offsetRight}`} />
     <path stroke='black' style={{ strokeWidth: 1 }} d={`M ${props.width - props.offsetRight} ${props.height - props.offsetBottom} v ${8}`} />
     {props.showTicks === undefined || props.showTicks ?
         <>
             {tick.map((l, i) => <path key={i} stroke='black' style={{ strokeWidth: 1, transition: 'd 0.5s' }} d={`M ${l * context.XScale + context.XOffset} ${props.height - props.offsetBottom + 6} v ${-6}`} />)}
             {tick.map((l, i) => <text fill={'black'} key={i} style={{ fontSize: '1em', textAnchor: 'middle', dominantBaseline: 'hanging', transition: 'x 0.5s, y 0.5s' }} y={props.height - props.offsetBottom + 8} x={l * context.XScale + context.XOffset}>{formatTS(l)}</text>)}
         </>
         : null}
     {props.label !== undefined? <text fill={'black'} style={{ fontSize: '1em', textAnchor: 'middle', dominantBaseline: 'middle' }} x={props.offsetLeft + (( props.width- props.offsetLeft - props.offsetRight) / 2)}
      y={props.height = props.offsetBottom + hAxis}>{props.label + GetUnitLabel()}</text> : null}

    </g>)
}


export default TimeAxis;
