// ******************************************************************************************************
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
//  03/19/2021 - C. lackner
//       Generated original version of source code.
//
// ******************************************************************************************************

import * as React from 'react';
import {GraphContext} from './GraphContext'
import {GetTextWidth} from '@gpa-gemstone/helper-functions';

interface IProps {
  height: number,
  width: number,
  location: 'bottom'|'right',
  setHeight: (h: number) => void,
  setWidth: (w: number) => void,
  graphHeight: number,
  graphWidth: number,
}

function Legend(props: IProps) {
  const context = React.useContext(GraphContext)

  React.useLayoutEffect(() => {

       const hLegendEntry = 20;
       const wLegendEntry = 20 + 25;

       let nWidth = [...context.Data.values()].map(item => (item.legend !== undefined ? GetTextWidth("Segoe UI", '1em', item.legend) + wLegendEntry : 0));
       nWidth = nWidth.filter(i => i > 0);

       if (nWidth.length === 0) {
           if (props.height !== 0)
               props.setHeight(0);
           if (props.width !== 0)
               props.setWidth(0);
           return;
       }

       if (props.location === 'bottom') {
           if (props.width !== props.graphWidth)
               props.setWidth(props.graphWidth)
           let nRow = 1;
           let l = 0;
           let i = 0;
           while (i < nWidth.length) {
               l = l + nWidth[i];
               if (l > props.graphWidth) {
                   nRow = nRow + 1;
                   l = 0;
               }
               i = i + 1;
           }
           if (props.height !== (nRow * hLegendEntry))
               props.setHeight(nRow * hLegendEntry)
       }
       if (props.location === 'right') {
           if (props.height !== props.graphHeight)
               props.setHeight(props.graphHeight);
           const wCol = Math.max(...nWidth);
           const nCol = Math.ceil(nWidth.length / (props.graphHeight / hLegendEntry));
           if (props.width !== (nCol * wCol))
               props.setWidth(nCol * wCol);
       }

   });

    return (
      <div style={{ height: props.height, width: props.width, position: 'relative', display: 'flex' }}>
        {[...context.Data.values()].map((series, index) => (series.legend !== undefined ?
              <div key={index} style={{ display: 'flex', alignItems: 'center', marginRight: '20px' }} onClick={(series.legendClick === undefined ? () => undefined: () => series.legendClick!())}>
                  {(series.lineStyle === '-' ?
                      <div style={{ width: ' 10px', height: 0, borderTop: '2px solid', borderRight: '10px solid', borderBottom: '2px solid', borderLeft: '10px solid', borderColor: series.color, overflow: 'hidden', marginRight: '5px', opacity: series.legendOpacity }}></div> :
                      <div style={{ width: ' 10px', height: '4px', borderTop: '0px solid', borderRight: '3px solid', borderBottom: '0px solid', borderLeft: '3px solid', borderColor: series.color, overflow: 'hidden', marginRight: '5px', opacity: series.legendOpacity }}></div>)}
                  <label style={{ marginTop: '0.5rem' }}> {series.legend}</label>
          </div> : null))}
      </div>)
}

export default Legend;
