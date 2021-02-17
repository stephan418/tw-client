import { motion } from 'framer-motion';
import React from 'react';
import { pageAnimations } from '../global/animate';

interface PageProps {
    className?: string;
}

export const Page: React.FC<PageProps> = ({ children, className }) => {
    const userClasses = className ? className : '';

    return (
        <motion.div variants={pageAnimations} initial="initial" animate="in" exit="out" className={userClasses}>
            {children}
        </motion.div>
    );
};
