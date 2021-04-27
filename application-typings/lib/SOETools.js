// ******************************************************************************************************
//  SOETools.ts - Gbtc
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
//  09/30/2020 - Billy Ernest
//       Generated original version of source code.
//
// ******************************************************************************************************
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = SOETools;
    var SOETools;
    (function (SOETools) {
        var Lists;
        (function (Lists) {
            Lists.MeasurementTypes = ['Voltage', 'Current'];
            Lists.MeasurementCharacteristics = ['AngleFund', 'WaveAmplitude', 'WaveError', 'RMS', 'Instantaneous'];
            Lists.Phases = ['AN', 'BN', 'CN', 'IN', 'RES', 'General1', 'General2', 'General3', 'Worst'];
        })(Lists = SOETools.Lists || (SOETools.Lists = {}));
    })(SOETools || (SOETools = {}));
});
