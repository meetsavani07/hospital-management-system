import toast from 'react-hot-toast';

export const showToast = {
  success: (message: string) => {
    toast.success(message, {
      icon: '✅',
    });
  },
  error: (message: string) => {
    toast.error(message, {
      icon: '❌',
    });
  },
  warning: (message: string) => {
    toast(message, {
      icon: '⚠️',
    });
  },
  info: (message: string) => {
    toast(message, {
      icon: 'ℹ️',
    });
  },
};
