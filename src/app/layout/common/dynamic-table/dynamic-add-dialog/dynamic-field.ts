export interface DynamicField {
    name: string;
    type: string; // 'text', 'number', 'select', 'date', etc.
    label: string;
    value?: any;
    required?: boolean;
    options?: string[]; // solo para 'select'
    placeholder?: string;
    validators?: any[];
}
