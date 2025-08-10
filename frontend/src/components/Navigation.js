import React from 'react';
import '../styles/Navigation.css';

const Navigation = ({ onNavigate, currentPage, videoFile, notes, slides }) => {
  return (
    <nav className="navigation">
      <ul>
        <li className={currentPage === 'upload' ? 'active' : ''}>
          <button onClick={() => onNavigate('upload')}>
            Upload Video
          </button>
        </li>
        <li className={currentPage === 'videoPlayer' ? 'active' : ''}>
          <button 
            onClick={() => onNavigate('videoPlayer')}
            disabled={!videoFile || !notes}
          >
            Video & Notes
          </button>
        </li>
        <li className={currentPage === 'slides' ? 'active' : ''}>
          <button 
            onClick={() => onNavigate('slides')}
            disabled={!videoFile || !slides.length}
          >
            Slides
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;