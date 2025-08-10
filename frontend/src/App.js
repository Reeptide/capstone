import React, { useState } from 'react';
import VideoUpload from './components/VideoUpload';
import VideoPlayerPage from './components/VideoPlayerPage';
import SlidesPage from './components/SlidesPage';
import Navigation from './components/Navigation';
import './styles/App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('upload');
  const [videoFile, setVideoFile] = useState(null);
  const [cleanedVideoUrl, setCleanedVideoUrl] = useState('');
  const [transcript, setTranscript] = useState('');
  const [topics, setTopics] = useState([]);
  const [notes, setNotes] = useState('');
  const [slides, setSlides] = useState([]);
  const [isProcessing, setIsProcessing] = useState({
    transcript: false,
    topics: false,
    notes: false,
    slides: false
  });
  const [completedSteps, setCompletedSteps] = useState({
    transcript: false,
    topics: false,
    notes: false,
    slides: false
  });

  const navigateTo = (page) => {
    setCurrentPage(page);
  };

  // Mock function to simulate file upload
  const handleFileUpload = (file) => {
    setVideoFile(file);
    // In a real app, you would upload the file to your backend here
    // For now we'll just create a temporary URL for the video
    setCleanedVideoUrl(URL.createObjectURL(file));
    // Reset completed steps when a new file is uploaded
    setCompletedSteps({
      transcript: false,
      topics: false,
      notes: false,
      slides: false
    });
  };

  // Mock functions to simulate generating content
  const generateTranscript = async () => {
    // Simulate API call with a delay
    setIsProcessing(prev => ({ ...prev, transcript: true }));
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockTranscript = "This is a sample transcript of the lecture. It contains the spoken content of the video that has been processed using Whisper AI.";
        setTranscript(mockTranscript);
        setIsProcessing(prev => ({ ...prev, transcript: false }));
        setCompletedSteps(prev => ({ ...prev, transcript: true }));
        resolve(mockTranscript);
      }, 2000);
    });
  };

  const generateTopics = async () => {
    // Simulate API call with a delay
    setIsProcessing(prev => ({ ...prev, topics: true }));
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockTopics = [
          { id: 1, title: "Introduction to AI", timestamp: "00:00" },
          { id: 2, title: "Machine Learning Basics", timestamp: "05:30" },
          { id: 3, title: "Neural Networks", timestamp: "12:45" },
          { id: 4, title: "Applications in Real World", timestamp: "18:20" }
        ];
        setTopics(mockTopics);
        setIsProcessing(prev => ({ ...prev, topics: false }));
        setCompletedSteps(prev => ({ ...prev, topics: true }));
        resolve(mockTopics);
      }, 2000);
    });
  };

  const generateNotes = async () => {
    // Simulate API call with a delay
    setIsProcessing(prev => ({ ...prev, notes: true }));
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockNotes = "# Lecture Notes\n\n## Introduction to AI\n- AI is transforming various industries\n- Key concepts include machine learning and neural networks\n\n## Machine Learning Basics\n- Supervised vs. unsupervised learning\n- Common algorithms and their applications\n\n## Neural Networks\n- Structure and components\n- Training methodologies\n\n## Applications in Real World\n- Healthcare applications\n- Financial sector implementations\n- Educational tools and platforms";
        setNotes(mockNotes);
        setIsProcessing(prev => ({ ...prev, notes: false }));
        setCompletedSteps(prev => ({ ...prev, notes: true }));
        resolve(mockNotes);
        // Navigate to video player page after notes are generated
        navigateTo('videoPlayer');
      }, 2000);
    });
  };

  const generateSlides = async () => {
    // Simulate API call with a delay
    setIsProcessing(prev => ({ ...prev, slides: true }));
    return new Promise((resolve) => {
      setTimeout(() => {
        // Updated slides structure - one slide per topic
        const mockSlides = [
          {
            topicId: 1,
            title: "Introduction to AI",
            slides: [
              { id: 1, content: "Introduction to AI", imageUrl: "" }
            ]
          },
          {
            topicId: 2,
            title: "Machine Learning Basics",
            slides: [
              { id: 1, content: "Machine Learning Basics", imageUrl: "" }
            ]
          },
          {
            topicId: 3,
            title: "Neural Networks",
            slides: [
              { id: 1, content: "Neural Networks", imageUrl: "" }
            ]
          },
          {
            topicId: 4,
            title: "Applications in Real World",
            slides: [
              { id: 1, content: "Real World Applications", imageUrl: "" }
            ]
          }
        ];
        setSlides(mockSlides);
        setIsProcessing(prev => ({ ...prev, slides: false }));
        setCompletedSteps(prev => ({ ...prev, slides: true }));
        resolve(mockSlides);
        // Navigate to slides page after slides are generated
        navigateTo('slides');
      }, 2000);
    });
  };

  // Render the appropriate page based on currentPage state
  return (
    <div className="app">
      <header className="app-header">
        <h1>AI-Powered Lecture Video Summarizer</h1>
        
        {/* Keep ONLY ONE navigation - I'm keeping the Navigation component */}
        <Navigation
          onNavigate={navigateTo}
          currentPage={currentPage}
          videoFile={videoFile}
          notes={notes}
          slides={slides}
        />
      </header>

      <main className="app-content">
        {currentPage === 'upload' && (
          <VideoUpload
            onFileUpload={handleFileUpload}
            onGenerateTranscript={generateTranscript}
            onGenerateTopics={generateTopics}
            onGenerateNotes={generateNotes}
            onGenerateSlides={generateSlides}
            videoFile={videoFile}
            isProcessing={isProcessing}
            completedSteps={completedSteps}
          />
        )}
        
        {currentPage === 'videoPlayer' && (
          <VideoPlayerPage
            videoUrl={cleanedVideoUrl}
            topics={topics}
            notes={notes}
            onGoBack={() => navigateTo('upload')}
            onGenerateSlides={generateSlides}
          />
        )}
        
        {currentPage === 'slides' && (
          <SlidesPage
            slides={slides}
            topics={topics}
            onGoBack={() => navigateTo('upload')}
          />
        )}
      </main>

      <footer className="app-footer">
        <p>&copy; {new Date().getFullYear()} AI-Powered Lecture Video Summarizer</p>
      </footer>
    </div>
  );
}

export default App;