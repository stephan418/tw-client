import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './header.scss';

interface HeaderProps {
    logo: React.ReactElement;
}

export const Header: React.FC<HeaderProps> = ({ logo }) => {
    return <header>{logo}</header>;
};

export const Logo: React.FC = () => {
    const logoText = 'TypeWriter';
    const [text, setText] = useState('');

    useEffect(() => {
        let iterations = 0;

        let interval = setInterval(() => {
            iterations++;
            setText(p => {
                return p + logoText[p.length];
            });

            if (iterations === 10) {
                clearInterval(interval);
            }
        }, 70);
    }, []);

    return (
        <div className="header">
            <Link to="/" className="header-logo">
                <span className="header-logo-green">{text}</span>
                <span className="header-logo-white">_</span>
            </Link>
        </div>
    );
};
