// src/components/TaskList.tsx
import React, { useState } from 'react';
import { FiCalendar, FiAlertCircle } from 'react-icons/fi';
import { MaintenanceTask } from '../types';

interface TaskListProps {
  tasks: MaintenanceTask[];
  onComplete: (taskId: string) => void;
}

// Helper functions
const parseDate = (dateStr: string): Date => {
  if (!dateStr) return new Date();
  const [day, month, year] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
};

const formatDate = (dateStr: string): string => {
  if (!dateStr) return 'Not scheduled';
  const [day, month, year] = dateStr.split('-');
  return `${day}/${month}/${year}`;
};

const isOverdue = (scheduledDate: string): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const scheduled = parseDate(scheduledDate);
  scheduled.setHours(0, 0, 0, 0);
  return scheduled < today;
};

const TaskList: React.FC<TaskListProps> = ({ tasks, onComplete }) => {
  const [hoveredTask, setHoveredTask] = useState<string | null>(null);

  const getStatusColor = (status: string): string => {
    const colors: Record<string, string> = {
      'Scheduled': '#2196f3',
      'Pending': '#ff9800',
      'In Progress': '#9c27b0',
      'Completed': '#4caf50'
    };
    return colors[status] || '#9e9e9e';
  };

  const getStatusText = (status: string): string => {
    const texts: Record<string, string> = {
      'Scheduled': '📅 Scheduled',
      'Pending': '⏳ Pending',
      'In Progress': '🔧 In Progress',
      'Completed': '✅ Completed'
    };
    return texts[status] || status;
  };

  // Sort tasks: overdue first, then by date
  const sortedTasks = [...tasks].sort((a, b) => {
    const aOverdue = isOverdue(a.scheduled_date);
    const bOverdue = isOverdue(b.scheduled_date);
    if (aOverdue && !bOverdue) return -1;
    if (!aOverdue && bOverdue) return 1;
    return parseDate(a.scheduled_date).getTime() - parseDate(b.scheduled_date).getTime();
  });

  const containerStyle: React.CSSProperties = {
    background: 'white',
    borderRadius: '10px',
    padding: '20px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    width: '100%',
    boxSizing: 'border-box'
  };

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '15px',
    paddingBottom: '10px',
    borderBottom: '2px solid #f0f0f0'
  };

  const tasksListStyle: React.CSSProperties = {
    maxHeight: '400px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  };

  const getTaskItemStyle = (taskId: string | undefined, overdue: boolean): React.CSSProperties => ({
    background: '#f8f9fa',
    borderRadius: '6px',
    padding: '12px',
    transition: 'all 0.2s',
    transform: hoveredTask === (taskId || '') ? 'translateX(5px)' : 'translateX(0)',
    borderLeft: overdue ? '4px solid #f44336' : '4px solid transparent',
    opacity: 1
  });

  const taskHeaderStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '5px',
    flexWrap: 'wrap',
    gap: '8px'
  };

  const taskFooterStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '8px',
    flexWrap: 'wrap',
    gap: '10px'
  };

  const noDataStyle: React.CSSProperties = {
    color: '#999',
    textAlign: 'center',
    padding: '20px'
  };

  const buttonStyle: React.CSSProperties = {
    background: '#667eea',
    color: 'white',
    border: 'none',
    padding: '4px 12px',
    borderRadius: '15px',
    cursor: 'pointer',
    fontSize: '12px',
    transition: 'all 0.2s'
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <FiCalendar color="#667eea" size={20} />
        <h3 style={{ margin: 0 }}>Upcoming Tasks</h3>
      </div>
      
      <div style={tasksListStyle}>
        {sortedTasks.length === 0 ? (
          <p style={noDataStyle}>No upcoming tasks</p>
        ) : (
          sortedTasks.map(task => {
            const overdue = isOverdue(task.scheduled_date);
            const taskId = task._id || String(task.task_id);
            
            return (
              <div 
                key={taskId} 
                style={getTaskItemStyle(taskId, overdue)}
                onMouseEnter={() => setHoveredTask(taskId)}
                onMouseLeave={() => setHoveredTask(null)}
              >
                <div style={taskHeaderStyle}>
                  <strong style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    Machine {task.machine_id}
                    {overdue && task.status !== 'Completed' && (
                      <FiAlertCircle color="#f44336" size={14} />
                    )}
                  </strong>
                  <span style={{
                    padding: '2px 6px',
                    borderRadius: '3px',
                    fontSize: '11px',
                    fontWeight: 500,
                    backgroundColor: getStatusColor(task.status),
                    color: 'white'
                  }}>
                    {getStatusText(task.status)}
                  </span>
                </div>
                
                <p style={{ margin: '5px 0', color: '#333', fontSize: '14px' }}>
                  {task.task_description}
                </p>
                
                <div style={taskFooterStyle}>
                  <div>
                    <small style={{ color: '#999', display: 'block' }}>
                      📅 Scheduled: {formatDate(task.scheduled_date)}
                    </small>
                    {task.completed_on && (
                      <small style={{ color: '#4caf50', display: 'block' }}>
                        ✅ Completed: {formatDate(task.completed_on)}
                      </small>
                    )}
                  </div>
                  
                  {task.status !== 'Completed' && (
                    <button 
                      style={buttonStyle}
                      onClick={() => onComplete(taskId)}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#5a67d8';
                        e.currentTarget.style.transform = 'scale(1.05)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#667eea';
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                    >
                      Mark Complete
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default TaskList;