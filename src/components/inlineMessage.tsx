import { motion, MotionProps, Variants } from 'framer-motion';
import React from 'react';

interface InlineMessageProps {
    className?: string;
}

const inlineMessageVariants: Variants = {
    initial: {
        opacity: 0,
        y: 5,
    },
    in: {
        opacity: 1,
        y: 0,
    },
    out: {
        opacity: 0,
        y: 5,
    },
};

export const InlineMessage: React.FC<InlineMessageProps> = ({ className, children }) => {
    const userClasses = className ? ' ' + className : '';

    return (
        <motion.h3
            className={'inline-message' + userClasses}
            variants={inlineMessageVariants}
            initial="initial"
            animate="in"
            exit="out"
        >
            {children}
        </motion.h3>
    );
};
