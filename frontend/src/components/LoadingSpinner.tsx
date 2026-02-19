// src/components/LoadingSpinner.tsx
import React from 'react';

const LoadingSpinner: React.FC = () => (
  <div style={{
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'white'
  }}>
    <div style={{
      border: '5px solid #f3f3f3',
      borderTop: '5px solid #667eea',
      borderRadius: '50%',
      width: '50px',
      height: '50px',
      animation: 'spin 1s linear infinite',
      marginBottom: '20px'
    }} />
    <style>
      {`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}
    </style>
    <h2>Loading Machine Maintenance System...</h2>
  </div>
);

export default LoadingSpinner;