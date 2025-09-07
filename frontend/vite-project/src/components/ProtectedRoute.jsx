import { Navigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';

export default function ProtectedRoute({ children }) {
  const { data, isLoading } = useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      const { data } = await api.get('/auth/me');
      return data.user;
    },
    retry: false
  });

  if (isLoading) return <div className="card">Loading...</div>;
  if (!data) return <Navigate to="/login" replace />;
  return children;
}
