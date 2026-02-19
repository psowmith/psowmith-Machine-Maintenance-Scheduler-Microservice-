// src/types/index.ts
export interface Machine {
  _id?: string;  // MongoDB ID (optional)
  machine_id: number;  // From CSV: 1,2,3,4,5
  name: string;
  location: string;
  last_maintenance_date: string;  // Format: "DD-MM-YYYY"
  maintenance_interval_days: number;
  status: 'Operational' | 'Needs Maintenance' | 'Under Maintenance';
}

export interface MaintenanceTask {
  _id?: string;  // MongoDB ID (optional)
  task_id: number;  // From CSV: 1,2,3,4,5,6,7,8,9,10,11
  machine_id: number;  // References machine_id from Machines.csv
  task_description: string;
  scheduled_date: string;  // Format: "DD-MM-YYYY"
  status: 'Scheduled' | 'Pending' | 'In Progress' | 'Completed';
  completed_on?: string;  // Format: "DD-MM-YYYY" (optional)
}

export interface NewTask {
  machine_id: number;
  task_description: string;
  scheduled_date: string;
}

export interface MachineStatus {
  machine_id: number;
  name: string;
  status: string;
  health_score: number;
  last_maintenance: string;
  next_maintenance_due: string;
  days_until_maintenance: number;
}