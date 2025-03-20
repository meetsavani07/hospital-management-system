import { useState } from 'react';
import { showToast } from '../utils/toast';
import type { Appointment } from '../types/appointment';
import { mockAppointments } from '../data/mockAppointments';

export const useAppointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addAppointment = async (appointmentData: Omit<Appointment, 'id'>) => {
    setIsLoading(true);
    try {
      const newAppointment: Appointment = {
        ...appointmentData,
        id: `a${Date.now()}`,
      };
      setAppointments(prev => [...prev, newAppointment]);
      showToast.success('Appointment booked successfully');
      return newAppointment;
    } catch (err: any) {
      setError('Error booking appointment');
      showToast.error('Failed to book appointment');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateAppointment = async (id: string, appointmentData: Partial<Appointment>) => {
    setIsLoading(true);
    try {
      const updatedAppointments = appointments.map(a => 
        a.id === id ? { ...a, ...appointmentData } : a
      );
      setAppointments(updatedAppointments);
      showToast.success('Appointment updated successfully');
      return updatedAppointments.find(a => a.id === id)!;
    } catch (err: any) {
      setError('Error updating appointment');
      showToast.error('Failed to update appointment');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteAppointment = async (id: string) => {
    setIsLoading(true);
    try {
      setAppointments(prev => prev.filter(a => a.id !== id));
      showToast.success('Appointment deleted successfully');
    } catch (err: any) {
      setError('Error deleting appointment');
      showToast.error('Failed to delete appointment');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    appointments,
    isLoading,
    error,
    addAppointment,
    updateAppointment,
    deleteAppointment
  };
};