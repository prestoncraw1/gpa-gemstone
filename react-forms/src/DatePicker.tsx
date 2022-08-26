// ******************************************************************************************************
//  DatePicker.tsx - Gbtc
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
//  02/05/2020 - Billy Ernest
//       Generated original version of source code.
//
// ******************************************************************************************************

import * as React from 'react';
import * as moment from 'moment';

export default function DatePicker<T>(props: {
  Record: T;
  Field: keyof T;
  Setter: (record: T) => void;
  Valid: (field: keyof T) => boolean;
  Label?: string;
  Disabled?: boolean;
  Feedback?: string;
  Format?: string;
  Type?: ('datetime-local' | 'date'); //Default to date
}) {
  // Tracks weather or not props.Record changes are due to internal input boxes or externally
  const [internal, setInternal] = React.useState<boolean>(false);
  // Adds a buffer between the outside props and what the box is reading to prevent box overwriting every render with a keystroke
  const [boxRecord, setBoxRecord] = React.useState<T>(ParseRecord());
  
  // Formats that will be used for dateBoxes
  const boxFormat = "YYYY-MM-DD" + (props.Type === undefined || props.Type === 'date' ? "" : "[T]hh:mm:ss");
  const recordFormat = props.Format !== undefined ? props.Format : "YYYY-MM-DD" + (props.Type === undefined || props.Type === 'date' ? "" : "[T]hh:mm:ss.SSS[Z]");

  function ParseRecord(): T {return {...props.Record, [props.Field]: [props.Field] === null ? '' : moment(props.Record[props.Field] as any, recordFormat).format(boxFormat)}};

  React.useEffect(() => {
    if (!internal)
      setBoxRecord(ParseRecord());
    setInternal(false);
  },[props.Record]);

  return (
    <div className="form-group">
      {(props.Label !== "") ?
      <label>{props.Label == null ? props.Field : props.Label}</label> : null}
      <input
        className={"form-control" + (props.Valid(props.Field) ? '' : ' is-invalid')}
        type={props.Type === undefined ? 'date' : props.Type}
        onChange={(evt) => {
          const record: T = { ...props.Record };
          if (evt.target.value !== '')
            record[props.Field] = moment(evt.target.value, boxFormat).format(recordFormat) as any;
          else
            record[props.Field] = null as any;
          // These two updates should be batched together
          props.Setter(record);
          setBoxRecord({...boxRecord, [props.Field]: evt.target.value});
          setInternal(true);
        }}
        value={boxRecord[props.Field] as any}
        disabled={props.Disabled === undefined ? false : props.Disabled}
      />
      <div className="invalid-feedback">
      {props.Feedback == null ? props.Field.toString() + ' is a required field.' : props.Feedback}
      </div>
    </div>
  );
}
