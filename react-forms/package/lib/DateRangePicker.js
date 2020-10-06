"use strict";
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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
function DateRangePicker(props) {
    var _a = React.useState('Custom'), range = _a[0], setRange = _a[1];
    function UpdateRange(evt) {
        var _a;
        setRange(evt.target.value);
        var days = 0;
        if (evt.target.value === 'Custom')
            return;
        else if (evt.target.value === '1 Day')
            days = 1;
        else if (evt.target.value === '7 Days')
            days = 7;
        else if (evt.target.value === '30 Days')
            days = 30;
        else if (evt.target.value === '90 Days')
            days = 90;
        else if (evt.target.value === '180 Days')
            days = 180;
        else if (evt.target.value === '365 Days')
            days = 365;
        var f = new Date();
        f.setDate(f.getDate() - days);
        props.Setter(__assign(__assign({}, props.Record), (_a = {}, _a[props.FromField] = f.getFullYear() + "-" + (f.getMonth() + 1)
            .toString()
            .padStart(2, '0') + "-" + f.getDate().toString().padStart(2, '0'), _a[props.ToField] = new Date().getFullYear() + "-" + (new Date().getMonth() + 1)
            .toString()
            .padStart(2, '0') + "-" + new Date().getDate().toString().padStart(2, '0'), _a)));
    }
    return (React.createElement("div", { className: "form-group" },
        React.createElement("label", null, props.Label),
        React.createElement("div", { className: "row" },
            React.createElement("div", { className: "col" },
                React.createElement("select", { className: "form-control", value: range, onChange: UpdateRange },
                    React.createElement("option", { value: "Custom" }, "Custom"),
                    React.createElement("option", { value: "1 Day" }, "1 Day"),
                    React.createElement("option", { value: "7 Days" }, "7 Days"),
                    React.createElement("option", { value: "30 Days" }, "30 Days"),
                    React.createElement("option", { value: "90 Days" }, "90 Days"),
                    React.createElement("option", { value: "180 Days" }, "180 Days"),
                    React.createElement("option", { value: "365 Days" }, "365 Days"))),
            React.createElement("div", { className: "col" },
                React.createElement("input", { className: "form-control", type: "date", onChange: function (evt) {
                        var _a;
                        var record = __assign(__assign({}, props.Record), (_a = {}, _a[props.FromField] = evt.target.value !== '' ? evt.target.value : null, _a));
                        props.Setter(record);
                    }, value: props.Record[props.FromField] == null ? '' : props.Record[props.FromField].toString(), disabled: props.Disabled == null ? false : props.Disabled })),
            React.createElement("div", { className: "col" },
                React.createElement("input", { className: "form-control", type: "date", onChange: function (evt) {
                        var _a;
                        var record = __assign(__assign({}, props.Record), (_a = {}, _a[props.ToField] = evt.target.value !== '' ? evt.target.value : null, _a));
                        props.Setter(record);
                    }, value: props.Record[props.ToField] == null ? '' : props.Record[props.ToField].toString(), disabled: props.Disabled == null ? false : props.Disabled })))));
}
exports.default = DateRangePicker;
