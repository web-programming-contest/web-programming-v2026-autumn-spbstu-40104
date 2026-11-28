import {useId} from 'react';
import type {SelectHTMLAttributes} from 'react';

import styles from './Select.module.scss';

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps extends Omit<
  SelectHTMLAttributes<HTMLSelectElement>,
  'children' | 'value' | 'defaultValue' | 'multiple' | 'size'
> {
  options: SelectOption[];
  value: string;
  label?: string;
  placeholder?: string;
  helperText?: string;
  error?: string;
  fullWidth?: boolean;
}

export function Select({
  options,
  value,
  label,
  placeholder = 'Не выбрано',
  helperText,
  error,
  fullWidth = false,
  required = false,
  disabled = false,
  className = '',
  id,
  ...props
}: SelectProps) {
  const generatedId = useId();

  const selectId = id ?? generatedId;
  const messageId = `${selectId}-message`;

  const wrapperClassName = [
    styles.wrapper,
    fullWidth ? styles.fullWidth : '',
    error ? styles.error : '',
    disabled ? styles.disabled : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const selectClassName = [
    styles.select,
    value ? styles.filled : styles.placeholder,
  ].join(' ');

  return (
    <div className={wrapperClassName}>
      {label && (
        <label htmlFor={selectId} className={styles.label}>
          {label}

          {required && <span className={styles.required}>*</span>}
        </label>
      )}

      <div className={styles.control}>
        <select
          {...props}
          id={selectId}
          value={value}
          className={selectClassName}
          required={required}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          aria-describedby={error || helperText ? messageId : undefined}
        >
          <option value="" disabled>
            {placeholder}
          </option>

          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>

        <svg
          className={styles.arrow}
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M4 6L8 10L12 6" />
        </svg>
      </div>

      {(error || helperText) && (
        <span id={messageId} className={styles.message}>
          {error || helperText}
        </span>
      )}
    </div>
  );
}
