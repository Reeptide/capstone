import React, { useRef } from 'react';
import '../styles/VideoUpload.css';

const VideoUpload = ({ 
  onFileUpload, 
  videoFile, 
  onGenerateTranscript, 
  onGenerateTopics, 
  onGenerateNotes,
  onGenerateSlides,
  isProcessing,
  completedSteps
}) => {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('video/')) {
      onFileUpload(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith('video/')) {
        onFileUpload(file);
      }
    }
  };

  return (
    <div className="upload-container">
      <div className="upload-area">
        <div 
          className="upload-box"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current.click()}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            style={{ display: 'none' }} 
            accept="video/*"
            onChange={handleFileChange}
          />
          <div className="upload-icon">+</div>
          <div className="upload-text">{videoFile ? 'Change Video' : 'Upload Video'}</div>
        </div>
        <div className="upload-info">Upload your lecture video (MP4 format)</div>
      </div>
      
      {videoFile && (
        <div className="uploaded-file">
          <div className="file-label">Uploaded:</div>
          <div className="file-name">{videoFile.name}</div>
        </div>
      )}
      
      <div className="generate-buttons">
        <div className="button-row">
          <div className="button-container">
            <button 
              className="generate-button"
              onClick={onGenerateTranscript}
              disabled={isProcessing.transcript || !videoFile}
            >
              {isProcessing.transcript ? (
                <>
                  <span className="button-spinner"></span>
                  Generating...
                </>
              ) : (
                'Generate Transcript'
              )}
            </button>
            {completedSteps.transcript && !isProcessing.transcript && (
              <div className="completion-message">✓ Transcript generated!</div>
            )}
          </div>
          
          <div className="button-container">
            <button 
              className="generate-button"
              onClick={onGenerateTopics}
              disabled={isProcessing.topics || !videoFile || !completedSteps.transcript}
            >
              {isProcessing.topics ? (
                <>
                  <span className="button-spinner"></span>
                  Generating...
                </>
              ) : (
                'Generate Topics'
              )}
            </button>
            {completedSteps.topics && !isProcessing.topics && (
              <div className="completion-message">✓ Topics generated!</div>
            )}
          </div>
        </div>
        
        <div className="button-row">
          <div className="button-container">
            <button 
              className="generate-button"
              onClick={onGenerateNotes}
              disabled={isProcessing.notes || !videoFile || !completedSteps.topics}
            >
              {isProcessing.notes ? (
                <>
                  <span className="button-spinner"></span>
                  Generating...
                </>
              ) : (
                'Generate Notes'
              )}
            </button>
            {completedSteps.notes && !isProcessing.notes && (
              <div className="completion-message">✓ Notes generated!</div>
            )}
          </div>
          
          <div className="button-container">
            <button 
              className="generate-button"
              onClick={onGenerateSlides}
              disabled={isProcessing.slides || !videoFile || !completedSteps.notes}
            >
              {isProcessing.slides ? (
                <>
                  <span className="button-spinner"></span>
                  Generating...
                </>
              ) : (
                'Generate Slides'
              )}
            </button>
            {completedSteps.slides && !isProcessing.slides && (
              <div className="completion-message">✓ Slides generated!</div>
            )}
          </div>
        </div>
      </div>
      
      <div className="process-flow">
        <div className={`process-step ${completedSteps.transcript ? 'completed' : ''}`}>
          1. Generate Transcript
        </div>
        <div className="process-arrow">→</div>
        <div className={`process-step ${completedSteps.topics ? 'completed' : ''}`}>
          2. Generate Topics
        </div>
        <div className="process-arrow">→</div>
        <div className={`process-step ${completedSteps.notes ? 'completed' : ''}`}>
          3. Generate Notes
        </div>
        <div className="process-arrow">→</div>
        <div className={`process-step ${completedSteps.slides ? 'completed' : ''}`}>
          4. Generate Slides
        </div>
      </div>
    </div>
  );
};

export default VideoUpload;