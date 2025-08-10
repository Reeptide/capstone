import React from 'react';
import '../styles/VideoPlayerPage.css';

const VideoPlayerPage = ({ videoUrl, topics, notes, onGoBack, onGenerateSlides }) => {
  const handleGenerateSlides = () => {
    onGenerateSlides();
  };

  return (
    <div className="video-player-container">
      <h1 className="page-title">Video & Notes</h1>
      
      <div className="main-content">
        <div className="video-notes-section">
          <div className="video-section">
            <div className="video-player">
              <video controls src={videoUrl} width="100%">
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
          
          <div className="notes-section">
            <h2 className="section-heading">Notes</h2>
            <pre className="notes-content">{notes}</pre>
          </div>
        </div>
        
        <div className="sidebar-section">
          <div className="topics-section">
            <h2 className="section-heading">Topics</h2>
            <ul className="topic-list">
              {topics.map((topic) => (
                <li key={topic.id} className="topic-list-item">
                  <span className="topic-title">{topic.title}</span>
                  <span className="topic-timestamp">{topic.timestamp}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="download-section">
            <button className="download-button">
              Download PDF
            </button>
          </div>
        </div>
      </div>
      
      <div className="action-buttons">
        <button className="back-button blue-button" onClick={onGoBack}>
          Back to Video Upload
        </button>
        <button className="generate-slides-button" onClick={handleGenerateSlides}>
          Generate Slides
        </button>
      </div>
    </div>
  );
};

export default VideoPlayerPage;