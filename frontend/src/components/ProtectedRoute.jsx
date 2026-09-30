import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
// wrapper component like a container - here children is the pages which is wrapped by this 
// ProtectedRoute 
function ProtectedRoute({children}) {
    const { user } = useAuth();
    if (!user) {
        return <Navigate to="/login" replace />;
    }
    // if user is there then show the children
  return children;
}

export default ProtectedRoute