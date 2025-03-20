import { useState } from 'react';
import { showToast } from '../utils/toast';
import type { Patient } from '../types/patient';
import { mockPatients } from '../data/mockPatients';

export const usePatients = () => {
  const [patients, setPatients] = useState<Patient[]>(mockPatients);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addPatient = async (patientData: Omit<Patient, 'id'>) => {
    setIsLoading(true);
    try {
      const newPatient: Patient = {
        ...patientData,
        id: `p${Date.now()}`,
      };
      setPatients(prev => [...prev, newPatient]);
      showToast.success('Patient added successfully');
      return newPatient;
    } catch (err: any) {
      setError('Error adding patient');
      showToast.error('Failed to add patient');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updatePatient = async (id: string, patientData: Partial<Patient>) => {
    setIsLoading(true);
    try {
      const updatedPatients = patients.map(p => 
        p.id === id ? { ...p, ...patientData } : p
      );
      setPatients(updatedPatients);
      showToast.success('Patient updated successfully');
      return updatedPatients.find(p => p.id === id)!;
    } catch (err: any) {
      setError('Error updating patient');
      showToast.error('Failed to update patient');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deletePatient = async (id: string) => {
    setIsLoading(true);
    try {
      setPatients(prev => prev.filter(p => p.id !== id));
      showToast.success('Patient deleted successfully');
    } catch (err: any) {
      setError('Error deleting patient');
      showToast.error('Failed to delete patient');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    patients,
    isLoading,
    error,
    addPatient,
    updatePatient,
    deletePatient
  };
};