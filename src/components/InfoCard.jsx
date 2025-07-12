import React from 'react';
import './InfoCard.css';

const InfoCard = ({ icon, title, value, className }) => {
  return (
    <div className={`info-card ${className || ''}`}>
      <div className="info-icon">{icon}</div>
      <div className="info-content">
        <span className="info-title">{title}</span>
        <span className="info-value">{value}</span>
      </div>
    </div>
  );
};

export default InfoCard;