import React, { forwardRef } from 'react';

const VideoPlayer = forwardRef(({ videoUrl }, ref) => {
  return (
    <div className="video-player">
      <video 
        ref={ref}
        src={videoUrl} 
        controls 
        width="100%" 
        height="auto"
        poster="/video-placeholder.png"
      >
        Your browser does not support the video tag.
      </video>
      <div className="video-controls">
        <div className="time-stamps">
          <div className="current-time">00:00</div>
          <div className="duration">00:00</div>
        </div>
      </div>
    </div>
  );
});

export default VideoPlayer;