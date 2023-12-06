import React, { useState } from 'react';
import {  Form, FormGroup, Label, Input, Button } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import '../styles/Login.css';


function Login() {
    const navigate= useNavigate();

  // Define state variables to hold form data
  const [facultyId, setFacultyId] = useState('');
  const [password, setPassword] = useState('');

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
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
    }
  };

  return (
    
    <div className='login'>
      <h2>Faculty Login</h2>
      <Form onSubmit={handleSubmit} >
        <FormGroup>
          <Label for="facultyId">Faculty ID</Label>
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
          <Label for="password">Password</Label>
          <Input
            type="password"
            id="password"
            placeholder="Enter Your Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </FormGroup>
        <Button color="primary" block type="submit">
          Login
        </Button>
      </Form>
    </div>
  );
}

export default Login;
