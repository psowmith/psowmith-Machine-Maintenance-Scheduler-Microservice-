// src/components/Header.tsx
import React from 'react';
import { FiCpu } from 'react-icons/fi';

const Header: React.FC = () => {
  const headerStyle: React.CSSProperties = {
    background: 'white',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    padding: '20px 0',
    marginBottom: '30px'
  };

  const contentStyle: React.CSSProperties = {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '0 30px'
  };

  const titleStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    color: '#333',
    fontSize: '28px'
  };

  const iconStyle: React.CSSProperties = {
    color: '#667eea',
    fontSize: '32px'
  };

  const subtitleStyle: React.CSSProperties = {
    color: '#666',
    marginTop: '5px'
  };

  return (
    <header style={headerStyle}>
      <div style={contentStyle}>
        <h1 style={titleStyle}>
          <FiCpu style={iconStyle} />
          Machine Maintenance Scheduler
        </h1>
        <p style={subtitleStyle}>Real-time monitoring and maintenance management</p>
      </div>
    </header>
  );
};

export default Header;