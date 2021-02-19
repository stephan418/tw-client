import React from 'react';
import { RouterButtonLink } from '../components/button';
import { motion } from 'framer-motion';
import { pageAnimations } from '../global/animate';
import { Page } from './page';
import './home.scss';

export const Home: React.FC = () => {
    return (
        <Page className="home-button-container">
            <RouterButtonLink href="/tw-client/join" className="home-equal-button">
                Join race
            </RouterButtonLink>
            <RouterButtonLink href="/tw-client/create" secondary className="home-equal-button">
                Create race
            </RouterButtonLink>
        </Page>
    );
};
