import React from 'react';
import CloseIcon from '@/assets/close.svg';
import { motion } from 'framer-motion';
import './banner.scss';

interface BannerProps {
    onClose: () => unknown;
    className?: string;
}

export const Banner: React.FC<BannerProps> = ({ onClose, className, children }) => {
    return (
        <motion.div
            initial={{ y: '100%' }}
            animate={{ y: '0%' }}
            exit={{ y: '100%' }}
            transition={{ type: 'tween' }}
            className={'banner' + (className ? ' ' + className : '')}
        >
            <div className="content">{children}</div>
            <div className="close" onClick={() => onClose()}>
                <CloseIcon />
            </div>
        </motion.div>
    );
};
