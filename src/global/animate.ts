import { Variants } from 'framer-motion';

export const pageAnimations: Variants = {
    initial: {
        scale: 2,
        opacity: 0,
    },
    in: {
        scale: 1,
        opacity: 1,
    },
    out: {
        scale: 2,
        opacity: -2,
    },
};
