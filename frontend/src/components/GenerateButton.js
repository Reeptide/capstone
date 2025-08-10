import React from 'react';

const GenerateButton = ({ 
  onClick, 
  disabled, 
  isGenerating, 
  label, 
  generatingLabel,
  className = ''
}) => {
  return (
    <button 
      className={`generate-button ${isGenerating ? 'generating' : ''} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {isGenerating ? (
        <>
          <span className="generate-text">{generatingLabel}</span>
          <span className="loading-dots">
            <span className="dot">.</span>
            <span className="dot">.</span>
            <span className="dot">.</span>
          </span>
        </>
      ) : (
        <span>{label}</span>
      )}
    </button>
  );
};

export default GenerateButton;