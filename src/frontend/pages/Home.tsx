import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Typography, Grid, Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Dashboard from '../components/Dashboard';
import Header from '../components/common/Header';
import Sidebar from '../components/common/Sidebar';
import { fetchDashboardData } from '../store/actions/dashboardActions';
import { RootState } from '../store';
import { DashboardData } from '../../shared/types/dashboard';

// Define styles using makeStyles
const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
}));

const Home: React.FC = () => {
  const classes = useStyles();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();

  // Select dashboard data from Redux store
  const dashboardData = useSelector<RootState, DashboardData | null>(
    (state) => state.dashboard.data
  );

  // Fetch dashboard data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await dispatch(fetchDashboardData());
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch dashboard data');
        setLoading(false);
      }
    };
    fetchData();
  }, [dispatch]);

  return (
    <div className={classes.root}>
      <Header />
      <Sidebar />
      <main className={classes.content}>
        <Typography variant="h4" gutterBottom>
          Dashboard
        </Typography>
        {loading ? (
          <Typography>Loading...</Typography>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Paper className={classes.paper}>
                {dashboardData && <Dashboard data={dashboardData} />}
              </Paper>
            </Grid>
          </Grid>
        )}
      </main>
    </div>
  );
};

export default Home;

// TODO: Human tasks
// - Implement error boundary for better error handling
// - Add unit tests for the Home component
// - Implement skeleton loading state for better user experience