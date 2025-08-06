export interface AppError {
  message: string;
  code?: string;
  status?: number;
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export const handleAuthError = (error: unknown): string => {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    
    if (message.includes('invalid login credentials')) {
      return 'Invalid email or password';
    }
    
    if (message.includes('email not confirmed')) {
      return 'Please check your email and confirm your account';
    }
    
    if (message.includes('weak password')) {
      return 'Password is too weak. Please choose a stronger password';
    }
    
    if (message.includes('email already registered')) {
      return 'An account with this email already exists';
    }
    
    if (message.includes('invalid email')) {
      return 'Please enter a valid email address';
    }
    
    return error.message;
  }
  
  return 'An unexpected error occurred';
};

export const handleApiError = (error: unknown): AppError => {
  if (error instanceof Error) {
    return {
      message: error.message,
      code: error.name,
    };
  }
  
  return {
    message: 'An unexpected error occurred',
    code: 'UNKNOWN_ERROR',
  };
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/(?=.*[a-z])/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/(?=.*[A-Z])/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/(?=.*\d)/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}; 