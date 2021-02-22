import { AnimatePresence, motion } from 'framer-motion';
import React, { useState } from 'react';
import ArrowDown from '@/assets/arrow-down.svg';
import './dropdown.scss';

interface Option {
    display: string;
    value: string;
}

interface DropdownProps {
    options: Option[];
    value: string;
    onChange: (n: string) => unknown;
    name: string;
    className?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({ options, value, onChange, className, name }) => {
    const [opened, setOpened] = useState(false);

    function handleChange(n: string) {
        setOpened(false);
        onChange(n);
    }

    return (
        <div className={'dropdown-container' + (className ? ' ' + className : '')}>
            <AnimatePresence>
                {opened && (
                    <motion.div
                        className="dropdown-option-container"
                        initial={{ y: -10, scaleX: 0.9, opacity: 0 }}
                        animate={{ y: 0, scaleX: 1, opacity: 1 }}
                        exit={{ y: -10, scaleX: 0.9, opacity: 0 }}
                        transition={{ type: 'tween', ease: 'easeInOut', duration: 0.16 }}
                    >
                        {options.map(({ value: v, display }) => (
                            <div className="dropdown-option">
                                <input
                                    type="radio"
                                    value={v}
                                    id={v}
                                    name={name}
                                    className={v === value ? 'selected' : ''}
                                    onClick={e => handleChange(v)}
                                    tabIndex={0}
                                />
                                <label htmlFor={v}>{display}</label>
                            </div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            <div
                onClick={() => setOpened(p => !p)}
                className={'dropdown-value' + (opened ? ' opened' : '')}
                tabIndex={0}
            >
                {options.filter(({ value: v }) => value === v)[0]?.display}
                <ArrowDown />
            </div>
        </div>
    );
};
