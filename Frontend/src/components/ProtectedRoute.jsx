// src/components/ProtectedRoute.jsx
import { useAuth } from '../context/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';

export default function ProtectedRoute({ children, allowedRoles }) {
    const { auth } = useAuth();
    const location = useLocation();

    if (!auth?.token) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (allowedRoles && !allowedRoles.includes(auth?.role)) {
        return <Navigate to="/" replace />;
    }
    
    return children;
}