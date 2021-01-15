// ******************************************************************************************************
//  ToolTip.tsx - Gbtc
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
//  01/14/2021 - Christoph Lackner
//       Generated original version of source code.
// ******************************************************************************************************

import * as React from 'react';
import Modal from './Modal';
import styled, {css} from "styled-components";
interface IProps {
    Show: boolean,
	  Position?: ('top'|'bottom'|'left'|'right'),
    Theme?: ('dark'|'light')

}

interface IWrapperProps {
  Show: boolean,
  Theme: ('dark'|'light'),
  Top: number,
  Left: number
}
// The other element needs to be labeld as data-tooltip that will only be used for positioning
// For now we will grab the first element matching data-tooltip
const WrapperDiv = styled.div<IWrapperProps>`
  & {
    border-radius: 3px;
    display: inline-block;
    font-size: 13px;
    padding: 8px 21px;
    position: fixed;
    pointer-events: none;
    transition: opacity 0.3s ease-out;
    z-index: 2000;
    opacity: ${props => props.Show ? "0.9" : "0"};
    color: ${props => (props.Theme == 'dark' ? "#fff" :'#222')};
    background: ${props => (props.Theme == 'dark' ? "#222" :'#fff')};
    top: ${props => `${props.Top}px`};
    left: ${props => `${props.Left}px`};
    border: 1px solid transparent;
  }
   &::before {
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-top: 8px solid ${props => (props.Theme == 'dark' ? "#222" :'#fff')};
    bottom: -6px;
    left: 50%;
    margin-left: -8px;
    content: "";
   }
`;

//border: 'transparent';
//arrow: ${props => props.Theme == 'dark' ? "#222" :'#fff'};

const ToolTip: React.FunctionComponent<IProps> = (props) => {
  const [top, setTop] = React.useState<number>(0);
  const [left, setLeft] = React.useState<number>(0);
  const [guid, setGuid] = React.useState<string>("");

  React.useEffect(() => {
    setGuid(CreateGuid());
  }, []);

  React.useLayoutEffect(() => {
    const [t,l] = UpdatePosition();

    if (t != top)
      setTop(t);
    if (l != left)
        setLeft(l);

  })

  function UpdatePosition() {
    let target = getNodeByAttr("[data-tooltip]");

    if (target.length == 0)
      return [-999,-999];
    let targetLocation = getDimensions(target[0]);

    let toolTip = document.getElementById(guid);

    if (toolTip == null)
      return [-999,-999];
    let tipLocation = getDimensions(toolTip);

    const offset = 10;

    let result: [number,number] = [0,0];

    if (props.Position == 'left') {
      result[0] = targetLocation.top + 0.5*targetLocation.height - 0.5*tipLocation.height;
      result[1] = targetLocation.left - tipLocation.width - offset;
    }
    else if (props.Position == 'right') {
      result[0] = targetLocation.top + 0.5*targetLocation.height - 0.5*tipLocation.height
      result[1] = targetLocation.left + targetLocation.width + offset;
    }
    else if (props.Position == 'top') {
      result[0] = targetLocation.top - tipLocation.height - offset;
      result[1] = targetLocation.left + 0.5* targetLocation.width - 0.5* tipLocation.width;
    }
    else if (props.Position == 'bottom') {
      result[0] = targetLocation.top + targetLocation.height + offset;
      result[1] = targetLocation.left + 0.5* targetLocation.width - 0.5* tipLocation.width;
    }

    return result;
  }

  let theme = (props.Theme == undefined? 'dark' : props.Theme);
  // This will move to helper eventually but I need to add that later
  function CreateGuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
  }
    return (
      <WrapperDiv Show={props.Show} Theme={theme} Top={top} Left={left} id={guid}>
        {props.children}
      </WrapperDiv>
    )
}

const getDimensions = (node: any) => {
  const { height, width, top, left } = node.getBoundingClientRect();
  return {
    height: parseInt(height, 10),
    width: parseInt(width, 10),
    top: parseInt(top, 10),
    left: parseInt(left, 10),
  };
};

const getNodeByAttr = (attr: string) => {
  let nodeArray = document.querySelectorAll(attr);
  return nodeArray;
}


export default ToolTip;
