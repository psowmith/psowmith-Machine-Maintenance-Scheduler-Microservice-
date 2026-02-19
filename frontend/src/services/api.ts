// src/services/api.ts
import axios, { AxiosResponse } from 'axios';
import { Machine, MaintenanceTask, NewTask, MachineStatus } from '../types';

const API = {
  machine: 'http://localhost:4001',
  maintenance: 'http://localhost:4002'
};

export const fetchMachines = (): Promise<AxiosResponse<Machine[]>> => 
  axios.get(`${API.machine}/machines`);

export const fetchMaintenance = (): Promise<AxiosResponse<MaintenanceTask[]>> => 
  axios.get(`${API.maintenance}/maintenance`);

export const fetchUpcoming = (): Promise<AxiosResponse<MaintenanceTask[]>> => 
  axios.get(`${API.maintenance}/maintenance/upcoming`);

export const scheduleMaintenance = (task: NewTask): Promise<AxiosResponse<MaintenanceTask>> => {
  return axios.post(`${API.maintenance}/maintenance`, {
    ...task,
    task_id: Math.floor(Math.random() * 1000) + 100, // Generate random task_id
    status: 'Scheduled'
  });
};

export const completeTask = (taskId: string): Promise<AxiosResponse<MaintenanceTask>> => 
  axios.patch(`${API.maintenance}/maintenance/${taskId}/complete`);

export const getMachineStatus = (machineId: number): Promise<AxiosResponse<MachineStatus>> => 
  axios.get(`${API.machine}/machines/${machineId}/status`);