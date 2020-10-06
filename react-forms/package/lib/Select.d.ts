/// <reference types="react" />
export default function Select<T>(props: {
    Record: T;
    Field: keyof T;
    Options: {
        Value: string;
        Label: string;
    }[];
    Setter: (record: T) => void;
    Label?: string;
    Disabled?: boolean;
    EmptyOption?: boolean;
}): JSX.Element;
