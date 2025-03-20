import { useState, useEffect, useCallback } from 'react';

interface User {
  id: number;
  email: string;
  name: string;
  role: 'admin' | 'doctor' | 'nurse' | 'enquiry' | 'user';
  department?: string;
  specialization?: string;
}

interface UserData {
  id: number;
  email: string;
  password: string;
  name: string;
  role: 'admin' | 'doctor' | 'nurse' | 'enquiry' | 'user';
  department?: string;
  specialization?: string;
  isEmailVerified?: boolean;
  verificationToken?: string;
}

// Mock users database
const mockUsers: UserData[] = [
  {
    id: 1,
    email: 'admin@example.com',
    password: 'password',
    name: 'Admin User',
    role: 'admin',
    isEmailVerified: true,
  },
  {
    id: 2,
    email: 'doctor@example.com',
    password: 'doctor123',
    name: 'Dr. John Smith',
    role: 'doctor',
    specialization: 'Cardiology',
    isEmailVerified: true,
  },
  {
    id: 3,
    email: 'nurse@example.com',
    password: 'nurse123',
    name: 'Sarah Johnson',
    role: 'nurse',
    department: 'Emergency',
    isEmailVerified: true,
  },
  {
    id: 4,
    email: 'enquiry@example.com',
    password: 'enquiry123',
    name: 'Emily Davis',
    role: 'enquiry',
    department: 'Front Desk',
    isEmailVerified: true,
  },
  {
    id: 5,
    email: 'user@example.com',
    password: 'user123',
    name: 'John Doe',
    role: 'user',
    isEmailVerified: true,
  },
];

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Error parsing stored user:', error);
          localStorage.removeItem('user');
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    try {
      const user = mockUsers.find(
        (u) => u.email === email && u.password === password
      );

      if (user) {
        if (!user.isEmailVerified) {
          throw new Error('Please verify your email before logging in');
        }

        const userData: User = {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          ...(user.department && { department: user.department }),
          ...(user.specialization && { specialization: user.specialization }),
        };
        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem('user', JSON.stringify(userData));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  }, []);

  const generateVerificationToken = () => {
    return Math.random().toString(36).substring(2, 15);
  };

  const signup = useCallback(async (email: string, password: string, name: string) => {
    try {
      const existingUser = mockUsers.find((u) => u.email === email);
      if (existingUser) {
        return { success: false, message: 'Email already exists' };
      }

      const verificationToken = generateVerificationToken();
      const newUser: UserData = {
        id: mockUsers.length + 1,
        email,
        password,
        name,
        role: 'user',
        isEmailVerified: false,
        verificationToken,
      };

      mockUsers.push(newUser);

      // In a real application, send verification email here
      console.log('Verification link:', `http://localhost:5173/verify?token=${verificationToken}`);

      return { success: true, message: 'Please check your email for verification' };
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, message: 'An error occurred during signup' };
    }
  }, []);

  const verifyEmail = useCallback(async (token: string) => {
    try {
      const user = mockUsers.find((u) => u.verificationToken === token);
      if (user) {
        user.isEmailVerified = true;
        user.verificationToken = undefined;
        return { success: true };
      }
      return { success: false, message: 'Invalid verification token' };
    } catch (error) {
      console.error('Verification error:', error);
      return { success: false, message: 'An error occurred during verification' };
    }
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    try {
      const user = mockUsers.find((u) => u.email === email);
      if (!user) {
        return { success: false, message: 'User not found' };
      }

      // In a real application, send reset password email here
      const resetToken = generateVerificationToken();
      console.log('Reset password link:', `http://localhost:5173/reset-password?token=${resetToken}`);

      return { success: true, message: 'Password reset link sent to your email' };
    } catch (error) {
      console.error('Reset password error:', error);
      return { success: false, message: 'An error occurred' };
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
    window.location.href = '/';
  }, []);

  return { 
    isAuthenticated, 
    user, 
    login, 
    logout, 
    signup, 
    isLoading,
    verifyEmail,
    resetPassword
  };
};