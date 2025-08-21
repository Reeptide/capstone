import React, { useState, useEffect } from 'react';
import '../styles/SlidesPage.css';

const FALLBACK_IMAGE = '/slide_previews/ppt_icon.png'; // Place a PPT icon here

const SlidesPage = ({ slides, onGoBack }) => {
  const [topics, setTopics] = useState([]);
  const [currentTopicId, setCurrentTopicId] = useState(null);
  const [slideViewerOpen, setSlideViewerOpen] = useState(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [slideImages, setSlideImages] = useState({});

  useEffect(() => {
    fetch('/topics1.txt')
      .then(response => response.text())
      .then(text => {
        const lines = text.split('\n').map(line => line.trim()).filter(Boolean);
        const parsedTopics = lines.map((line, idx) => ({
          id: idx + 1,
          title: line
        }));
        setTopics(parsedTopics);
      })
      .catch(error => {
        console.error("Error loading topics1.txt:", error);
      });

    // Update the previewMap to match your actual topic IDs and file names
    const previewMap = {
      1: [
        '/slide_previews/fundamentals_1.jpg',
        '/slide_previews/fundamentals_2.jpg',
        '/slide_previews/fundamentals_3.jpg',
        '/slide_previews/fundamentals_4.jpg',
        '/slide_previews/fundamentals_5.jpg',
        '/slide_previews/fundamentals_6.jpg',
        '/slide_previews/fundamentals_7.jpg',
        '/slide_previews/fundamentals_8.jpg'
      ],
      2: [
        '/slide_previews/point_line_edge_1.jpg',
        '/slide_previews/point_line_edge_2.jpg'
      ],
      3: [
        '/slide_previews/thresholding_1.jpg',
        '/slide_previews/thresholding_2.jpg'
      ],
      4: [
        '/slide_previews/region_growing_1.jpg',
        '/slide_previews/region_growing_2.jpg'
      ],
      5: []
    };
    setSlideImages(previewMap);
  }, []);

  const currentTopic = slides.find(slide => slide.topicId === currentTopicId);
  const currentTopicSlides = currentTopic?.slides || [];
  const currentPreviewImages = currentTopic ? (slideImages[currentTopic.topicId] || []) : [];

  const handleTopicSelect = (topicId) => {
    setCurrentTopicId(topicId);
    setCurrentSlideIndex(0);
  };

  const handleSlideIconClick = (topicId) => {
    setCurrentTopicId(topicId);
    setCurrentSlideIndex(0);
    setSlideViewerOpen(true);
  };

  const handleNextSlide = () => {
    if (currentSlideIndex < currentPreviewImages.length - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1);
    }
  };
  const handlePrevSlide = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1);
    }
  };

  const handleDownloadSlides = () => {
    if (!currentTopic) return;
    const pptMap = {
      1: 'Image_Segmentation_Final_With_Diagram.pptx',
      2: 'point_line_edge_detection.pptx',
      3: 'thresholding.pptx',
      4: 'region_growing_splitting.pptx',
      5: 'merging.pptx'
    };
    const pptName = pptMap[currentTopic.topicId] || 'slides.pptx';
    const link = document.createElement('a');
    link.href = `/${pptName}`;
    link.download = pptName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const closeSlideViewer = () => {
    setSlideViewerOpen(false);
  };

  const getPresentationTitle = (topicId) => {
    const topic = topics.find(t => t.id === topicId);
    return topic ? topic.title : 'Presentation';
  };

  // Helper to render an image with fallback
  const renderSlideImage = (src, alt) => (
    <img
      src={src}
      alt={alt}
      className="slide-preview-image"
      onError={e => {
        e.target.onerror = null;
        e.target.src = FALLBACK_IMAGE;
      }}
    />
  );

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
              const topicSlides = slides.find(slide => slide.topicId === topic.id);
              const slideCount = topicSlides?.slides?.length || 0;
              return (
                <div key={topic.id}
                  className={`table-row ${currentTopicId === topic.id ? 'active-row' : ''}`}>
                  <div className={`topic-cell ${currentTopicId === topic.id ? 'active' : ''}`}
                    onClick={() => handleTopicSelect(topic.id)}>
                    <div className="topic-title">{topic.title}</div>
                  </div>
                  <div className={`slide-cell ${currentTopicId === topic.id ? 'active' : ''}`}
                    onClick={() => handleSlideIconClick(topic.id)}>
                    <div className="slide-icon-wrapper">
                      <div className="slide-icon">
                        <span>PPT</span>
                      </div>
                      <span className="slide-count">{slideImages[topic.id]?.length || slideCount}</span>
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
                  <h2>{getPresentationTitle(currentTopic.topicId)}</h2>
                  <div className="preview-controls">
                    <button
                      className="preview-nav-button"
                      onClick={handlePrevSlide}
                      disabled={currentSlideIndex === 0}
                    >
                      ◀
                    </button>
                    <div className="preview-counter">
                      {currentSlideIndex + 1} / {currentPreviewImages.length || 1}
                    </div>
                    <button
                      className="preview-nav-button"
                      onClick={handleNextSlide}
                      disabled={currentSlideIndex === (currentPreviewImages.length - 1) || currentPreviewImages.length === 0}
                    >
                      ▶
                    </button>
                  </div>
                </div>
                <div className="preview-slide">
                  {currentPreviewImages.length > 0 ? (
                    renderSlideImage(currentPreviewImages[currentSlideIndex], `Slide ${currentSlideIndex + 1}`)
                  ) : (
                    <div className="empty-preview">
                      <img src={FALLBACK_IMAGE} alt="PPT" style={{ width: 64, height: 64, marginBottom: 16 }} />
                      <h3>{getPresentationTitle(currentTopic.topicId)}</h3>
                      <p>No preview available</p>
                      <p className="file-name">
                        {(() => {
                          const pptMap = {
                            1: 'Image_Segmentation_Final_With_Diagram.pptx',
                            2: 'point_line_edge_detection.pptx',
                            3: 'thresholding.pptx',
                            4: 'region_growing_splitting.pptx',
                            5: 'merging.pptx'
                          };
                          return pptMap[currentTopic.topicId] || 'slides.pptx';
                        })()}
                      </p>
                    </div>
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
      {/* Slide Viewer Modal */}
      {slideViewerOpen && currentTopic && (
        <div className="slide-viewer-overlay">
          <div className="slide-viewer">
            <div className="slide-viewer-header">
              <h2>{getPresentationTitle(currentTopic.topicId)}</h2>
              <button className="close-button" onClick={closeSlideViewer}>×</button>
            </div>
            <div className="slide-content">
              {currentPreviewImages.length > 0 ? (
                renderSlideImage(currentPreviewImages[currentSlideIndex], `Slide ${currentSlideIndex + 1}`)
              ) : (
                <div className="empty-slide">
                  <img src={FALLBACK_IMAGE} alt="PPT" style={{ width: 64, height: 64, marginBottom: 16 }} />
                  <h3>{getPresentationTitle(currentTopic.topicId)}</h3>
                  <p>No preview available</p>
                  <p className="file-name">
                    {(() => {
                      const pptMap = {
                        1: 'Image_Segmentation_Final_With_Diagram.pptx',
                        2: 'point_line_edge_detection.pptx',
                        3: 'thresholding.pptx',
                        4: 'region_growing_splitting.pptx',
                        5: 'merging.pptx'
                      };
                      return pptMap[currentTopic.topicId] || 'slides.pptx';
                    })()}
                  </p>
                </div>
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
                {currentSlideIndex + 1} / {currentPreviewImages.length || 1}
              </div>
              <button
                className="nav-button next-button"
                onClick={handleNextSlide}
                disabled={currentSlideIndex === (currentPreviewImages.length - 1) || currentPreviewImages.length === 0}
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