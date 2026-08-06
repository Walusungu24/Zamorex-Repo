import React, { forwardRef } from 'react';
import './Input.css';

const Input = forwardRef(({ 
  label,
  type = 'text',
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
      {label && <label className="input-label">{label}</label>}
      <input
        ref={ref}
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