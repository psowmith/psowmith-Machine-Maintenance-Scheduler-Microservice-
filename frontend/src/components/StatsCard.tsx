// src/components/StatsCard.tsx
import React from 'react';
import { IconType } from 'react-icons';

interface StatsCardProps {
  icon: IconType;
  value: number;
  label: string;
  color: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ icon: Icon, value, label, color }) => {
  const cardStyle: React.CSSProperties = {
    background: 'white',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    transition: 'transform 0.3s',
    cursor: 'pointer'
  };

  const iconStyle: React.CSSProperties = {
    fontSize: '40px',
    color
  };

  const valueStyle: React.CSSProperties = {
    fontSize: '28px',
    color: '#333',
    margin: 0
  };

  const labelStyle: React.CSSProperties = {
    color: '#666',
    margin: 0
  };

  return (
    <div 
      style={cardStyle}
      onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
      onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
    >
      <Icon style={iconStyle} />
      <div>
        <h3 style={valueStyle}>{value}</h3>
        <p style={labelStyle}>{label}</p>
      </div>
    </div>
  );
};

export default StatsCard;