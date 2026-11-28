import type {ButtonHTMLAttributes, ReactNode} from 'react';

import styles from './Button.module.scss';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'blue' | 'pink';
  icon?: string;
  fullWidth?: boolean;
}

export function Button({
  children,
  variant = 'blue',
  icon,
  fullWidth = false,
  className = '',
  type = 'button',
  ...props
}: ButtonProps) {
  const buttonClassName = [
    styles.button,
    styles[variant],
    fullWidth ? styles.fullWidth : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button {...props} type={type} className={buttonClassName}>
      {icon && <img src={icon} alt="" className={styles.icon} />}

      <span>{children}</span>
    </button>
  );
}
