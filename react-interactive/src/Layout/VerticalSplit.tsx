// ******************************************************************************************************
//  VerticalSplit.tsx - Gbtc
//
//  Copyright © 2022, Grid Protection Alliance.  All Rights Reserved.
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
//  12/25/2022 - Christoph Lackner
//       Generated original version of source code.
// ******************************************************************************************************

import { LeftArrow, RightArrow, SVGIcons } from '@gpa-gemstone/gpa-symbols';
import * as React from 'react';
import { number } from 'yargs';
import SplitDrawer from './SplitDrawer';
import SplitSection from './SplitSection';

interface IProps {
    style?: any,
    sliderStyle?: any,
}

// Props Description:
// style => style of the encompasing div

const VerticalSplit: React.FunctionComponent<IProps> = (props) => {
    const divRef = React.useRef<any>(null);

    const [currentWidth, setCurrentWidth] = React.useState<number>(0);
    const [sections, setSections] = React.useState<React.ReactElement<any>[]>([]);
    const [width, setWidth] = React.useState<number[]>([]);

    const [LeftDrawer, setLeftDrawer] = React.useState<React.ReactElement<any>[]>([]);
    const [LeftDrawerWidth, setLeftDrawerWidth] = React.useState<number[]>([]);

    const [activeSlider, setActiveSlider] = React.useState<number>(-1);
    const [sliderOriginal, setSliderOriginal] = React.useState<number>(0);

    React.useLayoutEffect(() => {
        setCurrentWidth(divRef.current.offsetWidth ?? 0);
    })

    React.useEffect(() => {
      
        setSections(React.Children.map(props.children,(child) => {
            if (!React.isValidElement(child))
                return null;
            if ((child as React.ReactElement<any>).type === SplitSection)
                return (child as React.ReactElement<any>)
            else
                return null 

        })?.filter(item => item !== null) ?? []);

        setLeftDrawer(React.Children.map(props.children,(child) => {
            if (!React.isValidElement(child))
                return null;
            if ((child as React.ReactElement<any>).type === SplitDrawer)
                return (child as React.ReactElement<any>)
            else
                return null 

        })?.filter(item => item !== null) ?? []);

    }, [props.children])

    React.useEffect(() => {
            setLeftDrawerWidth((w) => {
                let wupdated: number[] = [...w];
                
                if (w.length > LeftDrawer.length)
                    wupdated = w.slice(undefined,LeftDrawer.length);
                if (w.length < LeftDrawer.length)
                    wupdated = [...w,...LeftDrawer.slice(w.length,undefined).map((s) => (s.props as any).open ? (s.props as any).width as number : 0)];
                
                return wupdated.map((wupdatedWidth,index) => {
                    if (wupdatedWidth === 0)
                        return 0;
                    if (wupdatedWidth < (LeftDrawer[index].props as any).minWidth)
                        return (LeftDrawer[index].props as any).minWidth as number
                    if (wupdatedWidth > (LeftDrawer[index].props as any).maxWidth)
                        return (LeftDrawer[index].props as any).maxWidth as number
                    return wupdatedWidth;
                }) })
    },[ LeftDrawer ])

    React.useEffect(() => {
        setWidth((w) => {
            let wupdated: number[] = [...w];

            if (w.length > sections.length)
                wupdated = w.slice(undefined,sections.length);
            if (w.length < sections.length)
                wupdated = [...w,...sections.slice(w.length,undefined).map((s) => (s.props as any).width as number)];
            
            return wupdated.map((wupdatedWidth,index) => {
                if (wupdatedWidth < (sections[index].props as any).minWidth)
                    return (sections[index].props as any).minWidth as number
                if (wupdatedWidth > (sections[index].props as any).maxWidth)
                    return (sections[index].props as any).maxWidth as number
                return wupdatedWidth;
            }) });

    },[ sections ])

    function CreateSegments() {
        const result: any[] = [];
        const reduction = (sections.length - 1) * 5 + (LeftDrawer.length > 0 ? 20 : 0) + LeftDrawer.reduce((acc, d,index) => acc + LeftDrawerWidth[index] > 0? 1 : 0,0)*5;
        const totalPercentage = sections.reduce((acc,child) => acc + child.props.width,0) + LeftDrawer.reduce((acc, d, index) => acc + LeftDrawerWidth[index] > 0?  d.props.width : 0,0);
        const scaling = (currentWidth - reduction)/totalPercentage;

        let hasAddedSection = false;
        LeftDrawer.forEach((draw, index) => {
            const w = Math.floor(scaling* LeftDrawerWidth[index])
            if (hasAddedSection && LeftDrawerWidth[index] > 0)
                result.push(<VerticalSplitDivider style={props.sliderStyle} onClick={(x) => { setSliderOriginal(x); setActiveSlider(index-1)}} key={'split-'+draw.key} />);
            if (LeftDrawerWidth[index] > 0)
            {
                result.push(<div style={{width: isNaN(w)? 0 : w, float: 'left', minHeight: 1}} key={'sec-'+draw.key}>{draw}</div>);
                hasAddedSection = true;
            }

        });

        sections.forEach((sec, index) => {
            const w = Math.floor(scaling* width[index]);
            if (hasAddedSection)
                result.push(<VerticalSplitDivider style={props.sliderStyle} onClick={(x) => { setSliderOriginal(x); setActiveSlider(LeftDrawer.length + index-1)}} key={'split-'+sec.key} />);
            result.push(<div style={{width: isNaN(w)? 0 : w, float: 'left', minHeight: 1}} key={'sec-'+sec.key}>{sec}</div>)
            hasAddedSection = true;
        })

        return result;
    }

    function MouseMove(evt: any)  {
        if (activeSlider < 0)
            return;

        // compute ammount moved
        const deltaX = evt.clientX - sliderOriginal;
        setSliderOriginal(evt.clientX);
        const reduction = (sections.length - 1) * 5 + (LeftDrawer.length > 0 ? 20 : 0) + LeftDrawer.reduce((acc, d,index) => acc + LeftDrawerWidth[index] > 0? 1 : 0,0)*5;
       
        const availableWidth = currentWidth - reduction;
        const totalPercentage = sections.reduce((acc,child) => acc + child.props.width,0) + LeftDrawer.reduce((acc, d, index) => acc + LeftDrawerWidth[index] > 0?  d.props.width : 0,0);
        const scale = totalPercentage/availableWidth;
        const dPercent = deltaX* scale;

        const isLeftDrawer = activeSlider < LeftDrawer.length;
        const isRightDrawer = activeSlider < (LeftDrawer.length-1);

        let indexLeft = (isLeftDrawer? activeSlider : activeSlider - LeftDrawer.length);
        const indexRight = (isRightDrawer === isLeftDrawer? (indexLeft + 1) : 0);

        while (isLeftDrawer && LeftDrawerWidth[indexLeft] === 0)
            indexLeft = indexLeft -1;
            
        const newLeft = Math.floor((isLeftDrawer? LeftDrawerWidth[indexLeft] : width[indexLeft]) + dPercent);
        const newRight = Math.floor((isRightDrawer? LeftDrawerWidth[indexRight] : width[indexRight]) - dPercent);

        const leftMin = (isLeftDrawer? LeftDrawer[indexLeft].props : sections[indexLeft].props).minWidth;
        const leftMx = (isLeftDrawer? LeftDrawer[indexLeft].props : sections[indexLeft].props).maxWidth;
        const rightMin = (isRightDrawer? LeftDrawer[indexRight].props : sections[indexRight].props).minWidth;
        const rightMx = (isRightDrawer? LeftDrawer[indexRight].props : sections[indexRight].props).maxWidth;

        let valid = (newLeft > leftMin) && (newLeft < leftMx);
        valid = valid && (newRight > rightMin) && (newRight < rightMx);

        if (!valid)
           return;

        setLeftDrawerWidth((w) => {
            const wupdated = [...w];
            if (isLeftDrawer)
                wupdated[indexLeft] = newLeft;
            if (isRightDrawer)
                wupdated[indexRight] = newRight;
            return wupdated;
        });
        setWidth((w) => {
            const wupdated = [...w];
            if (!isLeftDrawer)
                wupdated[indexLeft] = newLeft;
            if (!isRightDrawer)
                wupdated[indexRight] = newRight;
            return wupdated;
        });
    }

    function ToggleDrawer(index: number, drawerWidth: number) {
        if (LeftDrawerWidth[index] === 0)
            setLeftDrawerWidth(s => {const u = [...s]; u[index] = drawerWidth; return u;});
        else
            setLeftDrawerWidth(s => {const u = [...s]; u[index] = 0; return u;})
    }

    return (
        <div style={{...props.style}} ref={divRef} onMouseUp={() => setActiveSlider(-1)} onMouseMove={MouseMove} onMouseLeave={() => setActiveSlider(-1)}>
            {LeftDrawer.length > 0? <div style={{float: 'left', background: '#6c757d', height: '100%', width: 20}}> 
            {LeftDrawer.map((d,index) => <DrawerHeader height={100.0/LeftDrawer.length} title={d.props.title} open={LeftDrawerWidth[index] > 0} 
                onClick={() => ToggleDrawer(index,d.props.width as number)} key={d.key}/>)}
            </div> : null} 
            {CreateSegments()}
        </div>
    )
}

export default VerticalSplit;

interface IDividerProps {
    style?: any,
    onClick: (position: number) => void
}
const VerticalSplitDivider: React.FunctionComponent<IDividerProps> = (props) => {

    const style = props.style == undefined? {float: 'left', background: '#6c757d', cursor: 'col-resize'} : props.style;

    return <div style={{width: 5, height: '100%', ...style}} onMouseDown={(evt: any) => props.onClick(evt.clientX)}></div>
}

const DrawerHeader: React.FunctionComponent<{height: number, title: string, onClick: () => void, open: boolean}> = (props) => {

    return <div style={{float: 'left', background: '#f8f9fa', cursor: 'pointer', width: 20, height: props.height + '%', writingMode: 'vertical-rl', textOrientation: 'upright'}}
     onMouseDown={(evt: any) => {props.onClick();}}>
        {props.open? SVGIcons.ArrowBackward : SVGIcons.ArrowForward}
        <span style={{margin: 'auto'}}>{props.title}</span>
     </div>
}
