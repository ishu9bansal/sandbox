// =======================
// MODULE: types.ts
// =======================
import React from 'react';

export interface Field {
    id: string;
    label: string;
    type: 'text' | 'select' | 'radio' | 'checkbox' | 'textarea' | 'datetime';
    options?: string[];
    required?: boolean;
    placeholder?: string;
}

export interface Step {
    id: string;
    title: string;
    fields?: Field[];
    customContent?: React.ReactNode;
}
