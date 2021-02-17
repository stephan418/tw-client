import React from 'react';
import './textInput.scss';

interface TextInputProps {
    uniqueKey: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    value: string;
    className?: string;
    locked?: boolean;
}

export const TextInput: React.FC<TextInputProps> = ({ uniqueKey, children, className, onChange, value, locked }) => {
    const userClasses = (className ? ' ' + className : '') + (locked ? ' locked' : '');

    return (
        <div className={'text-input-container' + userClasses}>
            <input type="text" id={uniqueKey} placeholder=" " onChange={onChange} value={value} />
            <label htmlFor={uniqueKey}>{children}</label>
        </div>
    );
};
