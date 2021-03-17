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

export namespace OpenXDA {
    // Types
    type AssetTypeName = 'Line' | 'LineSegment' | 'Breaker' | 'Bus' | 'CapacitorBank' | 'Transformer' | 'CapacitorBankRelay'
    type MeasurementTypeName = 'Voltage' | 'Current' | 'Power' | 'Energy' | 'Digital';
    type MeasurementCharacteristicName = 'AngleFund' | 'AvgImbal' | 'CrestFactor' | 'FlkrPLT' | 'FlkrPST' | 'Frequency' | 'HRMS' | 'IHRMS' | 'Instantaneous' | 'IT' | 'None' | 'P' | 'PDemand' | 'PF' | 'PFDemand' | 'PIntg' | 'PPeakDemand' | 'QDemand' | 'QFund' | 'QIntg' | 'RMS' | 'RMSPeakDemand' | 'S' | 'SDemand' | 'SNeg' | 'SpectraHGroup' | 'SPos' | 'SZero' | 'TDD' | 'TID' | 'TIDRMS' | 'TotalTHD' | 'TotalTHDRMS' | 'BreakerStatus' | 'TCE' | 'Q' | 'PIVLIntgPos' | 'QIVLIntgPos' | 'Peak' | 'FlkrMagAvg' | 'EvenTHD' | 'OddTHD' | 'FormFactor' | 'ArithSum' | 'S0S1' | 'S2S1' | 'TIF' | 'DF' | 'SIntgFund' | 'DFArith' | 'DFVector' | 'PFArith' | 'PFVector' | 'PHarmonic' | 'SArith' | 'SArithFund' | 'SVector' | 'SVectorFund' | 'Spectra' | 'SpectraIGroup';
    type PhaseName = 'AN' | 'BN' | 'CN' | 'AB' | 'BC' | 'CA' | 'RES' | 'NG' | 'None' | 'Worst' | 'LineToNeutralAverage' | 'LineToLineAverage';
    type EventTypeName = 'Sag' | 'Swell' | 'Transient' | 'Fault' | 'Interruption'
    type NoteTypeName = 'Meter' | 'Event' | 'Asset' | 'Location' | 'Customer' | 'User' | 'Company'
    // Tables
    interface EventType { ID: number, Name: EventTypeName, Description: string, Selected?: boolean }
    interface Meter { ID: number, AssetKey: string, Alias: string, Make: string, Model: string, Name: string, ShortName: string, TimeZone: string, LocationID: number, Description: string, Selected?: boolean }
    interface Location { ID: number, LocationKey: string, Name: string, Alias: string, ShortName: string, Latitude: number, Longitude: number, Description: string }
    interface Disturbance { ID: number, EventID: number, PhaseID: number, Magnitude: number, PerUnitMagnitude: number, DurationSeconds: number }
    interface EDNAPoint { ID: number, BreakerID: number, Point: string }
    interface Channel { ID: number, Meter: string, Asset: string, MeasurementType: string, MeasurementCharacteristic: string, Phase: string, Name: string, Adder: number, Multiplier: number, SamplesPerHour: number, PerUnitValue: number, HarmonicGroup: number, Description: string, Enabled: boolean, Series: Series[] }
    interface Series { ID: number, ChannelID: number, SeriesType: string, SourceIndexes: string }
    interface Note { ID: number, NoteTypeID: number, ReferenceTableID: number, Note: string, UserAccount: string, Timestamp: string }

    // Assets
    interface Asset { ID: number, VoltageKV: number, AssetKey: string, Description: string, AssetName: string, AssetType: AssetTypeName, Spare:boolean, Channels: Array<Channel> }
    interface Breaker extends Asset { ThermalRating: number, Speed: number, TripTime: number, PickupTime: number, TripCoilCondition: number, EDNAPoint?: string, SpareBreakerID?: number }
    interface Bus extends Asset { }
    interface CapBank extends Asset {
        NumberOfBanks: number, CapacitancePerBank: number, CktSwitcher: string, MaxKV: number, UnitKV: number, UnitKVAr: number, NegReactanceTol: number, PosReactanceTol: number,
        Nparalell: number, Nseries: number, NSeriesGroup: number, NParalellGroup: number, Fused: boolean, VTratioBus: number, NumberLVCaps: number, NumberLVUnits: number, LVKVAr: number, LVKV: number,
        LVNegReactanceTol: number, LVPosReactanceTol: number, UpperXFRRatio: number, LowerXFRRatio: number, Nshorted: number, BlownFuses: number, BlownGroups: number, RelayPTRatioPrimary: number, Rv: number,
        Rh: number, Compensated: boolean, NLowerGroups: number, ShortedGroups: number, Sh: number, RelayPTRatioSecondary: number
    }
    interface CapBankRelay extends Asset { OnVoltageThreshhold: number }
    interface Line extends Asset { MaxFaultDistance: number, MinFaultDistance: number, Detail: LineDetail }
    interface LineSegment extends Asset { R0: number, X0: number, R1: number, X1: number, ThermalRating: number, Length: number }
    interface Transformer extends Asset { R0: number, X0: number, R1: number, X1: number, ThermalRating: number, PrimaryVoltageKV: number, SecondaryVoltageKV: number, Tap: number }
    interface LineDetail { R0: number, X0: number, R1: number, X1: number, ThermalRating: number, Length: number }
    // Links
    interface AssetConnection { ID: number, AssetRelationshipTypeID: number, Parent: string, Child: string }

    interface Phase { ID: number, Name: PhaseName, Description: string }
    interface MeasurementType { ID: number, Name: MeasurementTypeName, Description: string }
    interface MeasurementCharacteristic { ID: number, Name: MeasurementCharacteristicName, Description: string }
    interface AssetType { ID: number, Name: AssetTypeName, Description: string }
    interface AssetConnectionType { ID: number, Name: string, Description: string, BiDirectional: boolean, JumpConnection: string, PassThrough: string }
    interface NoteType { ID: number, Name: NoteTypeName, ReferenceTableName: string }

    interface MeterConfiguration { ID: number, MeterID: number, DiffID: number, ConfigKey: string, ConfigText: string, RevisionMajor: number, RevisionMinor: number }
    interface DataFile { ID: number, FileGroupID: number, FilePath: string, FilePathHash: number, FileSize: number, CreationTime: string, LastWriteTime: string, LastAccessTime: string, }

    

    // AssetGroups
    interface AssetGroup { ID: number, Name: string, DisplayDashboard: boolean, AssetGroups: number, Meters: number, Assets: number, Users: number }

}

