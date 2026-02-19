// src/components/MachineCard.tsx
import React from 'react';
import { Machine } from '../types';

interface MachineCardProps {
  machine: Machine;
  isSelected: boolean;
  onClick: (machine: Machine) => void;
  healthScore: number;
}

const MachineCard: React.FC<MachineCardProps> = ({ 
  machine, 
  isSelected, 
  onClick, 
  healthScore 
}) => {
  const cardStyle: React.CSSProperties = {
    background: '#f8f9fa',
    borderRadius: '8px',
    padding: '15px',
    cursor: 'pointer',
    transition: 'all 0.3s',
    border: isSelected ? '2px solid #667eea' : '2px solid transparent',
    backgroundColor: isSelected ? '#f0f3ff' : '#f8f9fa'
  };

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px'
  };

  const titleStyle: React.CSSProperties = {
    color: '#333',
    fontSize: '16px',
    margin: 0
  };

  const getStatusColor = (status: string): string => {
    const colors: Record<string, string> = {
      'Operational': '#4caf50',
      'Needs Maintenance': '#ff9800',
      'Under Maintenance': '#f44336'
    };
    return colors[status] || '#9e9e9e';
  };

  const statusBadgeStyle: React.CSSProperties = {
    padding: '4px 8px',
    borderRadius: '4px',
    color: 'white',
    fontSize: '12px',
    fontWeight: 500,
    backgroundColor: getStatusColor(machine.status)
  };

  const detailsStyle: React.CSSProperties = {
    marginBottom: '15px'
  };

  const detailTextStyle: React.CSSProperties = {
    color: '#666',
    fontSize: '13px',
    margin: '5px 0'
  };

  const healthBarStyle: React.CSSProperties = {
    height: '20px',
    background: '#e0e0e0',
    borderRadius: '10px',
    position: 'relative',
    overflow: 'hidden'
  };

  const getHealthColor = (score: number): string => {
    if (score > 70) return '#4caf50';
    if (score > 40) return '#ff9800';
    return '#f44336';
  };

  const healthFillStyle: React.CSSProperties = {
    height: '100%',
    width: `${healthScore}%`,
    backgroundColor: getHealthColor(healthScore),
    transition: 'width 0.3s'
  };

  const healthTextStyle: React.CSSProperties = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    color: 'white',
    fontSize: '11px',
    fontWeight: 'bold',
    textShadow: '0 1px 2px rgba(0,0,0,0.3)'
  };

  return (
    <div 
      style={cardStyle}
      onClick={() => onClick(machine)}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-3px)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <div style={headerStyle}>
        <h3 style={titleStyle}>{machine.name}</h3>
        <span style={statusBadgeStyle}>{machine.status}</span>
      </div>
      
      <div style={detailsStyle}>
        <p style={detailTextStyle}><strong>ID:</strong> {machine.machine_id}</p>
        <p style={detailTextStyle}><strong>Location:</strong> {machine.location}</p>
        <p style={detailTextStyle}>
          <strong>Last Maintenance:</strong> {machine.last_maintenance_date || 'Never'}
        </p>
        <p style={detailTextStyle}>
          <strong>Interval:</strong> {machine.maintenance_interval_days} days
        </p>
      </div>

      <div style={healthBarStyle}>
        <div style={healthFillStyle} />
        <span style={healthTextStyle}>{healthScore}% Healthy</span>
      </div>
    </div>
  );
};

export default MachineCard;