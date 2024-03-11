import React, { useState,useEffect } from 'react';
import {  Form, FormGroup, Label, Input, } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import '../styles/Login.css';
import axios from 'axios';

import { Card } from '@mui/material';
import AndroidButton from './AndroidButton';
import LoginIcon from '@mui/icons-material/Login';

function Login() {
    const navigate= useNavigate();

  // Define state variables to hold form data
  const [facultyId, setFacultyId] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const checkAuthentication = async () => {
      const API = axios.create({
        withCredentials: true,
      });

      try {
        const res = await API.post('/auth/loggedIn');
        if (res.data.data) {
          navigate('/dashboard');
        }
      } catch (err) {
        navigate('/login');
      }
    };

    checkAuthentication();
  }, [ navigate ]);
  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    if(!facultyId || !password) {
     
      if (!facultyId) {
      document.getElementById('facultyId').focus();
      toast.error('Please Enter FacultyId');
    }
    else if (!password) {
      document.getElementById('password').focus();
      toast.error('Please Enter Password');
    }

      return;
    }
    console.log(facultyId, password);

    // Create a data object to send to the server
    const data = {
      facultyId,
      password,
    };

    try {
      // Send a POST request to the backend endpoint for authentication
      const response = await fetch('/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      // Check the response status
      // console.log(response);
      if (response.ok) {
        // Authentication successful, you can redirect or perform other actions here
    
     // Authentication successful, extract data from the response
     const responseData = await response.json();
    
     // Now you can access properties from responseData
     const name = responseData.name;
    //  const role = responseData.role;
 
        // console.log(name);
       
        // toast.success("Login Successful");
        toast(`Welcome ${name} !!!`)
        navigate('/dashboard');


      } else if(response.status === 401) {
        // Authentication failed, handle the error
        toast.error('Wrong Credentials');
        console.error('Authentication failed');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Something went wrong :( ');
    }
  };

  return (
    <Card className='loginCard mt-5'>
    <div className='log' >
      <h2>Faculty Login</h2>
      <Form  className='login' onSubmit={handleSubmit}>
        <FormGroup>
          <Label for="facultyId">Faculty ID :</Label>
          <Input
            type="text"
            id="facultyId"
            placeholder="Enter Your Faculty ID"
            value={facultyId}
            onChange={(e) => setFacultyId(e.target.value)}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label for="password">Password :</Label>
          <Input
            type="password"
            id="password"
            placeholder="Enter Your Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </FormGroup>
        {/* <a onClick={handleSubmit} href="/" className='animated-button bg-danger'>
          Login <ArrowRightIcon />
        </a> */}
        <AndroidButton color="green" text="Login" fun={handleSubmit} icon={<LoginIcon size={24} />} />
      </Form>
    </div>
    </Card>
  );
}

export default Login;
