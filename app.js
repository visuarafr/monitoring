import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import SalespersonDashboard from './components/SalespersonDashboard';
import AdminDashboard from './components/AdminDashboard';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/signup" component={Signup} />
        <Route path="/salesperson-dashboard" component={SalespersonDashboard} />
        <Route path="/admin-dashboard" component={AdminDashboard} />
        <Route path="/" exact component={Login} />
      </Switch>
    </Router>
  );
}

export default App;
