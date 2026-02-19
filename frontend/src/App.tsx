// src/App.tsx
import React, { useState, useEffect } from 'react';
import { 
  FiActivity, FiAlertTriangle, FiClock, FiCheckCircle, FiPlus,
  FiCpu, FiCalendar, FiX, FiAlertCircle
} from 'react-icons/fi';

import { Machine, MaintenanceTask, NewTask } from './types';
import {
  fetchMachines,
  fetchMaintenance,
  fetchUpcoming,
  scheduleMaintenance,
  completeTask
} from './services/api';

// ============== STYLES ==============
const styles = {
  app: {
    minHeight: '100vh',
    width: '100vw',
    maxWidth: '100%',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    overflowX: 'hidden' as const,
    margin: 0,
    padding: 0
  },
  
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '20px',
    width: '100%',
    boxSizing: 'border-box' as const
  },

  header: {
    background: 'white',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    padding: '20px 0',
    marginBottom: '30px',
    width: '100%'
  },
  headerContent: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '0 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap' as const,
    gap: '15px',
    width: '100%',
    boxSizing: 'border-box' as const
  },
  headerTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    color: '#333',
    fontSize: 'clamp(20px, 4vw, 28px)',
    margin: 0
  },

  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    marginBottom: '30px',
    width: '100%'
  },

  mainGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 350px',
    gap: '30px',
    width: '100%'
  },

  machinesSection: {
    background: 'white',
    borderRadius: '10px',
    padding: '20px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    width: '100%',
    boxSizing: 'border-box' as const
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    flexWrap: 'wrap' as const,
    gap: '15px',
    width: '100%'
  },

  machinesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '20px',
    width: '100%'
  },

  sidebar: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '20px',
    width: '100%'
  },

  primaryButton: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    fontWeight: 500,
    transition: 'transform 0.2s, boxShadow 0.2s',
    whiteSpace: 'nowrap' as const
  },

  secondaryButton: {
    background: '#f0f0f0',
    color: '#333',
    border: '1px solid #ddd',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'background 0.2s'
  }
} as const;

// ============== HELPER FUNCTIONS ==============

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

// ============== COMPONENTS ==============

// Loading Component
const LoadingSpinner: React.FC = () => (
  <div style={{
    height: '100vh',
    width: '100vw',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'white'
  }}>
    <style>{`
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}</style>
    <div style={{
      border: '5px solid #f3f3f3',
      borderTop: '5px solid #667eea',
      borderRadius: '50%',
      width: '50px',
      height: '50px',
      animation: 'spin 1s linear infinite',
      marginBottom: '20px'
    }} />
    <h2 style={{ color: '#333' }}>Loading Machine Maintenance System...</h2>
  </div>
);

// Stats Card Component
interface StatsCardProps {
  icon: React.ElementType;
  value: number;
  label: string;
  color: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ icon: Icon, value, label, color }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div style={{
      background: 'white',
      padding: '20px',
      borderRadius: '10px',
      boxShadow: isHovered ? '0 8px 16px rgba(0,0,0,0.1)' : '0 4px 6px rgba(0,0,0,0.1)',
      display: 'flex',
      alignItems: 'center',
      gap: '15px',
      transition: 'all 0.3s ease',
      transform: isHovered ? 'translateY(-5px)' : 'translateY(0)',
      cursor: 'pointer',
      width: '100%',
      boxSizing: 'border-box' as const
    }}
    onMouseEnter={() => setIsHovered(true)}
    onMouseLeave={() => setIsHovered(false)}
    >
      <Icon style={{ fontSize: '40px', color }} />
      <div>
        <h3 style={{ fontSize: '28px', margin: 0, color: '#333' }}>{value}</h3>
        <p style={{ margin: '5px 0 0', color: '#666' }}>{label}</p>
      </div>
    </div>
  );
};

// Machine Card Component
interface MachineCardProps {
  machine: Machine;
  isSelected: boolean;
  onClick: (machine: Machine) => void;
  healthScore: number;
  tasks?: MaintenanceTask[];
}

const MachineCard: React.FC<MachineCardProps> = ({ 
  machine, 
  isSelected, 
  onClick, 
  healthScore,
  tasks = [] 
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const getStatusColor = (status: string): string => {
    const colors: Record<string, string> = {
      'Operational': '#4caf50',
      'Needs Maintenance': '#ff9800',
      'Under Maintenance': '#f44336'
    };
    return colors[status] || '#9e9e9e';
  };

  const getHealthColor = (score: number): string => {
    if (score > 70) return '#4caf50';
    if (score > 40) return '#ff9800';
    return '#f44336';
  };

  const getUpcomingTasksForMachine = (): MaintenanceTask[] => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return tasks.filter(task => 
      task.machine_id === machine.machine_id && 
      task.status !== 'Completed' &&
      parseDate(task.scheduled_date) >= today
    );
  };

  const upcomingTasks = getUpcomingTasksForMachine();
  const hasUpcomingTasks = upcomingTasks.length > 0;
  const nextTask = upcomingTasks[0];

  return (
    <div style={{
      background: '#f8f9fa',
      borderRadius: '8px',
      padding: '15px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      border: isSelected ? '2px solid #667eea' : '2px solid transparent',
      backgroundColor: isSelected ? '#f0f3ff' : '#f8f9fa',
      transform: isHovered ? 'translateY(-3px)' : 'translateY(0)',
      boxShadow: isHovered ? '0 4px 12px rgba(0,0,0,0.15)' : 'none',
      width: '100%',
      boxSizing: 'border-box' as const
    }}
    onClick={() => onClick(machine)}
    onMouseEnter={() => setIsHovered(true)}
    onMouseLeave={() => setIsHovered(false)}
    >
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '10px',
        flexWrap: 'wrap' as const,
        gap: '8px'
      }}>
        <h3 style={{ margin: 0, fontSize: '16px', color: '#333' }}>{machine.name}</h3>
        <span style={{
          padding: '4px 8px',
          borderRadius: '4px',
          color: 'white',
          fontSize: '12px',
          fontWeight: 500,
          backgroundColor: getStatusColor(machine.status)
        }}>
          {machine.status}
        </span>
      </div>
      
      <div style={{ marginBottom: '15px' }}>
        <p style={{ margin: '5px 0', color: '#666', fontSize: '13px' }}>
          <strong>ID:</strong> {machine.machine_id}
        </p>
        <p style={{ margin: '5px 0', color: '#666', fontSize: '13px' }}>
          <strong>Location:</strong> {machine.location}
        </p>
        <p style={{ margin: '5px 0', color: '#666', fontSize: '13px' }}>
          <strong>Last Maintenance:</strong> {formatDate(machine.last_maintenance_date)}
        </p>
        <p style={{ margin: '5px 0', color: '#666', fontSize: '13px' }}>
          <strong>Interval:</strong> {machine.maintenance_interval_days} days
        </p>
        {hasUpcomingTasks && (
          <p style={{ margin: '5px 0', color: '#2196f3', fontSize: '13px' }}>
            <strong>Next Task:</strong> {formatDate(nextTask.scheduled_date)}
          </p>
        )}
      </div>

      <div style={{
        height: '20px',
        background: '#e0e0e0',
        borderRadius: '10px',
        position: 'relative',
        overflow: 'hidden',
        marginBottom: '5px'
      }}>
        <div style={{
          height: '100%',
          width: `${healthScore}%`,
          backgroundColor: getHealthColor(healthScore),
          transition: 'width 0.3s ease'
        }} />
        <span style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: 'white',
          fontSize: '11px',
          fontWeight: 'bold',
          textShadow: '0 1px 2px rgba(0,0,0,0.3)'
        }}>
          {healthScore}% Healthy
        </span>
      </div>
    </div>
  );
};

// Task List Component
interface TaskListProps {
  tasks: MaintenanceTask[];
  onComplete: (taskId: string) => void;
}

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

  return (
    <div style={{
      background: 'white',
      borderRadius: '10px',
      padding: '20px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      width: '100%',
      boxSizing: 'border-box' as const
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginBottom: '15px',
        paddingBottom: '10px',
        borderBottom: '2px solid #f0f0f0'
      }}>
        <FiCalendar color="#667eea" size={20} />
        <h3 style={{ margin: 0 }}>Upcoming Tasks</h3>
      </div>
      
      <div style={{
        maxHeight: '400px',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column' as const,
        gap: '10px'
      }}>
        {sortedTasks.length === 0 ? (
          <p style={{ color: '#999', textAlign: 'center', padding: '20px' }}>
            No upcoming tasks
          </p>
        ) : (
          sortedTasks.map(task => {
            const overdue = isOverdue(task.scheduled_date);
            
            return (
              <div 
                key={task._id || task.task_id} 
                style={{
                  background: '#f8f9fa',
                  borderRadius: '6px',
                  padding: '12px',
                  transition: 'all 0.2s',
                  transform: hoveredTask === (task._id || String(task.task_id)) ? 'translateX(5px)' : 'translateX(0)',
                  borderLeft: overdue ? '4px solid #f44336' : '4px solid transparent',
                  opacity: task.status === 'Completed' ? 0.7 : 1
                }}
                onMouseEnter={() => setHoveredTask(task._id || String(task.task_id))}
                onMouseLeave={() => setHoveredTask(null)}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '5px',
                  flexWrap: 'wrap' as const,
                  gap: '8px'
                }}>
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
                
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: '8px',
                  flexWrap: 'wrap' as const,
                  gap: '10px'
                }}>
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
                      style={{
                        background: '#667eea',
                        color: 'white',
                        border: 'none',
                        padding: '4px 12px',
                        borderRadius: '15px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        transition: 'all 0.2s'
                      }}
                      onClick={() => onComplete(task._id || String(task.task_id))}
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

// Schedule Modal Component
interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (task: NewTask) => void;
  machines: Machine[];
}

const ScheduleModal: React.FC<ScheduleModalProps> = ({ isOpen, onClose, onSubmit, machines }) => {
  const [newTask, setNewTask] = useState<NewTask>({
    machine_id: 0,
    task_description: '',
    scheduled_date: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await onSubmit(newTask);
    setIsSubmitting(false);
    setNewTask({ machine_id: 0, task_description: '', scheduled_date: '' });
    onClose();
  };

  // Get today's date in DD-MM-YYYY format for min attribute
  const today = new Date();
  const todayStr = `${today.getDate().toString().padStart(2, '0')}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getFullYear()}`;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
      padding: '20px',
      boxSizing: 'border-box' as const
    }}>
      <div style={{
        background: 'white',
        borderRadius: '10px',
        padding: '30px',
        width: '100%',
        maxWidth: '500px',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxSizing: 'border-box' as const
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <h2 style={{ margin: 0 }}>Schedule New Maintenance</h2>
          <button 
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#666',
              padding: '5px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onClick={onClose}
          >
            <FiX />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '5px',
              color: '#333',
              fontWeight: 500
            }}>
              Machine
            </label>
            <select
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '5px',
                fontSize: '14px',
                boxSizing: 'border-box' as const
              }}
              value={newTask.machine_id}
              onChange={(e) => setNewTask({ ...newTask, machine_id: Number(e.target.value) })}
              required
              disabled={isSubmitting}
            >
              <option value="">Select Machine</option>
              {machines.map(m => (
                <option key={m._id} value={m.machine_id}>
                  {m.name} (ID: {m.machine_id})
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '5px',
              color: '#333',
              fontWeight: 500
            }}>
              Task Description
            </label>
            <textarea
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '5px',
                fontSize: '14px',
                resize: 'vertical',
                minHeight: '80px',
                boxSizing: 'border-box' as const
              }}
              value={newTask.task_description}
              onChange={(e) => setNewTask({ ...newTask, task_description: e.target.value })}
              required
              placeholder="Describe the maintenance task..."
              disabled={isSubmitting}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '5px',
              color: '#333',
              fontWeight: 500
            }}>
              Scheduled Date (DD-MM-YYYY)
            </label>
            <input
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '5px',
                fontSize: '14px',
                boxSizing: 'border-box' as const
              }}
              type="text"
              value={newTask.scheduled_date}
              onChange={(e) => setNewTask({ ...newTask, scheduled_date: e.target.value })}
              required
              placeholder="DD-MM-YYYY"
              pattern="\d{2}-\d{2}-\d{4}"
              disabled={isSubmitting}
            />
            <small style={{ color: '#999', display: 'block', marginTop: '5px' }}>
              Format: DD-MM-YYYY (e.g., 15-03-2026)
            </small>
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '10px',
            marginTop: '20px',
            flexWrap: 'wrap' as const
          }}>
            <button 
              type="button" 
              style={{
                background: '#f0f0f0',
                color: '#333',
                border: '1px solid #ddd',
                padding: '10px 20px',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '14px',
                transition: 'background 0.2s'
              }}
              onClick={onClose}
              disabled={isSubmitting}
              onMouseEnter={(e) => e.currentTarget.style.background = '#e0e0e0'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#f0f0f0'}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '5px',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: 500,
                opacity: isSubmitting ? 0.7 : 1,
                transition: 'transform 0.2s'
              }}
              disabled={isSubmitting}
              onMouseEnter={(e) => !isSubmitting && (e.currentTarget.style.transform = 'translateY(-2px)')}
              onMouseLeave={(e) => !isSubmitting && (e.currentTarget.style.transform = 'translateY(0)')}
            >
              {isSubmitting ? 'Scheduling...' : 'Schedule Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ============== MAIN APP COMPONENT ==============
const App: React.FC = () => {
  const [machines, setMachines] = useState<Machine[]>([]);
  const [tasks, setTasks] = useState<MaintenanceTask[]>([]);
  const [upcomingTasks, setUpcomingTasks] = useState<MaintenanceTask[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedMachine, setSelectedMachine] = useState<Machine | null>(null);
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch data on mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async (): Promise<void> => {
    try {
      const [machinesRes, tasksRes, upcomingRes] = await Promise.all([
        fetchMachines(),
        fetchMaintenance(),
        fetchUpcoming()
      ]);

      setMachines(machinesRes.data);
      setTasks(tasksRes.data);
      setUpcomingTasks(upcomingRes.data.filter(task => task.status !== 'Completed'));
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSchedule = async (taskData: NewTask): Promise<void> => {
    try {
      await scheduleMaintenance(taskData);
      setShowModal(false);
      fetchData();
    } catch (error) {
      console.error('Error scheduling task:', error);
    }
  };

  const handleComplete = async (taskId: string): Promise<void> => {
    try {
      await completeTask(taskId);
      fetchData();
    } catch (error) {
      console.error('Error completing task:', error);
    }
  };

  const getHealthScore = (machine: Machine): number => {
    if (!machine.last_maintenance_date) return 50;
    
    try {
      const lastMaintenance = parseDate(machine.last_maintenance_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const daysSince = Math.floor((today.getTime() - lastMaintenance.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysSince <= 0) return 100;
      
      const interval = machine.maintenance_interval_days;
      const score = Math.max(0, 100 - ((daysSince / interval) * 100));
      
      return Math.min(100, Math.round(score));
    } catch (error) {
      console.error('Error calculating health score:', error);
      return 50;
    }
  };

  const [scheduleButtonHovered, setScheduleButtonHovered] = useState(false);

  // Calculate stats
  const totalMachines = machines.length;
  const machinesNeedingMaintenance = machines.filter(m => 
    m.status === 'Needs Maintenance' || 
    (m.last_maintenance_date && 
     (() => {
       const lastMaintenance = parseDate(m.last_maintenance_date);
       const today = new Date();
       const daysSince = Math.floor((today.getTime() - lastMaintenance.getTime()) / (1000 * 60 * 60 * 24));
       return daysSince > m.maintenance_interval_days;
     })())
  ).length;
  
  const upcomingTasksCount = upcomingTasks.length;
  const completedTasksCount = tasks.filter(task => task.status === 'Completed').length;

  if (loading) return <LoadingSpinner />;

  return (
    <div style={styles.app}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <h1 style={styles.headerTitle}>
            <FiCpu style={{ color: '#667eea' }} />
            Machine Maintenance Scheduler
          </h1>
          <p style={{ color: '#666', margin: 0 }}>
            {windowWidth > 768 ? 'Real-time monitoring and maintenance management' : 'v2.0'}
          </p>
        </div>
      </header>

      {/* Main Container */}
      <div style={styles.container}>
        {/* Stats Grid */}
        <div style={styles.statsGrid}>
          <StatsCard icon={FiActivity} value={totalMachines} label="Total Machines" color="#667eea" />
          <StatsCard 
            icon={FiAlertTriangle} 
            value={machinesNeedingMaintenance} 
            label="Need Maintenance" 
            color="#ff9800" 
          />
          <StatsCard icon={FiClock} value={upcomingTasksCount} label="Upcoming Tasks" color="#2196f3" />
          <StatsCard 
            icon={FiCheckCircle} 
            value={completedTasksCount} 
            label="Completed Tasks" 
            color="#4caf50" 
          />
        </div>

        {/* Main Content Grid */}
        <div style={{
          ...styles.mainGrid,
          gridTemplateColumns: windowWidth <= 968 ? '1fr' : '1fr 350px'
        }}>
          {/* Machines Section */}
          <div style={styles.machinesSection}>
            <div style={styles.sectionHeader}>
              <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FiCpu /> Machines Status
              </h2>
              <button 
                style={{
                  ...styles.primaryButton,
                  transform: scheduleButtonHovered ? 'translateY(-2px)' : 'translateY(0)',
                  boxShadow: scheduleButtonHovered ? '0 4px 12px rgba(102, 126, 234, 0.4)' : 'none'
                }}
                onClick={() => setShowModal(true)}
                onMouseEnter={() => setScheduleButtonHovered(true)}
                onMouseLeave={() => setScheduleButtonHovered(false)}
              >
                <FiPlus /> Schedule Maintenance
              </button>
            </div>
            
            <div style={{
              ...styles.machinesGrid,
              gridTemplateColumns: windowWidth <= 480 ? '1fr' : 'repeat(auto-fill, minmax(280px, 1fr))'
            }}>
              {machines.map(machine => (
                <MachineCard
                  key={machine._id || machine.machine_id}
                  machine={machine}
                  isSelected={selectedMachine?._id === machine._id}
                  onClick={setSelectedMachine}
                  healthScore={getHealthScore(machine)}
                  tasks={tasks}
                />
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div style={styles.sidebar}>
            {selectedMachine && (
              <div style={{
                background: 'white',
                borderRadius: '10px',
                padding: '20px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                width: '100%',
                boxSizing: 'border-box' as const
              }}>
                <h3 style={{ margin: '0 0 15px 0' }}>Selected Machine Details</h3>
                <div style={{ 
                  background: '#f8f9fa', 
                  borderRadius: '8px', 
                  padding: '15px',
                  width: '100%',
                  boxSizing: 'border-box' as const
                }}>
                  <h4 style={{ margin: '0 0 10px 0', color: '#333' }}>{selectedMachine.name}</h4>
                  <p style={{ margin: '5px 0', color: '#666' }}>
                    <strong>ID:</strong> {selectedMachine.machine_id}
                  </p>
                  <p style={{ margin: '5px 0', color: '#666' }}>
                    <strong>Status:</strong> {selectedMachine.status}
                  </p>
                  <p style={{ margin: '5px 0', color: '#666' }}>
                    <strong>Location:</strong> {selectedMachine.location}
                  </p>
                  <p style={{ margin: '5px 0', color: '#666' }}>
                    <strong>Last Maintenance:</strong> {formatDate(selectedMachine.last_maintenance_date)}
                  </p>
                  <p style={{ margin: '5px 0', color: '#666' }}>
                    <strong>Health Score:</strong> {getHealthScore(selectedMachine)}%
                  </p>
                  <p style={{ margin: '5px 0', color: '#666' }}>
                    <strong>Maintenance Interval:</strong> {selectedMachine.maintenance_interval_days} days
                  </p>
                </div>
              </div>
            )}

            <TaskList tasks={upcomingTasks} onComplete={handleComplete} />
          </div>
        </div>
      </div>

      {/* Schedule Modal */}
      <ScheduleModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleSchedule}
        machines={machines}
      />
    </div>
  );
};

export default App;