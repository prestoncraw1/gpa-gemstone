//******************************************************************************************************
//  Legend.tsx - Gbtc
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
//  01/07/2021 - Billy Ernest
//       Generated original version of source code.
//
//******************************************************************************************************
import { useSelector, useDispatch } from 'react-redux';
import { Show, SelectLegend, LegendSeries } from './Store/LegendSlice';
import React from 'react';
import { PlotContext } from './Plot';
import { GetTextWidth } from '@gpa-gemstone/helper-functions';

export interface LegendProps {
    Position: 'topleft' | 'topright' | 'bottomright' | 'bottomleft' | 'topcenter' | 'bottomcenter',
    Layout: 'horizontal' | 'vertical',
    ShowLabels?: boolean,
    OnClick?: () => void
}
function Legend(props: LegendProps) {
    const { svgWidth, left, right, top, bottom, margin} = React.useContext(PlotContext);
    const dispatch = useDispatch();
    const legend: LegendSeries[] = useSelector(SelectLegend);

    if (props.Layout === 'horizontal' && 'bottomleft') {
        return (
            <g transform={`translate(${margin.left + 10},${bottom + margin.bottom / 2})`} >
                {legend.map((l, index) => {
                    return (
                        <g
                            key={index}
                            transform={`translate(${(props.ShowLabels === true ? (legend.map(l => l.Width).slice(0, index).length === 0 ? 0 : legend.map(l => l.Width + 30).slice(0, index).reduce((a, b) => a + b)) : index * 20)},${0})`}
                        >
                            <rect
                                stroke='black'
                                style={{ cursor: 'pointer', opacity: (l.Show ? 1 : 0.25) }}
                                width={15}
                                height={15}
                                fill={l.Color}
                                onClick={(event) => {
                                    dispatch(Show({ Index: index, Show: !l.Show }));
                                }}>

                                <title>{l.Label}</title>
                            </rect>
                            {props.ShowLabels === true ? <text fill="black" fontSize="small" y={13} x={20} >{l.Label}</text> : null}
                        </g>
                    )
                })
                }

            </g>


        )
    }
    else {
        return null;
    }
}


export default Legend;