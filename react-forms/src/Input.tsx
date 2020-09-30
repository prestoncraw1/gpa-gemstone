// ******************************************************************************************************
//  Input.tsx - Gbtc
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
//  01/22/2020 - Billy Ernest
//       Generated original version of source code.
//
// ******************************************************************************************************

import * as React from 'react';

export default function FormInput<T>(props:  {
    Record: T;
    Field: keyof T;
    Setter: (record: T) => void;
    Valid: (field: keyof T) => boolean;
    Label?: string;
    Feedback?: string;
    Disabled?: boolean;
    Type?: 'number' | 'text' | 'password' | 'email' | 'color'
  }){
    return (
      <div className="form-group">
        <label>{props.Label == null ? props.Field : props.Label}</label>
        <input
          type={props.Type === undefined ? 'text': props.Type}
          className={props.Valid(props.Field) ? 'form-control' : 'form-control is-invalid'}
          onChange={(evt) => props.Setter({ ...props.Record, [props.Field]:  evt.target.value !== '' ? evt.target.value : null})}
          value={
            props.Record[props.Field] == null ? '' : (props.Record[props.Field] as any).toString()
          }
          disabled={props.Disabled == null ? false : props.Disabled}
        />
        <div className="invalid-feedback">
          {props.Feedback == null ? props.Field + ' is a required field.' : props.Feedback}
        </div>
      </div>
    );
  }

