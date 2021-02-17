import { motion, Variants } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { pageAnimations } from '../global/animate';

interface LoaderProps {
    message?: string;
    speed?: number;
}

export const Loader: React.FC<LoaderProps> = ({ message, children, speed }) => {
    const [dots, setDots] = useState('');

    const loaderMessage = message || children || 'Loading';
    const waitTime = speed || 100;

    useEffect(() => {
        let i = 0;

        let interval = setInterval(() => {
            setDots('.'.repeat((i % 5) + 1));
            i++;
        }, waitTime);

        return () => clearInterval(interval);
    }, []);

    return (
        <motion.div key="loader" className="loader" variants={pageAnimations} initial="initial" animate="in" exit="out">
            {loaderMessage}
            <span className="dots">{dots}</span>
        </motion.div>
    );
};
