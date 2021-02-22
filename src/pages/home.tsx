import React, { useState } from 'react';
import { RouterButtonLink } from '../components/button';
import { AnimatePresence, motion } from 'framer-motion';
import { pageAnimations } from '../global/animate';
import { Page } from './page';
import './home.scss';
import { Banner } from '../components/banner';
import { Dropdown } from '../components/dropdown';

export const Home: React.FC = () => {
    return (
        <Page className="home-button-container">
            <RouterButtonLink href="/join" className="home-equal-button">
                Join race
            </RouterButtonLink>
            <RouterButtonLink href="/create" secondary className="home-equal-button">
                Create race
            </RouterButtonLink>
        </Page>
    );
};
