import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function PrivateRoute({ children, role }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/signin" replace />;
  if (role && user.userType !== role) return <Navigate to="/signin" replace />;
  return children;
}