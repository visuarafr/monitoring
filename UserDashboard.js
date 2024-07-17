import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, addDoc, Timestamp } from 'firebase/firestore';
import { auth, firestore } from './firebase';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Grid, Typography, Container, Select, MenuItem, Box, AppBar, Toolbar, CssBaseline, Card, CardContent, Divider, IconButton, InputAdornment } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CallIcon from '@mui/icons-material/Call';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import EventIcon from '@mui/icons-material/Event';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#ff4081',
    },
  },
  typography: {
    h2: {
      fontWeight: 700,
      color: '#333',
    },
    h4: {
      fontWeight: 500,
      color: '#666',
    },
    body1: {
      color: '#444',
    },
  },
});

const CustomPaper = styled(motion.div)`
  padding: 2rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  margin-top: 2rem;
`;

const CustomCard = styled(Card)`
  background-color: #f9f9f9;
  border: none;
  border-radius: 16px;
  padding: 1rem;
  margin-top: 1rem;
  transition: transform 0.3s, box-shadow 0.3s;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 30px rgba(0, 0, 0, 0.2);
  }
`;

const CustomButton = styled(Button)`
  margin-top: 1rem;
  background: linear-gradient(45deg, #2196F3 30%, #21CBF3 90%);
  color: white;
  &:hover {
    background: linear-gradient(45deg, #21CBF3 30%, #2196F3 90%);
  }
`;

const CustomAppBar = styled(AppBar)`
  background: linear-gradient(45deg, #2196F3 30%, #21CBF3 90%);
`;

const CustomToolbar = styled(Toolbar)`
  display: flex;
  justify-content: space-between;
`;

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const UserDashboard = () => {
  const [calls, setCalls] = useState(0);
  const [responses, setResponses] = useState(0);
  const [appointments, setAppointments] = useState(0);
  const [objections, setObjections] = useState('');
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Erreur de déconnexion:', error);
    }
  };

  const handleSubmit = async () => {
    try {
      const user = auth.currentUser;
      await addDoc(collection(firestore, 'activities'), {
        userId: user.uid,
        email: user.email,
        calls,
        responses,
        appointments,
        objections,
        date: Timestamp.fromDate(new Date())
      });
      console.log("Data submitted: ", {
        userId: user.uid,
        email: user.email,
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
          date: data.date.toDate().toLocaleDateString()
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

  const objectionData = data.reduce((acc, curr) => {
    const objection = curr.objections;
    if (objection) {
      acc[objection] = acc[objection] ? acc[objection] + 1 : 1;
    }
    return acc;
  }, {});

  const pieData = Object.keys(objectionData).map(key => ({
    name: key,
    value: objectionData[key]
  }));

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <CustomAppBar position="static">
        <CustomToolbar>
          <Typography variant="h6">
            Tableau de Bord Utilisateur
          </Typography>
          <IconButton color="inherit" onClick={handleLogout}>
            <ExitToAppIcon />
          </IconButton>
        </CustomToolbar>
      </CustomAppBar>
      <Container maxWidth="lg">
        <Box my={4}>
          <Typography variant="h2" component="h1" gutterBottom>
            Entrez vos chiffres quotidiens
          </Typography>
        </Box>
        <CustomPaper
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Appels"
                type="number"
                value={calls}
                onChange={(e) => setCalls(Number(e.target.value))}
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CallIcon />
                    </InputAdornment>
                  ),
                }}
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
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <QuestionAnswerIcon />
                    </InputAdornment>
                  ),
                }}
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
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EventIcon />
                    </InputAdornment>
                  ),
                }}
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
                <MenuItem value="Besoin">Besoin</MenuItem>
                <MenuItem value="Confiance">Confiance</MenuItem>
              </Select>
            </Grid>
          </Grid>
          <CustomButton
            variant="contained"
            color="primary"
            startIcon={<AddCircleOutlineIcon />}
            onClick={handleSubmit}
          >
            Soumettre
          </CustomButton>
        </CustomPaper>
        <Divider style={{ margin: '2rem 0' }} />
        <Box my={4}>
          <Typography variant="h4" component="h3" gutterBottom>
            Vos Données
          </Typography>
          <Grid container spacing={3}>
            {data.map((item, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <CustomCard>
                  <CardContent>
                    <Typography variant="h5" component="h2">
                      Date: {item.date}
                    </Typography>
                    <Typography variant="body1">
                      Appels: {item.calls}, Réponses: {item.responses}, Rendez-vous: {item.appointments}, Objections: {item.objections}
                    </Typography>
                  </CardContent>
                </CustomCard>
              </Grid>
            ))}
          </Grid>
        </Box>
        <Divider style={{ margin: '2rem 0' }} />
        <Box my={4}>
          <Typography variant="h4" component="h3" gutterBottom>
            Répartition des Objections
          </Typography>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={150}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default UserDashboard;
