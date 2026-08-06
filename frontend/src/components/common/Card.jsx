import React from 'react';
import './Card.css';

function Card({ 
  children, 
  title, 
  subtitle, 
  className = '', 
  padding = 'medium' 
}) {
  const paddingClasses = {
    none: 'card-padding-none',
    small: 'card-padding-sm',
    medium: 'card-padding-md',
    large: 'card-padding-lg'
  };

  return (
    <div className={`card ${paddingClasses[padding]} ${className}`}>
      {(title || subtitle) && (
        <div className="card-header">
          {title && <h3 className="card-title">{title}</h3>}
          {subtitle && <p className="card-subtitle">{subtitle}</p>}
        </div>
      )}
      <div className="card-body">
        {children}
      </div>
    </div>
  );
}

export default Card;