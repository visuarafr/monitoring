import React, { useState, useEffect } from 'react';
import { collection, getDocs, query } from 'firebase/firestore';
import { firestore, auth } from './firebase';  // Importer auth
import { signOut } from 'firebase/auth';  // Importer signOut
import { useNavigate } from 'react-router-dom';  // Importer useNavigate
import {
  Select,
  MenuItem,
  Typography,
  Container,
  Grid,
  Box,
  Divider,
  Card,
  CardContent,
  AppBar,
  Toolbar,
  CssBaseline,
  InputLabel,
  FormControl,
  CircularProgress,
  Button  // Importer Button
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';  // Importer recharts
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { subWeeks, subMonths, isAfter, startOfDay } from 'date-fns';

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

const CustomPaper = styled.div`
  padding: 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  margin-top: 2rem;
`;

const CustomCard = styled(Card)`
  background-color: #f9f9f9;
  border: none;
  border-radius: 12px;
  margin-top: 1rem;
  transition: transform 0.3s, box-shadow 0.3s;

  &:hover {
    transform: scale(1.03);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  }
`;

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const AdminDashboard = () => {
  const [data, setData] = useState([]);
  const [user, setUser] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('');
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Erreur de déconnexion:', error);
    }
  };

  const loadData = async () => {
    try {
      const q = query(collection(firestore, 'activities'));
      const querySnapshot = await getDocs(q);
      const loadedData = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          ...data,
          date: data.date.toDate()
        };
      });
      setData(loadedData);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  const loadUsers = async () => {
    try {
      const q = query(collection(firestore, 'users'));
      const querySnapshot = await getDocs(q);
      const loadedUsers = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          userId: data.uid,
          firstName: data.firstName || ''
        };
      });

      console.log("Loaded Users:", loadedUsers);

      setUsers(loadedUsers);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadData();
    loadUsers();
  }, []);

  const filterData = () => {
    const now = new Date();
    let startDate;

    switch (period) {
      case 'today':
        startDate = startOfDay(now);
        break;
      case 'lastWeek':
        startDate = subWeeks(now, 1);
        break;
      case 'lastMonth':
        startDate = subMonths(now, 1);
        break;
      case 'previousMonths':
        startDate = subMonths(now, 2);
        break;
      default:
        return data;
    }

    return data.filter(item => isAfter(item.date, startDate));
  };

  const filteredData = filterData().filter(item => user === '' || item.userId === user);

  const objectionData = filteredData.reduce((acc, curr) => {
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
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Tableau de Bord Administrateur
          </Typography>
          <Button color="inherit" onClick={handleLogout}>Déconnexion</Button>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg">
        <Box my={4}>
          <Typography variant="h2" component="h1" gutterBottom>
            Vue Globale des Performances
          </Typography>
        </Box>
        <CustomPaper>
          <FormControl fullWidth variant="outlined" margin="normal">
            <InputLabel id="user-select-label">Tous les Utilisateurs</InputLabel>
            <Select
              labelId="user-select-label"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              label="Tous les Utilisateurs"
            >
              <MenuItem value=''>Tous les Utilisateurs</MenuItem>
              {users.map((user, index) => (
                <MenuItem key={index} value={user.userId}>{user.firstName}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth variant="outlined" margin="normal">
            <InputLabel id="period-select-label">Période</InputLabel>
            <Select
              labelId="period-select-label"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              label="Période"
            >
              <MenuItem value=''>Toutes les Périodes</MenuItem>
              <MenuItem value='today'>Aujourd'hui</MenuItem>
              <MenuItem value='lastWeek'>La semaine dernière</MenuItem>
              <MenuItem value='lastMonth'>Le mois dernier</MenuItem>
              <MenuItem value='previousMonths'>Les mois précédents</MenuItem>
            </Select>
          </FormControl>
          <Divider style={{ margin: '2rem 0' }} />
          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
              <CircularProgress />
            </Box>
          ) : (
            <>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={filteredData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <Line type="monotone" dataKey="calls" stroke="#8884d8" />
                      <CartesianGrid stroke="#ccc" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                    </LineChart>
                  </ResponsiveContainer>
                </Grid>
                <Grid item xs={12}>
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
                </Grid>
                {filteredData.map((item, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <CustomCard component={motion.div}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <CardContent>
                        <Typography variant="body1" component="p">
                          {item.date.toLocaleDateString()} - Appels: {item.calls}, Réponses: {item.responses}, Rendez-vous: {item.appointments}, Objections: {item.objections}
                        </Typography>
                      </CardContent>
                    </CustomCard>
                  </Grid>
                ))}
              </Grid>
            </>
          )}
        </CustomPaper>
      </Container>
    </ThemeProvider>
  );
};

export default AdminDashboard;
