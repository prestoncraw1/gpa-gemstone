// ******************************************************************************************************
//  OpenXDA.ts - Gbtc
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
    exports.default = OpenXDA;
    var OpenXDA;
    (function (OpenXDA) {
        var Lists;
        (function (Lists) {
            // Lists
            var AssetTypes = ['Line', 'LineSegment', 'Breaker', 'Bus', 'CapacitorBank', 'Transformer', 'CapacitorBankRelay'];
            var MeasurementTypes = ['Voltage', 'Current', 'Power', 'Energy', 'Digital'];
            var MeasurementCharacteristics = ['AngleFund', 'AvgImbal', 'CrestFactor', 'FlkrPLT', 'FlkrPST', 'Frequency', 'HRMS', 'IHRMS', 'Instantaneous', 'IT', 'None', 'P', 'PDemand', 'PF', 'PFDemand', 'PIntg', 'PPeakDemand', 'QDemand', 'QFund', 'QIntg', 'RMS', 'RMSPeakDemand', 'S', 'SDemand', 'SNeg', 'SpectraHGroup', 'SPos', 'SZero', 'TDD', 'TID', 'TIDRMS', 'TotalTHD', 'TotalTHDRMS', 'BreakerStatus', 'TCE', 'Q', 'PIVLIntgPos', 'QIVLIntgPos', 'Peak', 'FlkrMagAvg', 'EvenTHD', 'OddTHD', 'FormFactor', 'ArithSum', 'S0S1', 'S2S1', 'TIF', 'DF', 'SIntgFund', 'DFArith', 'DFVector', 'PFArith', 'PFVector', 'PHarmonic', 'SArith', 'SArithFund', 'SVector', 'SVectorFund', 'Spectra', 'SpectraIGroup'];
            var Phases = ['AN', 'BN', 'CN', 'AB', 'BC', 'CA', 'RES', 'NG', 'None', 'Worst', 'LineToNeutralAverage', 'LineToLineAverage'];
            var EventTypes = ['Sag', 'Swell', 'Transient', 'Fault', 'Interruption'];
            var NoteTypes = ['Meter', 'Event', 'Asset', 'Location', 'Customer', 'User', 'Company'];
            var NoteApplications = ['OpenMIC', 'OpenXDA', 'MiMD', 'SystemCenter', 'OpenHistorian', 'All'];
            var NoteTags = ['General', 'Configuration', 'Diagnostic', 'Compliance'];
        })(Lists = OpenXDA.Lists || (OpenXDA.Lists = {}));
    })(OpenXDA || (OpenXDA = {}));
});
