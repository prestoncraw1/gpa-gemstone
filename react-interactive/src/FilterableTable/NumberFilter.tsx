// ******************************************************************************************************
//  NumberFilter.tsx - Gbtc
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
//  03/02/2022 - C Lackner
//       Generated original version of source code.
// ******************************************************************************************************
import * as React from 'react';
import { Search } from '../SearchBar'

interface IProps<T> { 
    SetFilter: (evt: Search.IFilter<T>[]) => void,
    Filter: Search.IFilter<T>[],
    FieldName: string,
}

type FilterType = 'less than' | 'greater than' | 'between' | 'equal to'

export function NumberFilter<T>(props: IProps<T>) {
        const [value, setValue] = React.useState<string>('');
        const [secondValue, setSecondValue] = React.useState<string>('')
        const [operator, setOperator] = React.useState<FilterType>('less than');
    
        React.useEffect(() => {
            if (props.Filter.length === 0) {
                setValue('');
                setSecondValue('');
            }
            if (props.Filter.length > 1) {
                const f1 = props.Filter.find(f => f.Operator === '>' || f.Operator === '>=')
                if (f1 == null)
                    setValue('')
                else
                    setValue(f1.SearchText)
                const f2 = props.Filter.find(f => f.Operator === '<' || f.Operator === '<=')
                if (f2 == null)
                    setSecondValue('')
                else
                    setSecondValue(f2.SearchText)
            }
            if (props.Filter.length === 1) {
                setSecondValue('');
                if (props.Filter[0].Operator === '>' || props.Filter[0].Operator === '>=')
                    setOperator('greater than');
                else if (props.Filter[0].Operator === '=')
                    setOperator('equal to');
                else
                    setOperator('less than');
                setValue(props.Filter[0].SearchText);
            }
        }, [props.Filter])
    
    
        React.useEffect(() => {
            if (value === '' && secondValue === '' && props.Filter.length !== 0)
                props.SetFilter([]);
            if (value === '' && secondValue === '')
                return;
            if (operator === 'between') {
                props.SetFilter([
                    {
                        FieldName: props.FieldName,
                        isPivotColumn: false,
                        Operator: '>=',
                        Type: 'number',
                        SearchText: value
                    },
                    {
                        FieldName: props.FieldName,
                        isPivotColumn: false,
                        Operator: '<=',
                        Type: 'number',
                        SearchText: secondValue
                    }
                ])
            }
            else {
                props.SetFilter([{
                    FieldName: props.FieldName,
                    isPivotColumn: false,
                    Operator: transformSymbol(operator),
                    Type: 'number',
                    SearchText: value
                }])
            }
        }, [operator, value, secondValue])
    
        function transformSymbol(s: FilterType) {
            if (s === 'less than')
                return '<';
            if (s === 'greater than')
                return '>';
            return '='
        }
        return <>
            <tr onClick={(evt) => { evt.preventDefault(); }}>
                <td>
                    <select className='form-control' value={operator} onChange={(evt) => {
                        const v = evt.target.value as FilterType;
                        setOperator(v);
                    }}>
                        <option value='less than'>Less than ({'<'})</option>
                        <option value='equal to'>Equal to (=)</option>
                        <option value='greater than'>Greater than ({'>'})</option>
                        <option value='between'>In range</option>
                    </select>
                </td>
            </tr>
            <tr onClick={(evt) => { evt.preventDefault(); }}>
                <td>
                    <input type={'number'} className='form-control' value={value} onChange={(evt) => {
                        const v = evt.target.value as string;
                        setValue(v);
                    }} />
                </td>
            </tr>
            {operator === 'between' ? <>
                <tr onClick={(evt) => { evt.preventDefault(); }}>
                    <td>
                        and
                    </td>
                </tr>
                <tr onClick={(evt) => { evt.preventDefault(); }}>
                    <td>
                        <input type={'number'} className='form-control' value={secondValue} onChange={(evt) => {
                            const v = evt.target.value as string;
                            setSecondValue(v);
                        }} />
                    </td>
                </tr>
            </> : null}
        </>
    }