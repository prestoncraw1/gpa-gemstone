/// <reference types="react" />
export default function DateRangePicker<T>(props: {
    Record: T;
    FromField: keyof T;
    ToField: keyof T;
    Setter: (record: T) => void;
    Disabled?: boolean;
    Label: string;
}): JSX.Element;
