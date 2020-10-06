/// <reference types="react" />
export default function TextArea<T>(props: {
    Rows: number;
    Record: T;
    Field: keyof T;
    Setter: (record: T) => void;
    Valid: (field: keyof T) => boolean;
    Label?: string;
    Feedback?: string;
    Disabled?: boolean;
}): JSX.Element;
