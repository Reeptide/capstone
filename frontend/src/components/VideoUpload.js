import React, { useState } from 'react';
import '../styles/VideoUpload.css';

const VideoUpload = ({ 
  onFileUpload, 
  onGenerateTranscript,
  onGenerateTopics,
  onGenerateNotes,
  onGenerateSlides,
  videoFile,
  isProcessing,
  completedSteps
}) => {
  const [dragActive, setDragActive] = useState(false);
  
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileUpload(e.dataTransfer.files[0]);
    }
  };
  
  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      onFileUpload(e.target.files[0]);
    }
  };
  
  return (
    <div className="upload-container">
      <h2 className="upload-title">Upload Your Lecture Video</h2>
      
      <div 
        className={`upload-area ${dragActive ? 'drag-active' : ''} ${videoFile ? 'has-file' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="upload-content">
          {!videoFile ? (
            <>
              <div className="upload-icon">+</div>
              <p className="upload-text">Change Video</p>
              <input 
                type="file" 
                id="video-upload" 
                accept="video/mp4,video/webm,video/ogg" 
                className="file-input"
                onChange={handleChange}
              />
              <p className="upload-hint">Upload your lecture video (MP4 format)</p>
            </>
          ) : (
            <>
              <div className="upload-icon check">✓</div>
              <p className="upload-text">Uploaded: {videoFile.name}</p>
              <label htmlFor="video-upload" className="change-file-btn">
                Change Video
                <input 
                  type="file" 
                  id="video-upload" 
                  accept="video/mp4,video/webm,video/ogg" 
                  className="file-input"
                  onChange={handleChange}
                />
              </label>
            </>
          )}
        </div>
      </div>
      
      {videoFile && (
        <div className="processing-container">
          <div className="processing-steps">
            <button 
              className={`process-button ${isProcessing.transcript ? 'processing' : ''} ${completedSteps.transcript ? 'completed' : ''}`}
              onClick={onGenerateTranscript}
              disabled={isProcessing.transcript}
            >
              {isProcessing.transcript ? 'Generating...' : 'Generate Transcript'}
              {completedSteps.transcript && <span className="check-icon">✓</span>}
            </button>
            
            <button 
              className={`process-button ${isProcessing.topics ? 'processing' : ''} ${completedSteps.topics ? 'completed' : ''}`}
              onClick={onGenerateTopics}
              disabled={isProcessing.topics || !completedSteps.transcript}
            >
              {isProcessing.topics ? 'Generating...' : 'Generate Topics'}
              {completedSteps.topics && <span className="check-icon">✓</span>}
            </button>
            
            <button 
              className={`process-button ${isProcessing.notes ? 'processing' : ''} ${completedSteps.notes ? 'completed' : ''}`}
              onClick={onGenerateNotes}
              disabled={isProcessing.notes || !completedSteps.topics}
            >
              {isProcessing.notes ? 'Generating...' : 'Generate Notes'}
              {completedSteps.notes && <span className="check-icon">✓</span>}
            </button>
            
            <button 
              className={`process-button ${isProcessing.slides ? 'processing' : ''} ${completedSteps.slides ? 'completed' : ''}`}
              onClick={onGenerateSlides}
              disabled={isProcessing.slides || !completedSteps.notes}
            >
              {isProcessing.slides ? 'Generating...' : 'Generate Slides'}
              {completedSteps.slides && <span className="check-icon">✓</span>}
            </button>
          </div>
          
          <div className="workflow-steps">
            <div className={`workflow-step ${completedSteps.transcript ? 'active' : ''}`}>
              1. Generate Transcript
            </div>
            <div className="workflow-arrow">→</div>
            <div className={`workflow-step ${completedSteps.topics ? 'active' : ''}`}>
              2. Generate Topics
            </div>
            <div className="workflow-arrow">→</div>
            <div className={`workflow-step ${completedSteps.notes ? 'active' : ''}`}>
              3. Generate Notes
            </div>
            <div className="workflow-arrow">→</div>
            <div className={`workflow-step ${completedSteps.slides ? 'active' : ''}`}>
              4. Generate Slides
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoUpload;