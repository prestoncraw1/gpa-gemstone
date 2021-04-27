export default SOETools;
declare namespace SOETools {
    namespace Lists {
        const MeasurementTypes: Types.MeasurementTypeName[];
        const MeasurementCharacteristics: Types.MeasurementCharacteristicName[];
        const Phases: Types.PhaseName[];
    }
    namespace Types {
        type MeasurementTypeName = 'Voltage' | 'Current';
        type MeasurementCharacteristicName = 'AngleFund' | 'WaveAmplitude' | 'WaveError' | 'RMS' | 'Instantaneous';
        type PhaseName = 'AN' | 'BN' | 'CN' | 'IN' | 'RES' | 'General1' | 'General2' | 'General3' | 'Worst';
        interface Channel {
            ID: number;
            MeterID: number;
            LineID: number;
            MeasurementTypeID: number;
            MeasurementCharacteristicID: number;
            PhaseID: number;
            Name: string;
            SamplesPerHour: number;
            PerUnitValue: number;
            HarmonicGroup: number;
            Description: string;
            Enabled: boolean;
        }
        interface Meter {
            ID: number;
            AssetKey: string;
            SubStationID: number;
            MeterLocationID: number;
            ParentNormalID: number;
            ParentAlternateID: number;
            CircuitID: number;
            IsNormallyOpen: boolean;
            Alias: string;
            ShortName: string;
            Make: string;
            Model: string;
            Name: string;
            TimeZone: string;
            Description: string;
            Phasing: 'ABC' | 'BAC' | 'CAB' | 'CBA';
            Orientation: 'XY' | 'YX' | '';
            ExtraData: string;
        }
        interface MeterLocation {
            ID: number;
            AssetKey: string;
            Name: string;
            Alias: string;
            ShortName: string;
            Latitude: number;
            Longitude: number;
            Description: string;
        }
        interface Circuit {
            ID: number;
            SystemID: number;
            Name: string;
        }
        interface SubStation {
            ID: number;
            Name: string;
        }
        interface System {
            ID: number;
            Name: string;
        }
        interface Phase {
            ID: number;
            Name: PhaseName;
            Description: string;
        }
        interface MeasurementType {
            ID: number;
            Name: MeasurementTypeName;
            Description: string;
        }
        interface MeasurementCharacteristic {
            ID: number;
            Name: MeasurementCharacteristicName;
            Description: string;
        }
        interface SOE {
            ID: number;
            Name: string;
            StartTime: string;
            EndTime: string;
            Status: string;
            TimeWindows: number;
        }
    }
}
