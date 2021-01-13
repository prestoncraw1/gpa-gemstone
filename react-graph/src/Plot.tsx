//******************************************************************************************************
//  Plot.tsx - Gbtc
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
//  12/30/2020 - Billy Ernest
//       Generated original version of source code.
//
//******************************************************************************************************
import { useSelector, useDispatch } from 'react-redux';
import { ResetZoom as yResetZoom, SelectYAxesReset, Drag as yDrag, Zoom as yZoom } from './Store/YAxisSlice';
import { ResetZoom as xResetZoom, SelectXAxesReset, Drag as xDrag, Zoom as xZoom } from './Store/XAxisSlice';

import React, { FunctionComponent } from 'react';
import { Provider } from 'react-redux';
import store from './Store/Store';

import { ScaleLinear, ScaleLogarithmic, ScaleOrdinal, dispatch} from 'd3';
import XAxis from './XAxis';
import YAxis from './YAxis';


export interface Point {
    EventID: number,
    Magnitude: number,
    Duration: number
}


interface Props {
    children?: JSX.Element | JSX.Element[],
    Width: number,
    Height: number,
    Zoom?: boolean,
    Drag?: boolean,
    Margin: { top: number, right: number, bottom: number, left: number}
}
export type AxisType = 'DateTime' | 'Linear' | 'Log' | 'Ordinal';
export interface AxisMap {
    ID: string,
    Domain: any[],
    Type: AxisType,
    Range: any[],
    Start: number,
    End: number,
    Scale?: ScaleLinear<number, number> | ScaleLogarithmic<number, number> | ScaleOrdinal<string, any>
}


const SvgStyle: React.CSSProperties = {
    fill: 'none',
    shapeRendering: 'crispEdges',
    userSelect: 'none',
    WebkitTouchCallout: 'none',
    WebkitUserSelect: 'none',
    KhtmlUserSelect: 'none',
    MozUserSelect: 'none',
    msUserSelect: 'none'
};
const PlotContext = React.createContext({
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
    svgWidth: 0,
    svgHeight: 0,
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
});

const Plot: FunctionComponent<Props> = (props) => {
    const svgWidth = props.Width - props.Margin.left - props.Margin.right;
    const svgHeight = props.Height - props.Margin.top - props.Margin.bottom;


    let value = {
        margin: props.Margin,
        svgWidth: svgWidth,
        svgHeight: svgHeight,
        top: props.Margin.top,
        bottom: svgHeight,
        left: props.Margin.left,
        right: svgWidth + props.Margin.left,
    };



    return (
        <PlotContext.Provider value={value}>
            <Provider store={store}>
                <div style={{ height: props.Height, width: props.Width, position: 'relative' }}>
                    <ResetButton />
                    <Graph {...props}/>
                </div>
            </Provider>
        </PlotContext.Provider>
    )
}

const Graph = (props: Props) => {
    const ref = React.useRef(null);
    const dispatch = useDispatch();
    const { svgWidth, svgHeight, top, left, right, bottom, margin } = React.useContext(PlotContext);

    function handleZoom(evt) {
        if (!props.Zoom) return;
        console.log(evt);
        let multiplier = 1.25;

        // event.deltaY positive is wheel down or out and negative is wheel up or in
        if (evt.deltaY < 0) multiplier = 0.75;

        dispatch(yZoom({ Point: evt.nativeEvent.offsetY, Multiplier: multiplier }));
        dispatch(xZoom({ Point: evt.nativeEvent.offsetX, Multiplier: multiplier }));

    }

    function handleDrag(evt) {
        if (!props.Drag) return;
        evt.preventDefault();

        if (evt.nativeEvent.offsetX < props.Margin.left || evt.nativeEvent.offsetX > svgWidth + props.Margin.left) return;
        if (evt.nativeEvent.offsetY < props.Margin.top || evt.nativeEvent.offsetY > svgHeight + props.Margin.top) return;

        evt.persist();
        let timeout = null;

        ref.current.onmousemove = (e) => {
           
            if (timeout) clearTimeout(timeout);
            timeout = setTimeout(() => {
                //console.log(e)
                dispatch(yDrag({ Click: evt.nativeEvent.offsetY / 2, Drag: e.offsetY/2 }));
                dispatch(xDrag({ Click: evt.nativeEvent.offsetX / 2, Drag: e.offsetX/2 }));
            }, 8);
        };
    }

    function stopDrag(evt) {
        if (!props.Drag) return;

        evt.preventDefault();
        ref.current.onmousemove = null;
    }

    function XAxisNotExists(): boolean {
        if (props.children === undefined) return true;
        else if ((props.children as JSX.Element[]).length === undefined) {
            if ((props.children as JSX.Element).type.name !== 'XAxis') return true;
            else return false;
        }
        else if ((props.children as JSX.Element[]).find(a => a.type.name == 'XAxis').type.name !== 'XAxis') return true;
        else return false;
    }

    return (
        <svg ref={ref} width={props.Width} height={props.Height} style={SvgStyle} onWheel={handleZoom} onMouseDown={handleDrag} onMouseUp={stopDrag}>

            {/* Draw white rectangles around the border so data won't show outside chart */}
            <rect x={0} y={0} width={props.Width} height={props.Margin.top} fill='white' stroke='white' />
            <rect x={0} y={props.Height - props.Margin.bottom - props.Margin.top} width={props.Width} height={props.Margin.bottom + props.Margin.top} fill='white' stroke='white' />
            <rect x={0} y={0} width={props.Margin.left} height={props.Height} fill='white' stroke='white' />
            <rect x={props.Width - props.Margin.right} y={0} width={props.Margin.right} height={props.Height} fill='white' stroke='white' />
            {/* Chart borders */}
            <path stroke='black' d={`M ${props.Margin.left} ${props.Margin.top} H ${svgWidth + props.Margin.left} V ${svgHeight} H ${props.Margin.left} V ${props.Margin.top}`} />


            {
                XAxisNotExists() ?
                    <XAxis Label='' Type='Linear' TickNumber={10}>{props.children}</XAxis>
                    : props.children
            }
        </svg>

    );
}

const ResetButton = () => {
    const dispatch = useDispatch();
    const xHideReset = useSelector(SelectXAxesReset);
    const yHideReset = useSelector(SelectYAxesReset);


    return (
        <button style={{ position: 'absolute', top: 20, right: 25, opacity: 0.5 }} className="btn" onClick={() => {
            dispatch(yResetZoom());
            dispatch(xResetZoom());

        }} hidden={xHideReset && yHideReset}>Reset</button>
    );
}

export default Plot;
export { PlotContext };