import React from 'react';
import '../styles/Navigation.css';

const Navigation = ({ onNavigate, currentPage, videoFile, notes, slides }) => {
  return (
    <nav className="app-nav">
      <button 
        className={`nav-button ${currentPage === 'upload' ? 'active' : ''}`} 
        onClick={() => onNavigate('upload')}
      >
        Upload Video
      </button>
      
      <button 
        className={`nav-button ${currentPage === 'videoPlayer' ? 'active' : ''}`}
        onClick={() => onNavigate('videoPlayer')}
        disabled={!videoFile}
      >
        Video & Notes
      </button>
      
      <button 
        className={`nav-button ${currentPage === 'slides' ? 'active' : ''}`}
        onClick={() => onNavigate('slides')}
        disabled={!slides || slides.length === 0}
      >
        Slides
      </button>
    </nav>
  );
};

export default Navigation;