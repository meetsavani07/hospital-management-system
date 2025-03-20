import React from 'react';
import {
  Building2,
  Stethoscope,
  Microscope,
  Bed,
  Syringe,
  Activity,
  Thermometer,
  Brain,
  Baby,
  Heart,
  Bone,
  Eye,
  Pill,
  Ambulance,
} from 'lucide-react';
import { motion } from 'framer-motion';

const facilities = [
  {
    icon: Building2,
    name: 'Emergency Department',
    description:
      '24/7 emergency care with state-of-the-art equipment and experienced staff.',
  },
  {
    icon: Stethoscope,
    name: 'Outpatient Department',
    description:
      'Comprehensive outpatient services across multiple specialties.',
  },
  {
    icon: Microscope,
    name: 'Diagnostic Center',
    description:
      'Advanced diagnostic facilities including laboratory and imaging services.',
  },
  {
    icon: Bed,
    name: 'Inpatient Wards',
    description:
      'Comfortable and well-equipped rooms for patient care and recovery.',
  },
  {
    icon: Syringe,
    name: 'Vaccination Center',
    description:
      'Regular and specialized vaccination services for all age groups.',
  },
  {
    icon: Activity,
    name: 'ICU',
    description:
      'Intensive Care Unit with modern life support systems and monitoring.',
  },
];

const departments = [
  {
    icon: Heart,
    name: 'Cardiology',
    description: 'Comprehensive heart care and treatment.',
  },
  {
    icon: Brain,
    name: 'Neurology',
    description: 'Expert care for neurological conditions.',
  },
  {
    icon: Baby,
    name: 'Pediatrics',
    description: 'Specialized care for children and infants.',
  },
  {
    icon: Bone,
    name: 'Orthopedics',
    description: 'Treatment for bone and joint conditions.',
  },
  {
    icon: Eye,
    name: 'Ophthalmology',
    description: 'Complete eye care services.',
  },
  {
    icon: Thermometer,
    name: 'Internal Medicine',
    description: 'Diagnosis and treatment of adult diseases.',
  },
  {
    icon: Pill,
    name: 'Pharmacy',
    description: '24/7 pharmacy services with all medications.',
  },
  {
    icon: Ambulance,
    name: 'Ambulance Services',
    description: 'Emergency medical transportation available 24/7.',
  },
];

const Facilities: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  const infiniteScrollVariants = {
    animate: {
      x: [0, -1000],
      transition: {
        x: {
          repeat: Infinity,
          repeatType: "loop",
          duration: 20,
          ease: "linear",
        },
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <motion.h1
          className="text-3xl font-bold mb-8 bg-gradient-to-br from-emerald-800 to-emerald-500 bg-clip-text text-transparent"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          Our Facilities
        </motion.h1>

        {/* Infinite Scroll Banner */}
        <div className="overflow-hidden mb-12 bg-gradient-to-r from-emerald-600 to-emerald-300 text-white py-4 rounded-full">
          <motion.div
            className="flex whitespace-nowrap"
            variants={infiniteScrollVariants}
            animate="animate"
          >
            {[...Array(3)].map((_, index) => (
              <div key={index} className="flex space-x-8">
                {departments.map((departments, idx) => (
                  <div key={idx} className="flex items-center space-x-2">
                    <span className="text-lg font-semibold">{departments.name}</span>
                    <departments.icon className="h-6 w-10" />
                  </div>
                ))}
              </div>
            ))}
          </motion.div>
        </div>

        {/* Main Facilities Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
        >
          {facilities.map((facility, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center mb-4">
                <div className="bg-emerald-100 rounded-full p-3 mr-4">
                  <facility.icon className="h-6 w-6 text-emerald-600" />
                </div>
                <h3 className="text-lg font-semibold">{facility.name}</h3>
              </div>
              <p className="text-gray-600">{facility.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Departments Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-lg shadow-md p-6 mb-12"
        >
          <h2 className="text-2xl font-bold mb-6">Our Departments</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {departments.map((dept, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className="p-4 rounded-lg bg-gray-50 hover:bg-emerald-50 transition-colors"
              >
                <div className="flex items-center mb-2">
                  <dept.icon className="h-5 w-5 text-emerald-600 mr-2" />
                  <h3 className="font-semibold">{dept.name}</h3>
                </div>
                <p className="text-sm text-gray-600">{dept.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Additional Information */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-6">Why Choose Our Facilities?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="text-lg font-semibold mb-2">Modern Equipment</h3>
              <p className="text-gray-600">
                Our facilities are equipped with the latest medical technology
                to provide accurate diagnosis and effective treatment.
              </p>
            </motion.div>
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <h3 className="text-lg font-semibold mb-2">Expert Staff</h3>
              <p className="text-gray-600">
                Our medical professionals are highly trained and experienced in
                their respective fields.
              </p>
            </motion.div>
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <h3 className="text-lg font-semibold mb-2">24/7 Availability</h3>
              <p className="text-gray-600">
                Emergency services and critical care facilities are available
                round the clock.
              </p>
            </motion.div>
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <h3 className="text-lg font-semibold mb-2">Patient Comfort</h3>
              <p className="text-gray-600">
                We prioritize patient comfort with well-maintained and clean
                facilities.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Facilities;