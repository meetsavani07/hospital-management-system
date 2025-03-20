import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Calendar, Download, RefreshCw } from 'lucide-react';
import { mockInsurance } from '../../data/mockInsurance';

const Insurance: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 bg-gradient-to-br from-emerald-800 to-emerald-500 bg-clip-text text-transparent">
          My Insurance
        </h1>

        {/* Insurance Plans */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {mockInsurance.map((insurance, index) => (
            <motion.div
              key={insurance.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center">
                  <Shield className="h-6 w-6 text-emerald-500 mr-2" />
                  <h2 className="text-xl font-semibold">{insurance.planName}</h2>
                </div>
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    insurance.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {insurance.status}
                </span>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Provider</p>
                  <p className="font-medium">{insurance.provider}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Coverage</p>
                  <p className="font-medium">{insurance.coverage}</p>
                </div>

                <div className="flex justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Start Date</p>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                      <p className="font-medium">{insurance.startDate}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">End Date</p>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                      <p className="font-medium">{insurance.endDate}</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <button className="flex items-center text-blue-600 hover:text-blue-800">
                    <Download className="h-5 w-5 mr-1" />
                    Download Policy
                  </button>
                  <button className="flex items-center text-green-600 hover:text-green-800">
                    <RefreshCw className="h-5 w-5 mr-1" />
                    Renew Policy
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Insurance Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Coverage Benefits</h2>
            <ul className="space-y-3">
              <li className="flex items-center text-gray-700">
                <Shield className="h-5 w-5 text-emerald-500 mr-2" />
                Comprehensive medical coverage
              </li>
              <li className="flex items-center text-gray-700">
                <Shield className="h-5 w-5 text-emerald-500 mr-2" />
                24/7 emergency assistance
              </li>
              <li className="flex items-center text-gray-700">
                <Shield className="h-5 w-5 text-emerald-500 mr-2" />
                Cashless hospitalization
              </li>
              <li className="flex items-center text-gray-700">
                <Shield className="h-5 w-5 text-emerald-500 mr-2" />
                Pre and post hospitalization coverage
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Important Information</h2>
            <div className="space-y-4">
              <div>
                <p className="font-medium">Claims Process</p>
                <p className="text-sm text-gray-600">
                  Submit your claims through our online portal or contact our 24/7 support.
                </p>
              </div>
              <div>
                <p className="font-medium">Network Hospitals</p>
                <p className="text-sm text-gray-600">
                  Access to over 5000+ network hospitals across the country.
                </p>
              </div>
              <div>
                <p className="font-medium">Support</p>
                <p className="text-sm text-gray-600">
                  For any queries, contact our support team at 1800-XXX-XXXX
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Insurance;