import { useContext } from 'react';
import { AuthContext } from '@/components/auth/AuthProvider';

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}