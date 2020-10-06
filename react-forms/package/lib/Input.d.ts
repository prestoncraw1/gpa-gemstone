/// <reference types="react" />
export default function Input<T>(props: {
    Record: T;
    Field: keyof T;
    Setter: (record: T) => void;
    Valid: (field: keyof T) => boolean;
    Label?: string;
    Feedback?: string;
    Disabled?: boolean;
    Type?: 'number' | 'text' | 'password' | 'email' | 'color';
}): JSX.Element;
