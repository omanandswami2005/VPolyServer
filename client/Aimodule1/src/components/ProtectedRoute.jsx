import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

const ProtectedRoute = ({ component: Component,path ,props }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null); 
  const [data,setData]=useState(null);// Initially, unknown


  useEffect(() => {
    const checkAuthentication = async () => {
      const API = axios.create({
        withCredentials: true,
      });

      try {
        const res = await API.post(path); // Check authentication
        if (res.data.data) {
          setIsAuthenticated(true); // User is authenticated
          setData(res.data.userData)
        } else {
          setIsAuthenticated(false); // User is not authenticated
        }
      } catch (err) {
        setIsAuthenticated(false); // An error occurred, consider user not authenticated
      }
    };

    checkAuthentication();
  }, [path]);
// console.log(data)
  return (
    <div className='App'>
      {isAuthenticated === true ? (
        <Component userData={data} props={props} />
      ) : isAuthenticated === false ? (
        <Navigate to="/login" />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default ProtectedRoute;
