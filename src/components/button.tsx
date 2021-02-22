import React from 'react';
import { Link } from 'react-router-dom';
import './button.scss';

interface ButtonLinkProps {
    href: string;
    secondary?: boolean;
    className?: string;
}

export const ButtonLink: React.FC<ButtonLinkProps> = ({ children, href, secondary }) => {
    return (
        <a href={href} className={'button-link' + (secondary ? ' secondary' : ' primary')}>
            {children}
        </a>
    );
};

export const RouterButtonLink: React.FC<ButtonLinkProps> = ({ children, href, secondary, className }) => {
    const userClasses = className ? ' ' + className : '';

    return (
        <Link to={href} className={'button-link' + (secondary ? ' secondary' : ' primary') + userClasses}>
            {children}
        </Link>
    );
};

interface ButtonProps {
    className?: string;
    onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    secondary?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ children, className, onClick, secondary }) => {
    const userClasses = className ? ' ' + className : '';

    return (
        <button onClick={onClick} className={'button' + userClasses + (secondary ? ' secondary' : ' primary')}>
            {children}
        </button>
    );
};
