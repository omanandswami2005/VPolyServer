import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Container, Grid, Typography } from '@mui/material';
import Image from "react-bootstrap/Image";
import i from '../images/Vpolyserver.webp';
// import '../styles/imageStyle.css';
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
        <Image src={i} alt="VPolyServer_Image" className="logo my-3" />
      </div>
      <Container>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card style={cardStyle}>
              <Typography variant="h4" align="center">Welcome to VPolyServer !</Typography>
              <Typography variant="subtitle1" align="center" paragraph>An Integrated Platform For Polytechnic Colleges !!!</Typography>
              <hr className="my-2" />
              <Typography variant="h6" align="center">
                VPolyServer is an integrated platform for <br /> <span style={{ color: 'red', fontWeight: 'bold' }}> Polytechnic Colleges</span> <br /> to manage attendancea of students.
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
