import React, { forwardRef } from 'react';
import './Input.css';

const Input = forwardRef(({ 
  label,
  type = 'text',
  name,
  placeholder,
  value,
  onChange,
  error,
  required,
  className = '',
  ...props
}, ref) => {
  return (
    <div className={`input-group ${className}`}>
      {label && <label className="input-label" htmlFor={name}>{label}</label>}
      <input
        ref={ref}
        id={name}
        name={name}
        type={type}
        className={`input-field ${error ? 'input-error' : ''}`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        {...props}
      />
      {error && <span className="input-error-text">{error}</span>}
    </div>
  );
});

export default Input;