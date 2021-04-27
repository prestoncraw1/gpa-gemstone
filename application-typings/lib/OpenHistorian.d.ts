export default OpenHistorian;
declare namespace OpenHistorian {
    namespace Types {
        interface iHistorian {
            NodeID: string;
            ID: string;
            Acronym: string;
            Name: string;
            AssemblyName: string;
            TypeName: string;
            ConnectionString: string;
            IsLocal: boolean;
            MeasurementReportingInterval: number;
            Description: string;
            LoadOrder: number;
            Enabled: boolean;
            CreatedOn: string;
            CreatedBy: string;
            UpdatedOn: string;
            UpdatedBy: string;
        }
        interface iActiveMeasurement {
            NodeID: string;
            SourceNodeID: string;
            ID: string;
            SignalID: string;
            PointTag: string;
            AlternateTag: string;
            SignalReference: string;
            Internal: boolean;
            Subscribed: boolean;
            Device: string;
            DeviceID: number;
            FramesPerSecond: number;
            Protocol: string;
            SignalType: SignalType;
            EngineeringUnits: string;
            PhasorID: number;
            PhasorType: string;
            Phase: Phase;
            Adder: number;
            Multiplier: number;
            Company: string;
            Longitude: number;
            Latitude: number;
            Description: string;
            UpdatedOn: string;
        }
        type SignalType = 'IPHM' | 'IPHA' | 'VPHM' | 'VPHA' | 'FREQ' | 'DFDT' | 'ALOG' | 'FLAG' | 'DIGI' | 'CALC' | 'STAT' | 'ALARM' | 'QUAL';
        type Phase = 'A' | 'B' | 'C' | '+' | '-' | '0' | 'None';
    }
    namespace Lists {
    }
}
