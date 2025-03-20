import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { showToast } from '../../utils/toast';
import { motion } from 'framer-motion';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { Mail, Lock, AlertCircle, IdCard } from 'lucide-react';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSignup, setIsSignup] = useState(true);
  const [name, setName] = useState('');
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login, signup } = useAuth();

  // Check for verification token in URL
  React.useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      verifyEmail(token);
    }
  }, [searchParams]);

  const verifyEmail = async (token: string) => {
    try {
      // Assuming email verification is handled externally or another way
      showToast.success('Email verified successfully! Please login.');
    } catch (error) {
      console.error('Email verification error:', error);
      showToast.error('Invalid or expired verification link.');
    }
  };
  

  const handleForgotPassword = async () => {
    if (!resetEmail) {
      setError('Please enter your email address.');
      return;
    }
  
    try {
      showToast.success('Password reset link sent to your email!');
      setIsForgotPassword(false);
      setResetEmail('');
    } catch (error) {
      console.error('Forgot password error:', error);
      showToast.error('Failed to send reset link. Please try again.');
    }
  };
  
  const handleSubmit = async () => {
    setError('');

    if (!email || !password || (isSignup && !name)) {
      setError('Please fill in all fields.');
      return;
    }

    try {
      if (isSignup) {
        const result = await signup(email, password, name);
        if (result.success) {
          showToast.success('Please check your email for verification link!');
          setIsSignup(false);
        } else {
          setError(result.message);
        }
      } else {
        const success = await login(email, password);
        if (success) {
          showToast.success('Successfully logged in!');
          navigate('/user');
        } else {
          setError('Invalid credentials. Please check your email and password.');
        }
      }
    } catch {
      setError('An error occurred. Please try again.');
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      const decoded: any = jwtDecode(credentialResponse.credential);
  
      showToast.success('Successfully logged in with Google!');
      localStorage.setItem('token', credentialResponse.credential);
      localStorage.setItem('user', JSON.stringify(decoded));
      
      navigate('/user');
    } catch (error) {
      console.error('Google login error:', error);
      showToast.error('Failed to login with Google');
    }
  };
  

  if (isForgotPassword) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold bg-gradient-to-r from-green-700 to-lime-400 bg-clip-text text-transparent">
              Reset Password
            </h2>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleForgotPassword}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="reset-email" className="sr-only">
                  Email address
                </label>
                <input
                  id="reset-email"
                  name="email"
                  type="email"
                  required
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Email address"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <motion.button
                type="button"
                onClick={() => setIsForgotPassword(false)}
                className="text-blue-500 hover:text-blue-700"
                whileHover={{ scale: 1.02 }}
              >
                Back to login
              </motion.button>
              <button
                type="submit"
                className="group relative w-auto flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-teal-400 to-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Send Reset Link
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen sm:flex flex-col sm:flex-row items-center justify-center sm:mt-0 mt-20 bg-white py-12 px-4 sm:px-6 md:px-16 lg:px-24 xl:px-32">
      <motion.div
        className="sm:mx-auto sm:w-full sm:max-w-md flex flex-col"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-center">
          <motion.img
            alt="Logo"
            src="/src/image/MEDICARE.png"
            width="80"
            className="sm:w-[100px]"
            whileHover={{ scale: 1.1 }}
          />
        </div>
        <h2 className="mt-4 text-center text-2xl sm:text-4xl font-extrabold bg-gradient-to-r from-green-700 to-lime-400 bg-clip-text text-transparent">
          MEDICARE
        </h2>
        <p className="mt-2 text-center text-sm text-gray-500">
          {isSignup ? 'Create your account' : 'Sign in to access the dashboard'}
        </p>
      </motion.div>

      <motion.div
        className="mt-6 sm:mt-8 sm:mx-auto sm:w-full sm:max-w-md"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="bg-white py-6 px-4 sm:py-8 sm:px-6 border rounded-lg shadow-lg">
          <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 flex items-center">
                <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {isSignup && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <div className="mt-1 relative">
                  <IdCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5"/>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="block w-full pl-10 border border-gray-300 rounded-md py-2 px-3 text-black focus:outline-none focus:ring-green-500"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1 relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 border border-gray-300 rounded-md py-2 px-3 text-black focus:outline-none focus:ring-green-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 border border-gray-300 rounded-md py-2 px-3 text-black focus:outline-none focus:ring-green-500"
                />
              </div>
            </div>

            {!isSignup && (
              <div className="text-sm text-right">
                <motion.button
                  type="button"
                  onClick={() => setIsForgotPassword(true)}
                  className="text-blue-500 hover:text-blue-700"
                  whileHover={{ scale: 1.02 }}
                >
                  Forgot your password?
                </motion.button>
              </div>
            )}

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex justify-center py-2 px-4 rounded-md text-white bg-gradient-to-r from-teal-400 to-teal-600"
            >
              {isSignup ? 'Sign up' : 'Sign in'}
            </motion.button>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <div className="flex justify-center">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() => {
                      console.log('Login Failed');
                      showToast.error('Google login failed');
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="text-sm text-center">
              <motion.button
                type="button"
                onClick={() => setIsSignup(!isSignup)}
                className="text-blue-500 hover:text-blue-700"
                whileHover={{ scale: 1.02 }}
              >
                {isSignup
                  ? 'Already have an account? Sign in'
                  : "Don't have an account? Sign up"}
              </motion.button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;