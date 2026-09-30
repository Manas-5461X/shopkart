import React from 'react'
import { useAuth } from '../context/AuthContext'
import { Navigate } from 'react-router-dom'

// wrapper component like a container - here children is the pages which is wrapped by this 
// PublicRoute 
function PublicRoute({children}) {
    const { user } = useAuth();
    // if  there is user move the user to home page else show the public route page 
    if (user) { 
        return <Navigate to="/" replace />;
    }
    // if user is not there then show the public route page 
  return children;
}

export default PublicRoute