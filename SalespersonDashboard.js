import React, { useState, useEffect } from 'react';
import { firestore } from '../firebase/config';
import { collection, addDoc, getDocs } from 'firebase/firestore';

const SalespersonDashboard = () => {
  const [calls, setCalls] = useState('');
  const [answers, setAnswers] = useState('');
  const [appointments, setAppointments] = useState('');
  const [entries, setEntries] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(firestore, 'entries'), {
        calls,
        answers,
        appointments,
        timestamp: new Date()
      });
      setCalls('');
      setAnswers('');
      setAppointments('');
      fetchEntries();
    } catch (error) {
      console.error("Error adding entry: ", error);
    }
  };

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
      <h2>Salesperson Dashboard</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          value={calls}
          onChange={(e) => setCalls(e.target.value)}
          placeholder="Number of Calls"
        />
        <input
          type="number"
          value={answers}
          onChange={(e) => setAnswers(e.target.value)}
          placeholder="Number of Answers"
        />
        <input
          type="number"
          value={appointments}
          onChange={(e) => setAppointments(e.target.value)}
          placeholder="Number of Appointments"
        />
        <button type="submit">Submit</button>
      </form>
      <h3>Past Entries</h3>
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

export default SalespersonDashboard;
