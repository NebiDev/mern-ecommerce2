import React from 'react'
import { useSelector } from 'react-redux'
import Loader from '../components/Loader'
import { Navigate } from 'react-router-dom'

function ProtectedRoute({element}) {

    const { isAuthenticated, loading } = useSelector((state) => state.user)

    if (loading) {
        return <Loader />
    }
    if (isAuthenticated === false) {
        return <Navigate to="/login" replace />
    }


   


  return element
    
  
}

export default ProtectedRoute
