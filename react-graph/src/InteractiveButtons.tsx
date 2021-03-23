// ******************************************************************************************************
//  InteractiveButtons.tsx - Gbtc
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
import {MagnifyingGlass, House, FourWayArrow} from '@gpa-gemstone/gpa-symbols'

interface IProps {
    showZoom: boolean,
    showPan: boolean,
    showReset: boolean,
    currentSelection: 'zoom'|'pan',
    setSelection: (selection: 'zoom'|'pan'|'reset') => void,
    x: number,
    y: number
}

type ButtonType = ('zoom' | 'pan' | 'reset');

function InteractiveButtons(props: IProps) {
    /*
      Used to select Zoom, Drag or Reset
    */
    const [expand, setExpand] = React.useState<boolean>(false);

    const nButtons = (props.showZoom? 1 : 0) + (props.showPan? 1 : 0) + (props.showReset? 1 : 0);

    function openTray(evt: React.MouseEvent): void {
      evt.stopPropagation();
      setExpand(true);
    }

    if (nButtons === 0)
      return null;

    if (nButtons === 1 || !expand)
      return (
        <g>
          <circle stroke={'black'}
            onClick={openTray}
            r={10} cx={props.x} cy={props.y}
            style={{ fill: '#002eff', pointerEvents: 'all' }}
            onMouseDown={(evt) => evt.stopPropagation()}
            onMouseUp={(evt) => evt.stopPropagation()} />
          <text fill={'black'} style={{ fontSize: '1em', textAnchor: 'middle', dominantBaseline: 'middle' }} x={props.x} y={props.y}>
            {props.currentSelection === 'zoom' ? MagnifyingGlass : props.currentSelection === 'pan'? FourWayArrow : House}
          </text>
        </g>)

    const width = 25*nButtons - 25;
    const symbols = [] as ButtonType[];
    if (props.showZoom)
      symbols.push('zoom' as ButtonType);
    if (props.showPan)
      symbols.push('pan' as ButtonType);
    if (props.showReset)
      symbols.push('reset' as ButtonType);

    return (
     <g>
         <path d={`M ${props.x} ${props.y - 10} A 10 10 180 0 1 ${props.x} ${props.y + 10} h -${width} A 10 10 180 0 1 ${props.x - width} ${props.y - 10} h ${width}`} style={{
             fill: '#1e90ff'}} />
          {symbols.map((s,i) => <Button key={i} symbol={s} x={props.x - i*25} y={props.y} active={props.currentSelection === s} onClick={() => {props.setSelection(s); setExpand(false) }}/>)}

         <path d={`M ${props.x} ${props.y - 10} A 10 10 180 0 1 ${props.x} ${props.y + 10} h -${width} A 10 10 180 0 1 ${props.x - width} ${props.y - 10} h ${width}`} stroke={'black'} />
     </g>)

}

function Button(props: {symbol: ButtonType, x: number, y: number, active: boolean, onClick: () => void}) {
  return ( <>
    <circle r={10} cx={props.x} cy={props.y} style={{ fill: (props.active ? '#002eff' : '#1e90ff'), pointerEvents: 'all' }}
     onMouseDown={(evt) => evt.stopPropagation()}
     onClick={(evt) => { evt.stopPropagation(); props.onClick()}} onMouseUp={(evt) => evt.stopPropagation()}/>
    <text fill={'black'} style={{ fontSize: '1em', textAnchor: 'middle', dominantBaseline: 'middle' }} x={props.x} y={props.y}>
    {props.symbol === 'zoom' ? MagnifyingGlass : props.symbol === 'pan'? FourWayArrow : House}
    </text>
  </>)
}

export default InteractiveButtons;
