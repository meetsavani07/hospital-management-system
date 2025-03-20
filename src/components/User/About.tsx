import React from 'react';
import { Award, Users, Heart, Shield, Star, Clock, Trophy, Target, BookOpen, } from 'lucide-react';
import { motion } from 'framer-motion';

const About: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
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
          duration: 15,
          ease: "linear",
        },
      },
    },
  };

  const achievements = [
    "Best Hospital Award 2023",
    "Excellence in Patient Care",
    "Top Medical Research Center",
    "Outstanding Emergency Services",
    "Best Healthcare Provider",
    "Innovation in Medical Technology",
    "Community Service Excellence",
    "Patient Satisfaction Award",
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <motion.h1 
          className="text-3xl font-bold mb-8 bg-gradient-to-br from-emerald-800 to-emerald-500 bg-clip-text text-transparent"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          About MADICARE
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
                {achievements.map((achievement, idx) => (
                  <div key={idx} className="flex items-center space-x-2">
                    <Trophy className="h-6 w-6" />
                    <span className="text-lg font-semibold">{achievement}</span>
                  </div>
                ))}
              </div>
            ))}
          </motion.div>
        </div>

        {/* Mission & Vision */}
        <motion.div 
          className="bg-white rounded-lg shadow-md p-6 mb-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div variants={itemVariants}>
              <div className="flex items-center mb-4">
                <Target className="h-8 w-8 text-emerald-600 mr-3" />
                <h2 className="text-2xl font-bold">Our Mission</h2>
              </div>
              <p className="text-gray-600">
                To provide exceptional healthcare services with compassion and
                expertise, ensuring the well-being of our community through
                innovative medical solutions and patient-centered care.
              </p>
            </motion.div>
            <motion.div variants={itemVariants}>
              <div className="flex items-center mb-4">
                <BookOpen className="h-8 w-8 text-emerald-600 mr-3" />
                <h2 className="text-2xl font-bold">Our Vision</h2>
              </div>
              <p className="text-gray-600">
                To be the leading healthcare provider, recognized for excellence
                in medical care, research, and patient satisfaction, while
                continuously advancing healthcare standards.
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Core Values */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="bg-emerald-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <Heart className="h-6 w-6 text-emerald-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Compassion</h3>
            <p className="text-gray-600">
              We treat every patient with kindness, empathy, and respect.
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="bg-emerald-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <Award className="h-6 w-6 text-emerald-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Excellence</h3>
            <p className="text-gray-600">
              We strive for the highest standards in healthcare delivery.
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="bg-emerald-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <Shield className="h-6 w-6 text-emerald-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Integrity</h3>
            <p className="text-gray-600">
              We maintain the highest ethical standards in all our actions.
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="bg-emerald-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <Users className="h-6 w-6 text-emerald-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Teamwork</h3>
            <p className="text-gray-600">
              We collaborate effectively to provide comprehensive care.
            </p>
          </motion.div>
        </motion.div>

        {/* History & Timeline */}
        <motion.div 
          className="bg-white rounded-lg shadow-md p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <Clock className="h-8 w-8 text-emerald-600 mr-3" />
            Our Journey
          </h2>
          <div className="space-y-6">
            <div className="flex">
              <div className="flex-shrink-0 w-24 font-bold text-emerald-600">1995</div>
              <div>Founded as a small clinic with a vision to provide quality healthcare</div>
            </div>
            <div className="flex">
              <div className="flex-shrink-0 w-24 font-bold text-emerald-600">2000</div>
              <div>Expanded to a full-service hospital with multiple departments</div>
            </div>
            <div className="flex">
              <div className="flex-shrink-0 w-24 font-bold text-emerald-600">2010</div>
              <div>Established state-of-the-art research center</div>
            </div>
            <div className="flex">
              <div className="flex-shrink-0 w-24 font-bold text-emerald-600">2015</div>
              <div>Opened specialized centers for cardiac care and neurology</div>
            </div>
            <div className="flex">
              <div className="flex-shrink-0 w-24 font-bold text-emerald-600">2020</div>
              <div>Implemented advanced telemedicine services</div>
            </div>
            <div className="flex">
              <div className="flex-shrink-0 w-24 font-bold text-emerald-600">2024</div>
              <div>Continuing to expand and innovate in healthcare delivery</div>
            </div>
          </div>
        </motion.div>

        {/* Statistics */}
        <motion.div 
          className="bg-white rounded-lg shadow-md p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <Star className="h-8 w-8 text-emerald-600 mr-3" />
            Our Impact
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-4xl font-bold text-emerald-600 mb-2">50k+</div>
              <div className="text-gray-600">Patients Treated</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-emerald-600 mb-2">200+</div>
              <div className="text-gray-600">Expert Doctors</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-emerald-600 mb-2">98%</div>
              <div className="text-gray-600">Patient Satisfaction</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-emerald-600 mb-2">25+</div>
              <div className="text-gray-600">Years of Service</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;