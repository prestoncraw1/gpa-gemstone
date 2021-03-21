// ******************************************************************************************************
//  ValueAxis.tsx - Gbtc
//
//  Copyright © 2021, Grid Protection Alliance.  All Rights Reserved.
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
//  03/19/2021 - C. lackner
//       Generated original version of source code.
//
// ******************************************************************************************************

import * as React from 'react';
import {GraphContext} from './GraphContext'
import {GetTextHeight, GetTextWidth} from '@gpa-gemstone/helper-functions';

interface IProps {
  hAxis: number,
  hFactor: number,
  setHeightFactor: (h:number) => void,
  setWidthAxis: (w: number) => void,
  offsetTop: number,
  offsetBottom: number,
  offsetLeft: number,
  height: number,
  witdh: number,
  label?: string,
}

function ValueAxis(props: IProps) {
  const context = React.useContext(GraphContext)
  const [tick,setTick] = React.useState<number[]>([]);

  const [hLabel, setHlabel] = React.useState<number>(0);
  // const [ftSizeLabel, setFtSizeLabel] = React.useState<number>(1);
  const [hAxis, setHAxis] = React.useState<number>(0);


  const [nDigits, setNdigits] = React.useState<number>(1);
  const [factor, setFactor] = React.useState<number>(1);

  React.useEffect(() => {

    const dY = context.YDomain[1] - context.YDomain[0];
    if (dY === 0)
        return;

    let exp = 0;
    while ((dY*Math.pow(10,exp)) < 1) {
        exp = exp + 1;
    }
    while ((dY * Math.pow(10, exp)) > 10) {
        exp = exp - 1;
    }

    let scale = 1.0;
    if (dY * Math.pow(10, exp) < 7 && dY * Math.pow(10, exp) >= 4)
        scale = 0.5 / Math.pow(10, exp);
    if (dY * Math.pow(10, exp) < 4 && dY * Math.pow(10, exp) >= 1.2)
        scale = 0.2 / Math.pow(10, exp);
    if (dY * Math.pow(10, exp) < 1.2)
        scale = 0.1 / Math.pow(10, exp);

    const offset = Math.floor(context.YDomain[0]/scale)*scale;

    const newTicks = [offset + scale];
    while (newTicks[newTicks.length - 1] < (context.YDomain[1] - scale))
        newTicks.push(newTicks[newTicks.length - 1] + scale);

    setFactor(Math.pow(10, Math.floor(exp / 3) * 3));
    setTick(newTicks);

    }, [context.YDomain]);

    React.useEffect(() => {
      let dY = context.YDomain[1] - context.YDomain[0];
      dY = dY * factor;
      if (dY > 15)
          setNdigits(0);
      if (dY < 15 && dY >= 1.5)
          setNdigits(1);
      if (dY < 1.5 && dY >= 0.15)
          setNdigits(2);
      if (dY < 0.15)
          setNdigits(3)

    }, [factor, context.YDomain])

    React.useEffect(() => {
      let h = 0;
      if (factor !== 1)
        h = GetTextHeight("Segoe UI", '1em', 'x' + (1/factor).toString());
      if (h !== props.hFactor)
        props.setHeightFactor(h);
    }, [factor, props.hFactor, props.setHeightFactor]);

    React.useEffect(() => {
      if (props.label === undefined) {
        setHlabel(0);
        return;
      }
      const h = GetTextHeight("Segoe UI", '1em', props.label);
      setHlabel(h);
    },[props.label, props.height, props.offsetTop, props.offsetBottom]);

    React.useEffect(() => {
        let dY = Math.max(...tick.map(t => GetTextWidth("Segoe UI", '1em', (t * factor).toFixed(nDigits))));
        dY = (isFinite(dY)? dY : 0) + 4
        if (dY !== hAxis)
            setHAxis(dY);
    },[tick, nDigits])

    React.useEffect(() => {
      if (props.hAxis !== hAxis + hLabel)
        props.setWidthAxis(hAxis + hLabel);

    },[hAxis, hLabel, props.hAxis]);

    return (<g>
      <path stroke='black' style={{ strokeWidth: 1, transition: 'd 0.5s' }} d={`M ${props.offsetLeft} ${props.height - props.offsetBottom + 8} V ${props.offsetTop}`} />
      <path stroke='black' style={{ strokeWidth: 1, transition: 'd 0.5s' }} d={`M ${props.offsetLeft - 8} ${props.offsetTop} h ${8}`} />
      {tick.map((l, i) => <path key={i} stroke='black' style={{ strokeWidth: 1, transition: 'd 1s' }} d={`M ${props.offsetLeft - 6} ${l * context.YScale + context.YOffset} h ${6}`} />)}
      {tick.map((l, i) => <text fill={'black'} key={i} style={{ fontSize: '1em', textAnchor: 'end', dominantBaseline: 'middle', transition: 'x 0.5s, y 0.5s' }} x={props.offsetLeft - 8} y={l * context.YScale + context.YOffset}>{(l * factor).toFixed(nDigits)}</text>)}

      {props.label !== undefined ? <text fill={'black'} style={{ fontSize: '1em', textAnchor: 'middle', dominantBaseline: 'middle' }} transform={`rotate(-90,${props.offsetLeft - hAxis},${(props.offsetTop  - props.offsetBottom + props.witdh)/ 2.0})`} x={props.offsetLeft - hAxis} y={(props.offsetTop  - props.offsetBottom + props.witdh)}>{props.label}</text> : null}
      {factor !== 1 ? <text fill={'black'} style={{ fontSize: '1em' }} x={props.offsetLeft} y={props.offsetTop - 5}>x{1/factor}</text> : null}
    </g>)
}

export default ValueAxis;
