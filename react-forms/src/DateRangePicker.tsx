// ******************************************************************************************************
//  DateRangePicker.tsx - Gbtc
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

export default function DateRangePicker<T>(props: {
  Record: T;
  FromField: keyof T;
  ToField: keyof T;
  Setter: (record: T) => void;
  Disabled?: boolean;
  Label: string;
}) {
  const [range, setRange] = React.useState<
    'Custom' | '1 Day' | '7 Days' | '30 Days' | '90 Days' | '180 Days' | '365 Days'
  >('Custom');

  function UpdateRange(evt: React.ChangeEvent<HTMLSelectElement>) {
    setRange(evt.target.value as any);

    let days = 0;

    if (evt.target.value === 'Custom') return;
    else if (evt.target.value === '1 Day') days = 1;
    else if (evt.target.value === '7 Days') days = 7;
    else if (evt.target.value === '30 Days') days = 30;
    else if (evt.target.value === '90 Days') days = 90;
    else if (evt.target.value === '180 Days') days = 180;
    else if (evt.target.value === '365 Days') days = 365;

    const f = new Date();
    f.setDate(f.getDate() - days);

    props.Setter({
      ...props.Record,
      [props.FromField]: `${f.getFullYear()}-${(f.getMonth() + 1)
        .toString()
        .padStart(2, '0')}-${f.getDate().toString().padStart(2, '0')}`,
      [props.ToField]: `${new Date().getFullYear()}-${(new Date().getMonth() + 1)
        .toString()
        .padStart(2, '0')}-${new Date().getDate().toString().padStart(2, '0')}`,
    });
  }

  return (
    <div className="form-group">
      <label>{props.Label}</label>
      <div className="row">
        <div className="col">
          <select className="form-control" value={range} onChange={UpdateRange}>
            <option value="Custom">Custom</option>
            <option value="1 Day">1 Day</option>
            <option value="7 Days">7 Days</option>
            <option value="30 Days">30 Days</option>
            <option value="90 Days">90 Days</option>
            <option value="180 Days">180 Days</option>
            <option value="365 Days">365 Days</option>
          </select>
        </div>
        <div className="col">
          <input
            className="form-control"
            type="date"
            onChange={(evt) => {
              const record: T = {
                ...props.Record,
                [props.FromField]: evt.target.value !== '' ? evt.target.value : null,
              };
              props.Setter(record);
            }}
            value={props.Record[props.FromField] == null ? '' : (props.Record[props.FromField] as any).toString()}
            disabled={props.Disabled == null ? false : props.Disabled}
          />
        </div>
        <div className="col">
          <input
            className="form-control"
            type="date"
            onChange={(evt) => {
              const record: T = { ...props.Record, [props.ToField]: evt.target.value !== '' ? evt.target.value : null };
              props.Setter(record);
            }}
            value={props.Record[props.ToField] == null ? '' : (props.Record[props.ToField] as any).toString()}
            disabled={props.Disabled == null ? false : props.Disabled}
          />
        </div>
      </div>
    </div>
  );
}
