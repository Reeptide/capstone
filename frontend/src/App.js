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
    // Create default topics if none exist
    const defaultTopics = [
      { id: 1, title: "Morphological Processing and Image Denoising", timestamp: "00:00", endTimestamp: "08:04" },
      { id: 2, title: "Homogeneity Criteria for Region Segmentation", timestamp: "08:05", endTimestamp: "12:30" },
      { id: 3, title: "Edge Detection Fundamentals and Types of Edges", timestamp: "12:31", endTimestamp: "20:30" },
      { id: 4, title: "Edges, Lines, and Points in Image Processing", timestamp: "20:31", endTimestamp: "27:00" },
      { id: 5, title: "Edge Detection using First and Second Order Differencing", timestamp: "27:01", endTimestamp: "33:59" }
    ];
    
    setTopics(defaultTopics);
    setCompletedSteps(prev => ({ ...prev, topics: true }));
    
    // Fetch topics from the text file
    fetch('/topics.txt')
      .then(response => response.text())
      .then(text => {
        parseTopicsFromText(text);
      })
      .catch(error => {
        console.error("Error loading topics.txt:", error);
        console.log("Using default topics instead");
      });
  }, []);

  // Log topics whenever they change
  useEffect(() => {
    console.log("Current topics state:", topics);
  }, [topics]);

  // Parse topics from text content
  const parseTopicsFromText = (text) => {
    // Filter out any lines that might be metadata or empty
    const lines = text.split('\n').filter(line => {
      const trimmed = line.trim();
      return trimmed !== '' && 
             !trimmed.startsWith('Current Date') && 
             !trimmed.startsWith('Current User');
    });
    
    console.log("Parsing topics from lines:", lines);
    
    const parsedTopics = lines.map((line, index) => {
      // Match pattern: "Topic Title [MM:MM-MM:MM]"
      const match = line.match(/^(.+) \[(\d+:\d+)-(\d+:\d+)\]$/);
      if (match) {
        const title = match[1].trim();
        const timestamp = match[2].trim(); // Start timestamp
        return {
          id: index + 1,
          title: title,
          timestamp: timestamp,
          endTimestamp: match[3].trim() // Store end timestamp too
        };
      }
      return null;
    }).filter(Boolean);
    
    console.log("Parsed topics:", parsedTopics);
    
    // Only set topics if we found any
    if (parsedTopics.length > 0) {
      setTopics(parsedTopics);
      // Mark topics as completed since we loaded them
      setCompletedSteps(prev => ({ ...prev, topics: true }));
    }
  };

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
      topics: true, // Set topics to true to keep our default topics
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
        // Already using default topics
        setIsProcessing(prev => ({ ...prev, topics: false }));
        setCompletedSteps(prev => ({ ...prev, topics: true }));
        resolve(topics);
      }, 2000);
    });
  };

  const generateNotes = async () => {
    // Simulate API call with a delay
    setIsProcessing(prev => ({ ...prev, notes: true }));
    return new Promise((resolve) => {
      setTimeout(() => {
        // Create notes that match the topics from the file
        const imageProcessingNotes = "# Image Processing Lecture Notes\n\n" +
          "## Morphological Processing and Image Denoising\n" +
          "- Morphological operations transform images based on shapes\n" +
          "- Key operations: erosion, dilation, opening, closing\n" +
          "- Applications in noise removal and feature extraction\n" +
          "- Structuring element determines the effect of operations\n\n" +
          
          "## Homogeneity Criteria for Region Segmentation\n" +
          "- Region growing starts from seed points\n" +
          "- Pixel similarity based on intensity, texture, color\n" +
          "- Thresholding techniques for region identification\n\n" +
          
          "## Edge Detection Fundamentals\n" +
          "- Edges represent boundaries between regions\n" +
          "- Edge types: step, ramp, line, roof\n" +
          "- Noise affects edge detection accuracy\n" +
          "- Pre-processing with smoothing filters improves results\n\n" +
          
          "## Edges, Lines, and Points in Image Processing\n" +
          "- Points of interest often at corners and junctions\n" +
          "- Line detection using Hough transform\n" +
          "- Corner detection with Harris operator\n" +
          "- Feature point tracking in video sequences\n\n" +
          
          "## Edge Detection using First and Second Order Differencing\n" +
          "- First-order operators: Sobel, Prewitt, Roberts\n" +
          "- Second-order operators: Laplacian\n" +
          "- Laplacian of Gaussian (LoG) combines smoothing and edge detection\n" +
          "- Zero-crossing detection in second-order methods";
        
        setNotes(imageProcessingNotes);
        setIsProcessing(prev => ({ ...prev, notes: false }));
        setCompletedSteps(prev => ({ ...prev, notes: true }));
        
        // Navigate to video player page after notes are generated
        navigateTo('videoPlayer');
        
        resolve(imageProcessingNotes);
      }, 2000);
    });
  };

  const generateSlides = async () => {
    // Simulate API call with a delay
    setIsProcessing(prev => ({ ...prev, slides: true }));
    return new Promise((resolve) => {
      setTimeout(() => {
        // Generate slides based on topics
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