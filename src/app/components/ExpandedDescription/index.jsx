import React, { useState } from 'react';

const ExpandableDescription = ({ title="View Details", description }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleDescription = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={`expandable-description${isExpanded ? '-expanded' : ''}`}>
        <div className="title">
        <button onClick={toggleDescription}>
            <span className='viewDetails'>{title} 
            {isExpanded ? ' ▼' : ' ▶'}
            </span>
        </button>
      </div>
      {isExpanded && description}
    </div>
  );
};

export default ExpandableDescription;