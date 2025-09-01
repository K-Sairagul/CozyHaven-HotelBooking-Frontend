import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('userRole');
    const userId = localStorage.getItem('UserId');
    const fullName = localStorage.getItem('userName');

    return token ? { token, role, fullName,userId:parseInt(userId) } : null;
  });

  const navigate = useNavigate();

  const login = (token, role, userId, fullName) => {
    localStorage.setItem('token', token);
    localStorage.setItem('userRole', role);
    localStorage.setItem('userId', userId);
    localStorage.setItem('userName', fullName);

    setAuth({ token, role, userId:parseInt(userId), fullName });
    navigate('/hotels');
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');

    setAuth(null);
    navigate('/landing-page');
  };

  // Remove the automatic redirect useEffect entirely
  // Or modify it to exclude public routes:
  useEffect(() => {
    const publicRoutes = ['/login', '/register', '/forgot-password', '/reset-password','/landing-page']
    const path = window.location.pathname
    
    if (!auth && !publicRoutes.includes(path)) {
      navigate("/login") // More standard to redirect to login
    }
  }, [auth, navigate])

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}