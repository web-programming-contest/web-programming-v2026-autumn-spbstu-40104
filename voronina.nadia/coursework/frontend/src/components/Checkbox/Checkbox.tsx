import type {InputHTMLAttributes} from 'react';

import styles from './Checkbox.module.scss';

interface CheckboxProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'children'
> {
  label?: string;
}

export function Checkbox({
  label,
  disabled = false,
  className = '',
  ...props
}: CheckboxProps) {
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
        type="checkbox"
        className={styles.input}
        disabled={disabled}
      />

      <span className={styles.mark} aria-hidden="true" />

      {label && <span className={styles.label}>{label}</span>}
    </label>
  );
}
