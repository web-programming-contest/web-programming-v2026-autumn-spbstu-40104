import type {InputHTMLAttributes} from 'react';

import styles from './RadioButton.module.scss';

interface RadioButtonProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'children'
> {
  label: string;
  name: string;
}

export function RadioButton({
  label,
  name,
  disabled = false,
  className = '',
  ...props
}: RadioButtonProps) {
  const wrapperClassName = [
    styles.wrapper,
    disabled ? styles.disabled : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <label className={wrapperClassName}>
      <input
        {...props}
        type="radio"
        name={name}
        disabled={disabled}
        className={styles.input}
      />

      <span className={styles.mark} aria-hidden="true" />

      <span className={styles.label}>{label}</span>
    </label>
  );
}
