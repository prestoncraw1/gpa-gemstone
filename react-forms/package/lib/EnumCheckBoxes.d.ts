/// <reference types="react" />
export default function EnumCheckBoxes<T>(props: {
    Record: T;
    Field: keyof T;
    Setter: (record: T) => void;
    Enum: string[];
    Label?: string;
}): JSX.Element;
