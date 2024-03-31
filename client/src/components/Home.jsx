import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Container, Grid, Typography } from '@mui/material';
import Image from "react-bootstrap/Image";
import 'bootstrap/dist/css/bootstrap.css';
import i from '../images/Vpolyserver.png';
import '../styles/imageStyle.css';
import { ArrowRightIcon } from '@primer/octicons-react';
import AndroidButton from './AndroidButton';

const Home = () => {
  const cardStyle = {
    padding: '20px',
    marginBottom: '20px',
   
  };


  return (
    <div  className=' h-50 m-4' style={{ width:'90%' }}>
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "10vh" }}>
        <Image src={i} className="logo my-3" />
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
              <Link to="/login" style={{ textDecoration: 'none',  }}>
             
        <AndroidButton color='#555' text='Go to Login' icon={<ArrowRightIcon size={24} />} />
              </Link>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default Home;
