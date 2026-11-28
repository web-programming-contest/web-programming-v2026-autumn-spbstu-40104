import {useId} from 'react';
import type {InputHTMLAttributes} from 'react';

import styles from './Input.module.scss';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  fullWidth?: boolean;
}

export function Input({
  label,
  helperText,
  error,
  fullWidth = false,
  required = false,
  disabled = false,
  className = '',
  id,
  ...props
}: InputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const messageId = `${inputId}-message`;

  const wrapperClassName = [
    styles.wrapper,
    fullWidth ? styles.fullWidth : '',
    error ? styles.error : '',
    disabled ? styles.disabled : '',
  ]
    .filter(Boolean)
    .join(' ');

  const inputClassName = [styles.input, className].filter(Boolean).join(' ');

  return (
    <div className={wrapperClassName}>
      {label && (
        <label htmlFor={inputId} className={styles.label}>
          {label}

          {required && <span className={styles.required}>*</span>}
        </label>
      )}

      <input
        {...props}
        id={inputId}
        className={inputClassName}
        required={required}
        disabled={disabled}
        aria-invalid={Boolean(error)}
        aria-describedby={error || helperText ? messageId : undefined}
      />

      {(error || helperText) && (
        <span id={messageId} className={styles.message}>
          {error || helperText}
        </span>
      )}
    </div>
  );
}
