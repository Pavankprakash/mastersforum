import React, { useEffect, useState } from 'react';
import './App.css'
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import HomePage from './pages/HomePage';
import { AuthProvider, useAuth } from './context/AuthContext';

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProfilePage from './pages/ProfilePage';
import ClassesDetails from './pages/ClassesDetails';

const ProtectedRoute = ({ children }) => {
  const { auth, login } = useAuth();
  const [loading, setLoading] = useState(true); //Loading state while checking auth
  const navigate = useNavigate();

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/auth/checklogin`, {
          method: 'GET',
          credentials: 'include', // Include cookies for the auth token
        });
        const data = await response.json();

        console.log("Check Login :",data)
        if (response.ok && data.ok) {
          login({ userId: data.userId }); // Set user in context
        } else {
          navigate('/login');
        }
      }catch (error) {
        console.log(error);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };
    checkLoginStatus();

  }, [navigate,]);
  if (loading) {
    return <div>Loading...</div>; // can add a spinner or loading indicator here
  }
  return auth.user ? children : <Navigate to="/login" />;
}

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* 
              PUBLIC ROUTES
              No Navbar
          */}
          <Route
            path="/login"
            element={<Login />}
          />
          <Route
            path="/signup"
            element={<Signup />}
          />
          {/* 
              PROTECTED ROUTES
              Navbar appears here
         */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <>
                  <Navbar />
                  <HomePage />
                </>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <>
                  <Navbar />
                  <ProfilePage />
                </>
              </ProtectedRoute>
            }
          />
          <Route
            path="/classes/:classid"
            element={
              <ProtectedRoute>
                <>
                  <Navbar />
                  <ClassesDetails />
                </>
              </ProtectedRoute>
            }
          />
          {/* Unknown URL */}
          <Route
            path="*"
            element={<Navigate to="/login" replace />}
          />
        </Routes>
        <ToastContainer />
      </Router>
    </AuthProvider>
  );
};

export default App;