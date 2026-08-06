import React from 'react';
import './Button.css';

function Button({ 
  children, 
  variant = 'primary', 
  size = 'medium', 
  loading = false, 
  fullWidth = false,
  onClick, 
  type = 'button',
  disabled,
  className = ''
}) {
  const classes = [
    'btn',
    `btn-${variant}`,
    `btn-${size}`,
    fullWidth ? 'btn-full' : '',
    loading ? 'btn-loading' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading ? <span className="btn-spinner">⟳</span> : children}
    </button>
  );
}

export default Button;