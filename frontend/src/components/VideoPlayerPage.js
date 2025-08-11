
import React, { useEffect, useRef, useState } from 'react';
import '../styles/VideoPlayerPage.css';

const VideoPlayerPage = ({ videoUrl, topics, onGoBack, onGenerateSlides }) => {
  const videoRef = useRef(null);
  const progressBarRef = useRef(null);
  const [currentTopic, setCurrentTopic] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const videoTitle = "Lecture Video with Topics";
  
  // Format timestamp from seconds to MM:SS format
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Convert timestamp from "MM:SS" format to seconds
  const timestampToSeconds = (timestamp) => {
    if (!timestamp) return 0;
    const [minutes, seconds] = timestamp.split(':').map(Number);
    return minutes * 60 + seconds;
  };

  // Jump to specific topic
  const jumpToTopic = (topic) => {
    if (videoRef.current && topic.timestamp) {
      const timeInSeconds = timestampToSeconds(topic.timestamp);
      
      videoRef.current.currentTime = timeInSeconds;
      setCurrentTopic(topic);
      
      // Play video if it's paused
      if (videoRef.current.paused) {
        videoRef.current.play().catch(e => {
          console.log('Could not auto-play video:', e);
        });
      }
    }
  };

  // Handle video time update
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const currentTimeInSeconds = videoRef.current.currentTime;
      setCurrentTime(currentTimeInSeconds);
      
      // Update progress bar
      if (progressBarRef.current && videoRef.current.duration) {
        const progress = (currentTimeInSeconds / videoRef.current.duration) * 100;
        progressBarRef.current.style.width = `${progress}%`;
      }
      
      // Find current topic based on timestamp
      if (topics && topics.length) {
        // Convert topics timestamps to seconds for comparison
        const topicsWithSeconds = topics.map(topic => {
          const startSeconds = timestampToSeconds(topic.timestamp);
          const endSeconds = topic.endTimestamp ? timestampToSeconds(topic.endTimestamp) : Infinity;
          return {
            ...topic,
            startSeconds,
            endSeconds
          };
        });
        
        // Find the current topic based on video current time
        let found = false;
        for (let i = 0; i < topicsWithSeconds.length; i++) {
          if (currentTimeInSeconds >= topicsWithSeconds[i].startSeconds && 
              (i === topicsWithSeconds.length - 1 || currentTimeInSeconds < topicsWithSeconds[i+1].startSeconds)) {
            if (currentTopic?.id !== topicsWithSeconds[i].id) {
              setCurrentTopic(topicsWithSeconds[i]);
            }
            found = true;
            break;
          }
        }
        
        if (!found && currentTopic !== null) {
          setCurrentTopic(null);
        }
      }
    }
  };

  // Handle video metadata loaded
  const handleMetadataLoaded = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      
      // Create topic markers once we know the video duration
      const topicMarkersContainer = document.querySelector('.topic-markers');
      if (topicMarkersContainer) {
        topicMarkersContainer.innerHTML = '';
        topics.forEach((topic) => {
          const timeInSeconds = timestampToSeconds(topic.timestamp);
          const position = (timeInSeconds / videoRef.current.duration) * 100;
          
          const marker = document.createElement('div');
          marker.className = 'topic-marker';
          marker.style.left = `${position}%`;
          marker.title = topic.title;
          topicMarkersContainer.appendChild(marker);
        });
      }
    }
  };

  // Handle PDF download
  const handleDownloadPDF = () => {
    const link = document.createElement('a');
    link.href = '/IPCV_Lecture_Notes_PDF_Transcript.pdf'; // Path to your PDF file
    link.download = 'IPCV_Lecture_Notes_PDF_Transcript.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Add keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Only handle if not in an input field
      if (e.target.tagName.toLowerCase() === 'input') return;
      
      if (videoRef.current) {
        switch(e.key) {
          case ' ': // Space bar
            e.preventDefault();
            if (videoRef.current.paused) {
              videoRef.current.play();
            } else {
              videoRef.current.pause();
            }
            break;
          case 'ArrowRight':
            e.preventDefault();
            videoRef.current.currentTime += 10; // Skip forward 10s
            break;
          case 'ArrowLeft':
            e.preventDefault();
            videoRef.current.currentTime -= 10; // Skip backward 10s
            break;
          case 'ArrowUp':
            e.preventDefault();
            // Jump to previous topic
            if (topics && currentTopic) {
              const currentIndex = topics.findIndex(topic => topic.id === currentTopic.id);
              if (currentIndex > 0) {
                jumpToTopic(topics[currentIndex - 1]);
              }
            }
            break;
          case 'ArrowDown':
            e.preventDefault();
            // Jump to next topic
            if (topics && currentTopic) {
              const currentIndex = topics.findIndex(topic => topic.id === currentTopic.id);
              if (currentIndex < topics.length - 1) {
                jumpToTopic(topics[currentIndex + 1]);
              }
            }
            break;
          default:
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [topics, currentTopic]);

  // Get current date in YYYY-MM-DD HH:MM:SS format
  const getCurrentDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  return (
    <div className="video-player-container">
      <div className="player-wrapper">
        <div className="video-sidebar">
          <h2 className="sidebar-title">📚 Topics Timeline</h2>
          <ul className="topics-list">
            {topics && topics.map((topic) => (
              <li 
                key={topic.id} 
                className={`topic-item ${currentTopic?.id === topic.id ? 'active' : ''}`}
                onClick={() => jumpToTopic(topic)}
              >
                <div className="topic-content">
                  <div className="topic-name">{topic.title}</div>
                  <div className="topic-time">
                    <span>{topic.timestamp}</span>
                    {topic.endTimestamp && (
                      <span className="topic-duration">
                        - {topic.endTimestamp}
                      </span>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
          
          <div className="controls-info">
            <h3>⌨️ Keyboard Shortcuts</h3>
            <div>Space: Play/Pause</div>
            <div>← →: Skip 10s</div>
            <div>↑ ↓: Previous/Next Topic</div>
          </div>
        </div>

        <div className="main-video-section">
          <div className="video-container">
            <div className="timestamp-display">{getCurrentDate()}</div>
            <video 
              ref={videoRef}
              controls 
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleMetadataLoaded}
              preload="metadata"
            >
              <source src="/output_cleaned_vad.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            
            <div className="video-controls">
              <div className="progress-container">
                <div className="progress-bar-container">
                  <div className="progress-bar" ref={progressBarRef}></div>
                  <div className="topic-markers"></div>
                </div>
                <div className="time-display">
                  <span>{formatTime(currentTime)}</span>
                  <span>/</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="video-info">
            <div className="video-title-container">
              <h1 className="video-title">{videoTitle}</h1>
              <div className="video-meta">
                <span>📊 {topics?.length || 0} Topics</span>
                <span>⏱️ Duration: {formatTime(duration)}</span>
              </div>
            </div>
            
            <div className="current-topic-display">
              {currentTopic ? (
                <>
                  <div className="currently-playing">Currently Playing</div>
                  <div className="current-topic-title">{currentTopic.title}</div>
                  <div className="current-topic-time">{currentTopic.timestamp} - {currentTopic.endTimestamp || 'end'}</div>
                </>
              ) : (
                <div className="no-topic-message">Click on any topic to jump to that section</div>
              )}
            </div>
          </div>
          
          <div className="action-buttons">
            <button className="back-button" onClick={onGoBack}>
              Back to Video Upload
            </button>
            <button className="pdf-download-button" onClick={handleDownloadPDF}>
              Download PDF
            </button>
            <button className="generate-slides-button" onClick={onGenerateSlides}>
              Generate Slides
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayerPage;