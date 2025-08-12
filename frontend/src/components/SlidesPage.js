import React, { useState } from 'react';
import '../styles/SlidesPage.css';

const SlidesPage = ({ slides, topics, onGoBack }) => {
  const [currentTopicId, setCurrentTopicId] = useState(null);
  const [slideViewerOpen, setSlideViewerOpen] = useState(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  
  // Find current topic slides
  const currentTopic = slides.find(slide => slide.topicId === currentTopicId);
  const currentTopicSlides = currentTopic?.slides || [];
  const currentSlide = currentTopicSlides[currentSlideIndex] || null;
  
  // Handle topic selection from the left sidebar
  const handleTopicSelect = (topicId) => {
    setCurrentTopicId(topicId);
    setCurrentSlideIndex(0); // Reset to first slide when changing topics
  };
  
  // Handle opening slides when clicking on a slide icon
  const handleSlideIconClick = (topicId) => {
    setCurrentTopicId(topicId);
    setCurrentSlideIndex(0);
    setSlideViewerOpen(true);
  };
  
  // Handle next slide
  const handleNextSlide = () => {
    if (currentSlideIndex < currentTopicSlides.length - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1);
    }
  };
  
  // Handle previous slide
  const handlePrevSlide = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1);
    }
  };
  
  // Download slides as PPT
  const handleDownloadSlides = () => {
    if (!currentTopic) return;
    
    // Map topic IDs to PDF/PPT file names
    const pptMap = {
      1: 'Image_Segmentation_Final_With_Diagram.pptx',
      2: 'homogeneity_criteria.pptx',
      3: 'edge_detection_fundamentals.pptx',
      4: 'edges_lines_points.pptx',
      5: 'edge_detection_differencing.pptx'
    };
    
    const pptName = pptMap[currentTopic.topicId] || 'slides.pptx';
    
    const link = document.createElement('a');
    link.href = `/${pptName}`;
    link.download = pptName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  // Close the slide viewer
  const closeSlideViewer = () => {
    setSlideViewerOpen(false);
  };
  
  return (
    <div className="slides-page">
      <div className="page-container">
        <div className="column-headers">
          <div className="lecture-topics-header">Lecture Topics</div>
          <div className="slides-column-header">Slides</div>
          <div className="preview-column-header">Preview</div>
        </div>
        
        <div className="slides-content-container">
          <div className="slides-table">
            {topics.map((topic) => {
              // Find matching slides for this topic
              const topicSlides = slides.find(slide => slide.topicId === topic.id);
              const slideCount = topicSlides?.slides?.length || 0;
              
              return (
                <div 
                  key={topic.id} 
                  className={`table-row ${currentTopicId === topic.id ? 'active-row' : ''}`}
                >
                  <div 
                    className={`topic-cell ${currentTopicId === topic.id ? 'active' : ''}`}
                    onClick={() => handleTopicSelect(topic.id)}
                  >
                    <div className="topic-title">{topic.title}</div>
                  </div>
                  
                  <div 
                    className={`slide-cell ${currentTopicId === topic.id ? 'active' : ''}`}
                    onClick={() => handleSlideIconClick(topic.id)}
                  >
                    <div className="slide-icon-wrapper">
                      <div className="slide-icon">
                        <span>PPT</span>
                      </div>
                      <span className="slide-count">{slideCount}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="preview-panel">
            {currentTopic ? (
              <div className="preview-content">
                <div className="preview-header">
                  <h2>{currentTopic.title}</h2>
                  <div className="preview-controls">
                    <button 
                      className="preview-nav-button" 
                      onClick={handlePrevSlide}
                      disabled={currentSlideIndex === 0}
                    >
                      ◀
                    </button>
                    <div className="preview-counter">
                      {currentSlideIndex + 1} / {currentTopicSlides.length}
                    </div>
                    <button 
                      className="preview-nav-button" 
                      onClick={handleNextSlide}
                      disabled={currentSlideIndex === currentTopicSlides.length - 1}
                    >
                      ▶
                    </button>
                  </div>
                </div>
                
                <div className="preview-slide">
                  {currentSlide ? (
                    <>
                      <h1>{currentSlide.content}</h1>
                      {currentSlide.imageUrl && (
                        <img src={currentSlide.imageUrl} alt="Slide content" />
                      )}
                    </>
                  ) : (
                    <div className="empty-preview">No slide content available</div>
                  )}
                </div>
                
                <div className="preview-actions">
                  <button className="download-button" onClick={handleDownloadSlides}>
                    Download Presentation
                  </button>
                </div>
              </div>
            ) : (
              <div className="empty-preview-message">
                Select a topic to view slides
              </div>
            )}
          </div>
        </div>
        
        <div className="footer-container">
          <button className="back-button" onClick={onGoBack}>
            Back to Video Upload
          </button>
        </div>
      </div>
      
      {/* Full Screen Slide Viewer Modal */}
      {slideViewerOpen && currentTopic && (
        <div className="slide-viewer-overlay">
          <div className="slide-viewer">
            <div className="slide-viewer-header">
              <h2>{currentTopic.title}</h2>
              <button className="close-button" onClick={closeSlideViewer}>×</button>
            </div>
            
            <div className="slide-content">
              {currentSlide ? (
                <div className="slide">
                  <h1>{currentSlide.content}</h1>
                  {currentSlide.imageUrl && (
                    <img src={currentSlide.imageUrl} alt="Slide content" />
                  )}
                </div>
              ) : (
                <div className="empty-slide">No slide content available</div>
              )}
            </div>
            
            <div className="slide-navigation">
              <button 
                className="nav-button prev-button" 
                onClick={handlePrevSlide}
                disabled={currentSlideIndex === 0}
              >
                Previous
              </button>
              <div className="slide-counter">
                {currentSlideIndex + 1} / {currentTopicSlides.length}
              </div>
              <button 
                className="nav-button next-button" 
                onClick={handleNextSlide}
                disabled={currentSlideIndex === currentTopicSlides.length - 1}
              >
                Next
              </button>
            </div>
            
            <div className="slide-actions">
              <button className="download-button" onClick={handleDownloadSlides}>
                Download Presentation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SlidesPage;