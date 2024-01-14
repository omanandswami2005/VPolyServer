import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, Container, Grid, Typography, useTheme } from '@mui/material';
import Image from "react-bootstrap/Image";
import 'bootstrap/dist/css/bootstrap.css';
import i from '../images/Vpolyserver.png';
import '../styles/imageStyle.css';
import '../styles/Home.css';
import { useDarkMode } from '../DarkModeContext';

const Home = () => {
  const theme = useTheme();
  const { isDarkMode } = useDarkMode();

  
  const containerStyle = {
    display: 'block',
    // height: '100vh',
    // width: '100%',
  };

  const cardStyle = {
    padding: '20px',
    marginBottom: '20px',
    backgroundColor: isDarkMode ? theme.palette.background.paper : '#000',
    color: isDarkMode ? theme.palette.text.primary : '#fff',
    border: isDarkMode ? '1px solid #000' : '1px solid #fff',
  };


  return (
    <div style={containerStyle} className='w-100 h-100'>
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "10vh" }}>
        <Image src={i} className="logo" />
      </div>
      <Container>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card style={cardStyle}>
              <Typography variant="h4" align="center">Welcome to VPolyServer</Typography>
              <Typography variant="subtitle1" align="center" paragraph>Your AI Attendance System.</Typography>
              <hr className="my-2" />
              <Typography variant="body1">
                VPolyServer is an advanced AI attendance system that simplifies attendance tracking for institutions and students using face recognition.
              </Typography>
              <Link to="/login" style={{ textDecoration: 'none', color: 'inherit' }}>
                <Button variant="contained" color="primary" style={{ marginTop: '20px', display: 'block', marginLeft: 'auto', marginRight: 'auto' }}>
                  Go to Faculty Login
                </Button>
              </Link>
            </Card>
          </Grid>
          {/* Add more Grid items for additional cards if needed */}
        </Grid>
      </Container>
    </div>
  );
};

export default Home;
