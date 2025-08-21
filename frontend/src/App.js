import React, { useState, useEffect } from 'react';
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

  // Load topics from topics.txt on component mount
  useEffect(() => {
    fetch('/topics.txt')
      .then(response => response.text())
      .then(text => {
        parseTopicsFromText(text);
      })
      .catch(error => {
        console.error("Error loading topics.txt:", error);
      });

    // Optionally: create topics1.txt for SlidesPage if used elsewhere
    const topics1Content =
      "Morphological Processing and Image Denoising\n" +
      "Homogeneity Criteria for Region Segmentation and Edge Detection Fundamentals\n" +
      "Edges, Lines, and Points in Image Processing\n" +
      "Edge Detection using First and Second Order Differencing";
    localStorage.setItem('topics1_content', topics1Content);
  }, []);

  useEffect(() => {
    console.log("Current topics state:", topics);
  }, [topics]);

  // Parse topics from text content (topics.txt)
  const parseTopicsFromText = (text) => {
    const lines = text.split('\n').map(line => line.trim()).filter(Boolean);

    const parsedTopics = lines.map((line, index) => {
      // Pattern: "Topic Title [MM:MM-MM:MM]"
      const match = line.match(/^(.+?) \[(\d{2}:\d{2})-(\d{2}:\d{2})\]$/);
      if (match) {
        const title = match[1].trim();
        const timestamp = match[2].trim();
        const endTimestamp = match[3].trim();
        return {
          id: index + 1,
          title: title,
          timestamp: timestamp,
          endTimestamp: endTimestamp
        };
      }
      return null;
    }).filter(Boolean);

    if (parsedTopics.length > 0) {
      setTopics(parsedTopics);
      setCompletedSteps(prev => ({ ...prev, topics: true }));
    }
  };

  const navigateTo = (page) => {
    setCurrentPage(page);
  };

  // Mock function to simulate file upload
  const handleFileUpload = (file) => {
    setVideoFile(file);
    setCleanedVideoUrl(URL.createObjectURL(file));
    setCompletedSteps({
      transcript: false,
      topics: completedSteps.topics,
      notes: false,
      slides: false
    });
  };

  // Mock functions to simulate generating content
  const generateTranscript = async () => {
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
    // Just mark as completed, topics already loaded from topics.txt
    setIsProcessing(prev => ({ ...prev, topics: true }));
    return new Promise((resolve) => {
      setTimeout(() => {
        setIsProcessing(prev => ({ ...prev, topics: false }));
        setCompletedSteps(prev => ({ ...prev, topics: true }));
        resolve(topics);
      }, 2000);
    });
  };

  const generateNotes = async () => {
    setIsProcessing(prev => ({ ...prev, notes: true }));
    return new Promise((resolve) => {
      setTimeout(() => {
        // Example notes using topics
        const imageProcessingNotes = "# Lecture Notes\n\n" +
          topics.map(topic => `## ${topic.title}\n- Notes for this topic\n`).join('\n');
        setNotes(imageProcessingNotes);
        setIsProcessing(prev => ({ ...prev, notes: false }));
        setCompletedSteps(prev => ({ ...prev, notes: true }));
        navigateTo('videoPlayer');
        resolve(imageProcessingNotes);
      }, 2000);
    });
  };

  const generateSlides = async () => {
    setIsProcessing(prev => ({ ...prev, slides: true }));
    return new Promise((resolve) => {
      setTimeout(() => {
        const generatedSlides = topics.map(topic => ({
          topicId: topic.id,
          title: topic.title,
          slides: [
            { id: 1, content: topic.title, imageUrl: "" },
            { id: 2, content: `Key concepts in ${topic.title.toLowerCase()}`, imageUrl: "" }
          ]
        }));

        setSlides(generatedSlides);
        setIsProcessing(prev => ({ ...prev, slides: false }));
        setCompletedSteps(prev => ({ ...prev, slides: true }));
        resolve(generatedSlides);
        navigateTo('slides');
      }, 2000);
    });
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>AI-Powered Lecture Video Summarizer</h1>
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
            videoUrl="output_cleaned_vad.mp4"
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
            onGoBack={() => navigateTo('videoPlayer')}
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