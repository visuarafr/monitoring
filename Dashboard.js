import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, addDoc, Timestamp } from 'firebase/firestore';
import { auth, firestore } from './firebase';
import { TextField, Button, Grid, Typography, Container, Select, MenuItem, Box, Divider, Paper } from '@mui/material';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const CustomPaper = styled(motion.div)`
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-top: 2rem;
`;

const CustomCard = styled(motion.div)`
  background-color: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 1rem;
  margin-top: 1rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const Dashboard = () => {
  const [calls, setCalls] = useState(0);
  const [responses, setResponses] = useState(0);
  const [appointments, setAppointments] = useState(0);
  const [objections, setObjections] = useState('');
  const [data, setData] = useState([]);

  const handleSubmit = async () => {
    try {
      const user = auth.currentUser;
      await addDoc(collection(firestore, 'activities'), {
        userId: user.uid,
        calls,
        responses,
        appointments,
        objections,
        date: Timestamp.fromDate(new Date())
      });
      loadData();
    } catch (error) {
      console.error(error);
    }
  };

  const loadData = async () => {
    try {
      const user = auth.currentUser;
      const q = query(collection(firestore, 'activities'), where('userId', '==', user.uid));
      const querySnapshot = await getDocs(q);
      const loadedData = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          ...data,
          date: data.date.toDate().toLocaleDateString() // Convertir Timestamp en date lisible
        };
      });
      setData(loadedData);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <Container maxWidth="lg">
      <Box my={4}>
        <Typography variant="h2" component="h1" gutterBottom>
          Application de Suivi
        </Typography>
      </Box>
      <CustomPaper
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h4" component="h2" gutterBottom>
          Tableau de Bord
        </Typography>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Appels"
              type="number"
              value={calls}
              onChange={(e) => setCalls(Number(e.target.value))}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Réponses"
              type="number"
              value={responses}
              onChange={(e) => setResponses(Number(e.target.value))}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Rendez-vous"
              type="number"
              value={appointments}
              onChange={(e) => setAppointments(Number(e.target.value))}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Select
              fullWidth
              value={objections}
              onChange={(e) => setObjections(e.target.value)}
              displayEmpty
              variant="outlined"
            >
              <MenuItem value="" disabled>
                Sélectionnez une objection
              </MenuItem>
              <MenuItem value="Prix">Prix</MenuItem>
              <MenuItem value="Temps">Temps</MenuItem>
              <MenuItem value="Déjà une solution">Déjà une solution</MenuItem>
              <MenuItem value="Manque d'intérêt">Manque d'intérêt</MenuItem>
            </Select>
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              Soumettre
            </Button>
          </Grid>
        </Grid>
      </CustomPaper>
      <Box my={4}>
        <Typography variant="h4" component="h3" gutterBottom>
          Activités Quotidiennes
        </Typography>
        <Divider />
        <Grid container spacing={3}>
          {data.map((item, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <CustomCard
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Typography variant="body1" component="p">
                  {item.date} - Appels: {item.calls}, Réponses: {item.responses}, Rendez-vous: {item.appointments}, Objections: {item.objections}
                </Typography>
              </CustomCard>
            </Grid>
          ))}
        </Grid>
      </Box>
      <Box my={4}>
        <Typography variant="h4" component="h3" gutterBottom>
          Graphiques des Activités
        </Typography>
        <Divider />
        <Paper style={{ padding: '1rem' }}>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="calls" stroke="#8884d8" />
              <Line type="monotone" dataKey="responses" stroke="#82ca9d" />
              <Line type="monotone" dataKey="appointments" stroke="#ffc658" />
            </LineChart>
          </ResponsiveContainer>
        </Paper>
      </Box>
    </Container>
  );
};

export default Dashboard;
