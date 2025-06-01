import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children, requiredRole }) {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  console.log('ProtectedRoute user:', user); // LOG para depuración

  if (!user.token) {
    console.warn('No token, redirigiendo a login');
    return <Navigate to="/login" />;
  }

  if (requiredRole && user.rol !== requiredRole) {
    console.warn('Rol incorrecto, redirigiendo a /');
    return <Navigate to="/" />;
  }

  return children;
}
