import React, { useState } from 'react'; // Import React and useState hook for managing form data
import { X } from 'lucide-react'; // Import X icon for closing the form
import type { Staff } from '../../../types/staff'; // Import the Staff type for type-checking

// Define the type for the component's props
interface AddDoctorFormProps {
  isOpen: boolean; // Determines if the form is open or not
  onClose: () => void; // Function to close the form
  onSubmit: (data: Omit<Staff, 'id'>) => void; // Function to handle form submission, expects a staff object excluding 'id'
}

// Define the AddDoctorForm component
const AddDoctorForm: React.FC<AddDoctorFormProps> = ({ isOpen, onClose, onSubmit }) => {
  // State for form data, initialized with default values
  const [formData, setFormData] = useState({
    name: '',
    specialization: '',
    qualification: '',
    experience: '',
    contact: '',
    email: '',
    schedule: {
      days: ['Monday'], // Default schedule for the doctor
      startTime: '09:00',
      endTime: '17:00'
    }
  });

  // Handle form submission, prevent default form behavior
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // On submit, pass the form data along with a fixed role ('doctor') and availability status
    onSubmit({
      ...formData,
      role: 'doctor', // Set the role to 'doctor'
      experience: parseInt(formData.experience), // Parse experience as an integer
      isAvailable: true // Default availability status set to true
    });
    onClose(); // Close the form after submission
  };

  // Return null if the form is not open
  if (!isOpen) return null;

  return (
    // Modal backdrop to darken the background and center the form
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      {/* Modal content box */}
      <div className="bg-white rounded-lg w-full max-w-md p-6 relative">
        {/* Close button */}
        <button
          onClick={onClose} // Trigger the onClose function when clicked
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          <X className="h-5 w-5" /> {/* Close icon */}
        </button>

        {/* Form title */}
        <h2 className="text-2xl font-bold mb-6">Add New Doctor</h2>

        {/* Form for adding a new doctor */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              required
              value={formData.name} // Bind value to state
              onChange={(e) => setFormData({ ...formData, name: e.target.value })} // Update state on change
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Specialization input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Specialization
            </label>
            <input
              type="text"
              required
              value={formData.specialization} // Bind value to state
              onChange={(e) => setFormData({ ...formData, specialization: e.target.value })} // Update state on change
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Qualification input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Qualification
            </label>
            <input
              type="text"
              required
              value={formData.qualification} // Bind value to state
              onChange={(e) => setFormData({ ...formData, qualification: e.target.value })} // Update state on change
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Experience input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Experience (years)
            </label>
            <input
              type="number"
              required
              min="0" // Set minimum experience value to 0
              value={formData.experience} // Bind value to state
              onChange={(e) => setFormData({ ...formData, experience: e.target.value })} // Update state on change
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Contact input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contact Number
            </label>
            <input
              type="tel"
              required
              value={formData.contact} // Bind value to state
              onChange={(e) => setFormData({ ...formData, contact: e.target.value })} // Update state on change
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Email input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              required
              value={formData.email} // Bind value to state
              onChange={(e) => setFormData({ ...formData, email: e.target.value })} // Update state on change
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Action buttons (Cancel and Submit) */}
          <div className="flex justify-end space-x-3 mt-6">
            {/* Cancel button */}
            <button
              type="button"
              onClick={onClose} // Close the form without saving
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            {/* Submit button */}
            <button
              type="submit" // Submit the form
              className="px-4 py-2 text-white bg-green-500 rounded-lg hover:bg-green-600 transition-colors"
            >
              Add Doctor
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Export the component for use elsewhere in the app
export default AddDoctorForm;
