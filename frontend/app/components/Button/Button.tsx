import React, { ReactNode, MouseEvent } from 'react';
import styles from './Button.module.css';

interface ButtonProps {
    children: ReactNode;
    onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
    variant?: 'primary' | 'secondary';
    disabled?: boolean
}

const Button: React.FC<ButtonProps> = ({ 
    children, 
    onClick, 
    variant = 'primary'
     
}) => {
    const buttonClass = `${styles.button} ${styles[variant]}`;
    
    return (
        <button className={buttonClass} onClick={onClick}>
            {children}
        </button>
    );
};

export default Button;