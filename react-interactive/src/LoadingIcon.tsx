// ******************************************************************************************************
//  LoadingIcon.tsx - Gbtc
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
//  01/11/2020 - Christoph Lackner
//       Generated original version of source code.
// ******************************************************************************************************

import * as React from 'react';
import styled, { keyframes, css} from "styled-components";

interface IProps {
    Show: boolean,
    Label?: string,
    Center?: boolean,
    Height?: number|string,
    Width?: number|string
}

const spin = keyframes`
 0% { transform: rotate(0deg); }
 100% { transform: rotate(360deg); }
`;



const LoadingIcon: React.FunctionComponent<IProps> = (props) => {

const h = (props.Height === undefined? '25px': props.Height);
const w = (props.Width === undefined? '25px': props.Width);

  const Icon = styled.div`
animation: ${spin} 1s linear infinite;
border: 5px solid #f3f3f3;
border-Top: 5px solid #555;
border-Radius: 50%;
width: ${w};
height: ${h}
`;

  const center = (props.Center === undefined? false : props.Center);
    return (
      <div>
          <div style={{ width: (props.Label === undefined? w: undefined), margin: 'auto' }} hidden={!props.Show}>
              <Icon/>
              {props.Label !== undefined? <span>{props.Label}</span> : null}
          </div>
      </div>
    )
}

export default LoadingIcon;
