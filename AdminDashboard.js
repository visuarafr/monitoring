import React, { useState, useEffect } from 'react';
import { firestore } from '../firebase/config';
import { collection, getDocs } from 'firebase/firestore';

const AdminDashboard = () => {
  const [entries, setEntries] = useState([]);

  const fetchEntries = async () => {
    const querySnapshot = await getDocs(collection(firestore, 'entries'));
    const data = querySnapshot.docs.map(doc => doc.data());
    setEntries(data);
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <ul>
        {entries.map((entry, index) => (
          <li key={index}>
            Calls: {entry.calls}, Answers: {entry.answers}, Appointments: {entry.appointments}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminDashboard;
