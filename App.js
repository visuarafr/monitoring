import React, { useEffect, useState } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { auth } from './firebase';
import UserDashboard from './UserDashboard';
import AdminDashboard from './AdminDashboard';
import Login from './Login';
import Register from './Register';

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        const role = user.email === 'yannrosemark@gmail.com' ? 'admin' : 'user';
        setUser({ ...user, role });
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      {user ? (
        <>
          <Route path="/" element={user.role === 'admin' ? <AdminDashboard /> : <UserDashboard />} />
        </>
      ) : (
        <Route path="/" element={<Navigate to="/login" />} />
      )}
    </Routes>
  );
};

export default App;
