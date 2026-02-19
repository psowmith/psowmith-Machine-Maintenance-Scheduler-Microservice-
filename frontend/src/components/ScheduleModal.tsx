// src/components/ScheduleModal.tsx
import React, { useState } from 'react';
import { FiX } from 'react-icons/fi';
import { Machine, NewTask } from '../types';

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (task: NewTask) => void;
  machines: Machine[];
}

const ScheduleModal: React.FC<ScheduleModalProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  machines 
}) => {
  const [newTask, setNewTask] = useState<NewTask>({
    machine_id: 0,  // Initialize as number, not empty string
    task_description: '',
    scheduled_date: ''
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newTask.machine_id === 0) {
      alert('Please select a machine');
      return;
    }
    await onSubmit(newTask);
    setNewTask({ machine_id: 0, task_description: '', scheduled_date: '' });
    onClose();
  };

  const modalOverlayStyle: React.CSSProperties = {
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
    padding: '20px'
  };

  const modalStyle: React.CSSProperties = {
    background: 'white',
    borderRadius: '10px',
    padding: '30px',
    width: '90%',
    maxWidth: '500px',
    maxHeight: '90vh',
    overflowY: 'auto'
  };

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px'
  };

  const closeButtonStyle: React.CSSProperties = {
    background: 'none',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    color: '#666'
  };

  const formGroupStyle: React.CSSProperties = {
    marginBottom: '20px'
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    marginBottom: '5px',
    color: '#333',
    fontWeight: 500
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontSize: '14px',
    boxSizing: 'border-box'
  };

  const textareaStyle: React.CSSProperties = {
    ...inputStyle,
    resize: 'vertical',
    minHeight: '80px'
  };

  const actionsStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
    marginTop: '20px'
  };

  const primaryButtonStyle: React.CSSProperties = {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 500
  };

  const secondaryButtonStyle: React.CSSProperties = {
    background: '#f0f0f0',
    color: '#333',
    border: '1px solid #ddd',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px'
  };

  return (
    <div style={modalOverlayStyle}>
      <div style={modalStyle}>
        <div style={headerStyle}>
          <h2 style={{ margin: 0 }}>Schedule New Maintenance</h2>
          <button style={closeButtonStyle} onClick={onClose}>
            <FiX />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div style={formGroupStyle}>
            <label style={labelStyle}>Machine</label>
            <select
              style={inputStyle}
              value={newTask.machine_id}
              onChange={(e) => setNewTask({ 
                ...newTask, 
                machine_id: e.target.value ? Number(e.target.value) : 0 
              })}
              required
            >
              <option value="0">Select Machine</option>
              {machines.map(m => (
                <option key={m._id || m.machine_id} value={m.machine_id}>
                  {m.name} (ID: {m.machine_id})
                </option>
              ))}
            </select>
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>Task Description</label>
            <textarea
              style={textareaStyle}
              value={newTask.task_description}
              onChange={(e) => setNewTask({ ...newTask, task_description: e.target.value })}
              required
              placeholder="Describe the maintenance task..."
            />
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>Scheduled Date (DD-MM-YYYY)</label>
            <input
              style={inputStyle}
              type="text"
              value={newTask.scheduled_date}
              onChange={(e) => setNewTask({ ...newTask, scheduled_date: e.target.value })}
              required
              placeholder="DD-MM-YYYY"
              pattern="\d{2}-\d{2}-\d{4}"
            />
            <small style={{ color: '#999', display: 'block', marginTop: '5px' }}>
              Format: DD-MM-YYYY (e.g., 15-03-2026)
            </small>
          </div>

          <div style={actionsStyle}>
            <button type="button" style={secondaryButtonStyle} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" style={primaryButtonStyle}>
              Schedule Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ScheduleModal;