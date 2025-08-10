import React from 'react';
import '../styles/SlideViewer.css';

const SlideViewer = ({ slide, onClose, title }) => {
  return (
    <div className="slide-viewer-overlay">
      <div className="slide-viewer-container">
        <div className="slide-viewer-header">
          <h2>{title}</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="slide-content">
          <img 
            src={slide.imageUrl || "https://via.placeholder.com/1200x675?text=" + encodeURIComponent(slide.content)} 
            alt={slide.content} 
          />
        </div>
        
        <div className="slide-viewer-footer">
          <div className="slide-details">{slide.content}</div>
        </div>
      </div>
    </div>
  );
};

export default SlideViewer;