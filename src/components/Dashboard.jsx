import React, { useEffect, useState } from 'react';
import { CgProfile } from "react-icons/cg";
import "./Dashboard.css"
import {
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  Box,
  Divider,
} from '@mui/material';
import { Doughnut, Bar } from 'react-chartjs-2';
import axios from 'axios';
import 'chart.js/auto';

const chartStyle = {
  position: 'relative',
  width: '100%',
  height: '250px',
};

const UserDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchStats = async (userId) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/user/stats?userId=${userId}`);
      setStats(res.data);
      console.log(res.data);
    } catch (err) {
      console.error('Failed to load stats:', err);
      setError('Failed to fetch dashboard statistics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const uid = localStorage.getItem('uID');
    if (!uid) {
      setError('User not logged in. Please log in to access the dashboard.');
      setLoading(false);
      return;
    }
    fetchStats(uid);
  }, []);

  if (loading) {
    return (
      <Grid container justifyContent="center" alignItems="center" style={{ height: '100vh' }}>
        <CircularProgress />
      </Grid>
    );
  }

  if (error) {
    return (
      <Grid container justifyContent="center" alignItems="center" style={{ height: '100vh' }}>
        <Alert severity="error">{error}</Alert>
      </Grid>
    );
  }

  return (
    <div className="dashboardWrapper" style={{
      
    }}>

      <div className="userProfileCardContainer" >
        <div className="userProfileCard">
          <div className="email">
            {stats.user.email}
          </div>
          <div className="userName">
             <span className='profileIcon' ><CgProfile/></span> 
            {stats.user.firstName + " " +stats.user.lastName}
          </div>
        </div>
      </div>
    <Box p={4} marginTop={"20px"}>
      {/* Summary Cards */}
      <Grid container spacing={3} mb={5}>
        <Grid item xs={12} md={6} sx={{ display: 'flex' }}>
          <Card sx={{ flexGrow: 1,backgroundColor:"rgb(248, 222, 72)" }}>
            <CardContent>
              <Typography variant="h6" gutterBottom style={{
                color:"#FFF"
              }}>Total Lost Items</Typography>
              <Typography variant="h3" color="#FFF">{stats.totalLost}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6} sx={{ display: 'flex' }}>
          <Card sx={{ flexGrow: 1 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Total Found Items</Typography>
              <Typography variant="h3" color="primary">{stats.totalFound}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Stats Section */}
      <Typography variant="h5" fontWeight={600} mb={2}>📊 STATS</Typography>
      <Divider sx={{ mb: 4 }} />

      <Grid container spacing={3}>
        {/* Left Column: Two Doughnut Charts (Stacked Vertically) */}
        <Grid item xs={12} md={6}>
          <Grid container spacing={3} direction="column">
            <Grid item>
              <Card>
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>Lost Items by Category</Typography>
                  <div style={chartStyle}>
                    <Doughnut
                      data={{
                        labels: Object.keys(stats.lostByCategory),
                        datasets: [{
                          data: Object.values(stats.lostByCategory),
                          backgroundColor: ['#f44336', '#ff9800', '#2196f3', '#4caf50', '#9c27b0'],
                        }]
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            </Grid>
            <Grid item>
              <Card>
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>Found Items by Category</Typography>
                  <div style={chartStyle}>
                    <Doughnut
                      data={{
                        labels: Object.keys(stats.foundByCategory),
                        datasets: [{
                          data: Object.values(stats.foundByCategory),
                          backgroundColor: ['#3f51b5', '#009688', '#e91e63', '#ffc107', '#00bcd4'],
                        }]
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>

        {/* Right Column: Tall Bar Chart */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%', width: "100%" }}>
            <CardContent sx={{ height: '100%', width: "96%" }}>
              <Typography variant="subtitle1" gutterBottom>
                Lost vs Found (Last 6 Months)
              </Typography>
              <Box sx={{ height: '530px' }}>
                <Bar
                  data={{
                    labels: Object.keys(stats.lostPerMonth),
                    datasets: [
                      {
                        label: 'Lost',
                        data: Object.values(stats.lostPerMonth),
                        backgroundColor: 'rgba(244, 67, 54, 0.6)',
                      },
                      {
                        label: 'Found',
                        data: Object.values(stats.foundPerMonth),
                        backgroundColor: 'rgba(33, 150, 243, 0.6)',
                      }
                    ]
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
    </div>
  );
};

export default UserDashboard;
