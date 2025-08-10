import React from 'react';

const TopicsList = ({ topics, onTopicClick }) => {
  return (
    <div className="topics-list">
      {topics.map((topic) => (
        <div 
          key={topic.id} 
          className="topic-item" 
          onClick={() => onTopicClick(topic.timestamp)}
        >
          <div className="topic-timestamp">{topic.timestamp}</div>
          <div className="topic-title">{topic.title}</div>
        </div>
      ))}
    </div>
  );
};

export default TopicsList;