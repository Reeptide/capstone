import React, { useState } from 'react';
import SlideViewer from './SlideViewer';
import '../styles/SlidesPage.css';

const SlidesPage = ({ slides, topics, onGoBack }) => {
  const [selectedTopic, setSelectedTopic] = useState(slides[0]?.title || '');
  const [viewingSlide, setViewingSlide] = useState(null);

  const handleTopicClick = (topic) => {
    setSelectedTopic(topic);
  };

  const handleSlideClick = (slide) => {
    setViewingSlide(slide);
  };

  const closeViewer = () => {
    setViewingSlide(null);
  };

  // Get the slides for the selected topic
  const selectedSlideGroup = slides.find(group => group.title === selectedTopic);
  const currentSlides = selectedSlideGroup?.slides || [];

  return (
    <div className="slides-container">
      <h1 className="page-title">Lecture Slides</h1>
      
      <div className="topics-slides-container">
        {/* Vertical slides list on the left */}
        <div className="slides-list-sidebar">
          <h2>Slides</h2>
          <div className="slides-list">
            {slides.map((slideGroup) => (
              <div key={slideGroup.topicId} className="slide-group">
                <div className="slide-group-title">{slideGroup.title}</div>
                {slideGroup.slides.map((slide, slideIndex) => (
                  <div 
                    key={slideIndex} 
                    className={`slide-list-item ${selectedTopic === slideGroup.title ? 'active' : ''}`}
                    onClick={() => {
                      handleTopicClick(slideGroup.title);
                      handleSlideClick(slide);
                    }}
                  >
                    <div className="slide-icon">
                      <img src="/slide-icon.png" alt="Slide" onError={(e) => e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%233498db'%3E%3Cpath d='M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zM13.5 10h-7v1h7v-1zm0 2h-7v1h7v-1zm0 2h-7v1h7v-1zm8-6V5h-2v3h-3v2h3v3h2v-3h3V8h-3z'/%3E%3C/svg%3E"} />
                    </div>
                    <div className="slide-count">{slideGroup.slides.length}</div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
        
        {/* Main content area with topics at top and selected slide below */}
        <div className="main-content-area">
          <div className="topics-row">
            <h2>Topics</h2>
            <div className="topics-buttons">
              {slides.map((slideGroup, index) => (
                <button 
                  key={index} 
                  className={`topic-button ${selectedTopic === slideGroup.title ? 'active' : ''}`}
                  onClick={() => handleTopicClick(slideGroup.title)}
                >
                  {slideGroup.title}
                </button>
              ))}
            </div>
          </div>
          
          <div className="selected-slide-display">
            {currentSlides.length > 0 ? (
              <div className="slide-display-area">
                <img 
                  src={currentSlides[0].imageUrl || "https://via.placeholder.com/800x450?text=" + encodeURIComponent(currentSlides[0].content)}
                  alt={currentSlides[0].content} 
                  onClick={() => handleSlideClick(currentSlides[0])}
                />
                <div className="slide-title">{currentSlides[0].content}</div>
              </div>
            ) : (
              <div className="no-slides-message">
                No slides available for this topic
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="navigation-controls">
        <button className="back-button blue-button" onClick={onGoBack}>
          Back to Video Upload
        </button>
      </div>
      
      {viewingSlide && (
        <SlideViewer
          slide={viewingSlide}
          onClose={closeViewer}
          title={selectedTopic}
        />
      )}
    </div>
  );
};

export default SlidesPage;