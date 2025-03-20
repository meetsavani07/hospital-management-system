import React, { useState } from 'react';
import type { Appointment } from '../../../types/appointment';
import { useAvailableSlots } from '../../../hooks/useAvailableSlots';
import { isTimeSlotAvailable } from '../../../utils/appointmentValidation';
import { commonDiseases, commonSymptoms } from '../../../types/diseases';

interface AppointmentFormProps {
  doctors: Array<{ id: string; name: string; specialization: string }>;
  onSubmit: (appointment: Omit<Appointment, 'id' | 'status'>) => void;
  onCancel: () => void;
  initialData?: Appointment;
  mode?: 'create' | 'edit' | 'reschedule';
  existingAppointments: Appointment[];
}

const AppointmentForm: React.FC<AppointmentFormProps> = ({
  doctors,
  onSubmit,
  onCancel,
  initialData,
  mode = 'create',
  existingAppointments,
}) => {
  const [formData, setFormData] = useState({
    patientName: initialData?.patientName || '',
    age: initialData?.age?.toString() || '',
    gender: initialData?.gender || 'male',
    contact: initialData?.contact || '',
    address: initialData?.address || '',
    doctorId: initialData?.doctorId || '',
    date: initialData?.date || '',
    time: initialData?.time || '',
    duration: 30,
    disease: initialData?.disease || '',
    severity: initialData?.severity || '',
    symptoms: initialData?.symptoms || [],
    symptomsDescription: initialData?.symptomsDescription || '',
  });

  const [error, setError] = useState<string | null>(null);

  const { availableSlots, isLoading: isLoadingSlots } = useAvailableSlots(
    formData.doctorId,
    formData.date,
    mode === 'edit' ? initialData?.time : undefined
  );

  const handleChange = (field: string, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleSymptomChange = (symptom: string) => {
    const updatedSymptoms = formData.symptoms.includes(symptom)
      ? formData.symptoms.filter((s) => s !== symptom)
      : [...formData.symptoms, symptom];
    handleChange('symptoms', updatedSymptoms);
  };

  const validateTimeSlot = () => {
    if (!formData.doctorId || !formData.date || !formData.time) {
      return false;
    }

    const isAvailable = isTimeSlotAvailable(
      formData.doctorId,
      formData.date,
      formData.time,
      existingAppointments,
      initialData?.id
    );

    if (!isAvailable) {
      setError('This time slot is already booked. Please select another time.');
      return false;
    }

    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateTimeSlot()) {
      return;
    }

    const selectedDoctor = doctors.find((d) => d.id === formData.doctorId);
    if (!selectedDoctor) return;

    onSubmit({
      ...formData,
      age: parseInt(formData.age),
      doctorName: selectedDoctor.name,
      patientId: ''
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Patient Name
          </label>
          <input
            type="text"
            required
            value={formData.patientName}
            onChange={(e) => handleChange('patientName', e.target.value)}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Age
          </label>
          <input
            type="number"
            required
            min="0"
            max="150"
            value={formData.age}
            onChange={(e) => handleChange('age', e.target.value)}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Gender
          </label>
          <select
            value={formData.gender}
            onChange={(e) => handleChange('gender', e.target.value)}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Contact
          </label>
          <input
            type="tel"
            required
            value={formData.contact}
            onChange={(e) => handleChange('contact', e.target.value)}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Address
        </label>
        <textarea
          required
          value={formData.address}
          onChange={(e) => handleChange('address', e.target.value)}
          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          rows={2}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Doctor
          </label>
          <select
            required
            value={formData.doctorId}
            onChange={(e) => handleChange('doctorId', e.target.value)}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            disabled={mode === 'edit'}
          >
            <option value="">Select a doctor</option>
            {doctors.map((doctor) => (
              <option key={doctor.id} value={doctor.id}>
                {doctor.name} - {doctor.specialization}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date
          </label>
          <input
            type="date"
            required
            min={new Date().toISOString().split('T')[0]}
            value={formData.date}
            onChange={(e) => handleChange('date', e.target.value)}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Time
          </label>
          <select
            required
            value={formData.time}
            onChange={(e) => handleChange('time', e.target.value)}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            disabled={!formData.doctorId || !formData.date || isLoadingSlots}
          >
            <option value="">Select time</option>
            {availableSlots.map((slot) => (
              <option
                key={slot.start}
                value={slot.start}
                disabled={!slot.isAvailable}
              >
                {slot.start}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Disease/Condition
          </label>
          <select
            required
            value={formData.disease}
            onChange={(e) => handleChange('disease', e.target.value)}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select condition</option>
            {commonDiseases.map((disease) => (
              <option key={disease} value={disease}>
                {disease}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Severity
          </label>
          <select
            required
            value={formData.severity}
            onChange={(e) => handleChange('severity', e.target.value)}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select severity</option>
            <option value="Mild">Mild</option>
            <option value="Moderate">Moderate</option>
            <option value="Severe">Severe</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Symptoms
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
          {commonSymptoms.map((symptom) => (
            <label key={symptom} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.symptoms.includes(symptom)}
                onChange={() => handleSymptomChange(symptom)}
                className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{symptom}</span>
            </label>
          ))}
        </div>
        <textarea
          value={formData.symptomsDescription}
          onChange={(e) => handleChange('symptomsDescription', e.target.value)}
          placeholder="Additional symptoms description..."
          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          rows={3}
        />
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-white bg-green-500 rounded-lg hover:bg-green-600"
        >
          {mode === 'create'
            ? 'Create Appointment'
            : mode === 'edit'
            ? 'Update Appointment'
            : 'Reschedule Appointment'}
        </button>
      </div>
    </form>
  );
};

export default AppointmentForm;