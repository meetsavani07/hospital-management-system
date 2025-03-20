import React, { useState } from 'react';
import { Calendar, Clock, RefreshCw, Download, Printer, Plus, X, Eye, User } from 'lucide-react';
import { mockDoctors, hospitals } from '../../data/mockDoctors';
import { useAvailableSlots } from '../../hooks/useAvailableSlots';
import { showToast } from '../../utils/toast';
import { mockAppointments } from '../../data/mockAppointments';
import type { Appointment } from '../../types/appointment';
import { motion, AnimatePresence } from 'framer-motion';
import { generatePDF } from '../../utils/pdfGenerator';
import { commonDiseases, commonSymptoms } from '../../types/diseases';

const BookAppointment: React.FC = () => {
  const [formData, setFormData] = useState({
    hospital: '',
    doctorId: '',
    date: '',
    time: '',
    reason: '',
    disease: '',
    severity: '',
    symptoms: [] as string[],
    age: '',
    gender: 'male' as 'male' | 'female' | 'other',
    bloodGroup: '',
    allergies: '',
    currentMedications: ''
  });

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [viewingAppointment, setViewingAppointment] = useState<Appointment | null>(null);

  // Filter doctors based on selected hospital
  const filteredDoctors = mockDoctors.filter(
    doctor => !formData.hospital || doctor.hospital === formData.hospital
  );

  const { availableSlots, isLoading } = useAvailableSlots(
    formData.doctorId,
    formData.date
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isRescheduling && selectedAppointment) {
      showToast.success('Appointment rescheduled successfully');
      setIsRescheduling(false);
      setSelectedAppointment(null);
    } else {
      showToast.success('Appointment booked successfully');
    }
    setFormData({
      hospital: '',
      doctorId: '',
      date: '',
      time: '',
      reason: '',
      disease: '',
      severity: '',
      symptoms: [],
      age: '',
      gender: 'male',
      bloodGroup: '',
      allergies: '',
      currentMedications: ''
    });
    setIsFormOpen(false);
  };

  // Handle symptom selection
  const handleSymptomChange = (symptom: string) => {
    const updatedSymptoms = formData.symptoms.includes(symptom)
      ? formData.symptoms.filter(s => s !== symptom)
      : [...formData.symptoms, symptom];
    
    setFormData({ ...formData, symptoms: updatedSymptoms });
  };

  // Get user's appointments (mock data for now)
  const userAppointments = mockAppointments.filter(apt => apt.patientId === 'p1');

  // Function to get status color for the badge
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Handle reschedule click
  const handleReschedule = (appointment: Appointment) => {
    const doctor = mockDoctors.find(d => d.id === appointment.doctorId);
    if (doctor) {
      setFormData({
        hospital: doctor.hospital,
        doctorId: appointment.doctorId,
        date: '',
        time: '',
        reason: appointment.symptomsDescription,
        disease: appointment.disease || '',
        severity: appointment.severity || '',
        symptoms: appointment.symptoms || [],
        age: appointment.age ? appointment.age.toString() : '',
        gender: appointment.gender || 'male',
        bloodGroup: '',
        allergies: '',
        currentMedications: ''
      });
      setSelectedAppointment(appointment);
      setIsRescheduling(true);
      setIsFormOpen(true);
    }
  };

  const handleViewDetails = (appointment: Appointment) => {
    setViewingAppointment(appointment);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    if (viewingAppointment) {
      generatePDF('appointment', viewingAppointment);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-br from-emerald-800 to-emerald-500 bg-clip-text text-transparent">
            My Appointments
          </h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setIsFormOpen(true);
              setIsRescheduling(false);
              setSelectedAppointment(null);
              setFormData({
                hospital: '',
                doctorId: '',
                date: '',
                time: '',
                reason: '',
                disease: '',
                severity: '',
                symptoms: [],
                age: '',
                gender: 'male',
                bloodGroup: '',
                allergies: '',
                currentMedications: ''
              });
            }}
            className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-emerald-300 text-white rounded-lg flex items-center gap-2 shadow-md"
          >
            <Plus className="h-5 w-5" />
            Book New Appointment
          </motion.button>
        </div>

        {/* Appointment History */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-6">Appointment History</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Doctor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Reason
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {userAppointments.map((appointment) => (
                  <tr key={appointment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {appointment.doctorName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{appointment.date}</div>
                      <div className="text-sm text-gray-500">{appointment.time}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(appointment.status)}`}>
                        {appointment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 max-w-xs truncate">
                        {appointment.symptomsDescription}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleViewDetails(appointment)}
                          className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                        >
                          <Eye className="h-4 w-4" />
                          <span>View</span>
                        </button>
                        {appointment.status === 'scheduled' && (
                          <button
                            onClick={() => handleReschedule(appointment)}
                            className="text-green-600 hover:text-green-800 flex items-center gap-1"
                          >
                            <RefreshCw className="h-4 w-4" />
                            <span>Reschedule</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {userAppointments.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                      No appointment history found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Appointment Booking Tips */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Appointment Booking Tips</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="font-medium text-lg text-emerald-700">Before Your Appointment</h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                <li>Prepare a list of your symptoms and when they started</li>
                <li>Bring a list of all medications you're currently taking</li>
                <li>Arrive 15 minutes early to complete any paperwork</li>
                <li>Bring your insurance card and ID</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="font-medium text-lg text-emerald-700">During Your Appointment</h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                <li>Be honest and thorough about your symptoms</li>
                <li>Ask questions about your diagnosis and treatment</li>
                <li>Take notes or bring someone with you to help remember details</li>
                <li>Discuss any concerns about medications or procedures</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Appointment Form Modal */}
      <AnimatePresence>
        {isFormOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="bg-white rounded-lg w-full max-w-4xl p-6 relative max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setIsFormOpen(false)}
                className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
              
              <h2 className="text-2xl font-bold mb-6">
                {isRescheduling ? 'Reschedule Appointment' : 'Book New Appointment'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information Section */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium mb-4 text-emerald-700">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Age
                      </label>
                      <input
                        type="number"
                        required
                        min="1"
                        max="120"
                        value={formData.age}
                        onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Gender
                      </label>
                      <select
                        required
                        value={formData.gender}
                        onChange={(e) => setFormData({ ...formData, gender: e.target.value as 'male' | 'female' | 'other' })}
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Blood Group
                      </label>
                      <select
                        value={formData.bloodGroup}
                        onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select Blood Group</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Appointment Details Section */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium mb-4 text-emerald-700">Appointment Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Select Hospital
                      </label>
                      <select
                        required
                        value={formData.hospital}
                        onChange={(e) => {
                          setFormData({ 
                            ...formData, 
                            hospital: e.target.value,
                            doctorId: '' // Reset doctor selection when hospital changes
                          });
                        }}
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        disabled={isRescheduling}
                      >
                        <option value="">Choose Hospital</option>
                        {hospitals.map((hospital) => (
                          <option key={hospital} value={hospital}>
                            {hospital}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Select Doctor
                      </label>
                      <select
                        required
                        value={formData.doctorId}
                        onChange={(e) => setFormData({ ...formData, doctorId: e.target.value })}
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        disabled={!formData.hospital || isRescheduling}
                      >
                        <option value="">Choose a Doctor</option>
                        {filteredDoctors.map((doctor) => (
                          <option key={doctor.id} value={doctor.id}>
                            {doctor.name} - {doctor.specialization}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Select Date
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                          type="date"
                          required
                          min={new Date().toISOString().split('T')[0]}
                          value={formData.date}
                          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                          className="w-full pl-10 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Select Time
                      </label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <select
                          required
                          value={formData.time}
                          onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                          className="w-full pl-10 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                          disabled={!formData.doctorId || !formData.date || isLoading}
                        >
                          <option value="">Select Time</option>
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
                    </div>
                  </div>
                </div>

                {/* Medical Information Section */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium mb-4 text-emerald-700">Medical Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Disease/Condition
                      </label>
                      <select
                        required
                        value={formData.disease}
                        onChange={(e) => setFormData({ ...formData, disease: e.target.value })}
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
                        onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select severity</option>
                        <option value="Mild">Mild</option>
                        <option value="Moderate">Moderate</option>
                        <option value="Severe">Severe</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Symptoms (Select all that apply)
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
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
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Detailed Description
                    </label>
                    <textarea
                      required
                      value={formData.reason}
                      onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      rows={4}
                      placeholder="Please describe your symptoms in detail, including when they started and any other relevant information"
                    />
                  </div>
                </div>

                {/* Additional Medical Information */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium mb-4 text-emerald-700">Additional Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Allergies (if any)
                      </label>
                      <textarea
                        value={formData.allergies}
                        onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        rows={2}
                        placeholder="List any allergies you have (medications, food, etc.)"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Current Medications
                      </label>
                      <textarea
                        value={formData.currentMedications}
                        onChange={(e) => setFormData({ ...formData, currentMedications: e.target.value })}
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        rows={2}
                        placeholder="List any medications you are currently taking"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  {isRescheduling && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsRescheduling(false);
                        setSelectedAppointment(null);
                        setIsFormOpen(false);
                      }}
                      className="flex-1 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      Cancel Reschedule
                    </button>
                  )}
                  <button
                    type="submit"
                    className="flex-1 text-white px-4 py-2 bg-gradient-to-r from-emerald-600 to-emerald-300 rounded-lg font-semibold text-lg transition-all duration-300 shadow-lg"
                  >
                    {isRescheduling ? 'Reschedule Appointment' : 'Book Appointment'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Appointment Details Modal */}
      <AnimatePresence>
        {viewingAppointment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="bg-white rounded-lg w-full max-w-3xl p-6 relative max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold">Appointment Details</h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrint}
                    className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                    title="Print details"
                  >
                    <Printer className="h-5 w-5" />
                  </button>
                  <button
                    onClick={handleDownload}
                    className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                    title="Download PDF"
                  >
                    <Download className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setViewingAppointment(null)}
                    className="p-2 text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div id="printable-content" className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Doctor Information */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-blue-500" />
                    Appointment Information
                  </h3>
                  <div className="space-y-2">
                    <p><span className="font-medium">Appointment ID:</span> {viewingAppointment.id}</p>
                    <p><span className="font-medium">Date:</span> {viewingAppointment.date}</p>
                    <p><span className="font-medium">Time:</span> {viewingAppointment.time}</p>
                    <p><span className="font-medium">Duration:</span> {viewingAppointment.duration} minutes</p>
                    <p>
                      <span className="font-medium">Status:</span> 
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(viewingAppointment.status)}`}>
                        {viewingAppointment.status}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Doctor Information */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <User className="h-5 w-5 text-blue-500" />
                    Doctor Information
                  </h3>
                  <div className="space-y-2">
                    <p><span className="font-medium">Doctor:</span> {viewingAppointment.doctorName}</p>
                    <p><span className="font-medium">Hospital:</span> {mockDoctors.find(d => d.id === viewingAppointment.doctorId)?.hospital || 'N/A'}</p>
                    <p><span className="font-medium">Specialization:</span> {mockDoctors.find(d => d.id === viewingAppointment.doctorId)?.specialization || 'N/A'}</p>
                  </div>
                </div>

                {/* Medical Information */}
                <div className="md:col-span-2 space-y-4">
                  <h3 className="font-semibold text-lg">Medical Information</h3>
                  <div className="space-y-2">
                    <p><span className="font-medium">Disease/Condition:</span> {viewingAppointment.disease}</p>
                    <p><span className="font-medium">Severity:</span> {viewingAppointment.severity}</p>
                    <div>
                      <p className="font-medium mb-1">Symptoms:</p>
                      <ul className="list-disc pl-5">
                        {viewingAppointment.symptoms.map((symptom, index) => (
                          <li key={index}>{symptom}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="font-medium mb-1">Description:</p>
                      <p className="text-gray-700">{viewingAppointment.symptomsDescription}</p>
                    </div>
                  </div>
                </div>

                {/* Preparation Instructions */}
                <div className="md:col-span-2 space-y-4 bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-lg text-blue-700">Preparation Instructions</h3>
                  <ul className="list-disc pl-5 space-y-1 text-gray-700">
                    <li>Please arrive 15 minutes before your scheduled appointment time</li>
                    <li>Bring your ID and insurance card</li>
                    <li>Bring a list of all current medications</li>
                    <li>If this is a follow-up, bring any test results or medical records</li>
                    <li>If you need to cancel, please do so at least 24 hours in advance</li>
                  </ul>
                </div>
              </div>

              {viewingAppointment.status === 'scheduled' && (
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => {
                      handleReschedule(viewingAppointment);
                      setViewingAppointment(null);
                    }}
                    className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-emerald-300 text-white rounded-lg flex items-center gap-2"
                  >
                    <RefreshCw className="h-5 w-5" />
                    Reschedule
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BookAppointment;