import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import DNASpinner from './Spinners/DNASpinner';

const ProtectedRoute = ({ component: Component, path, props }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [data, setData] = useState(null);

  useEffect(() => {
    const checkAuthentication = async () => {
      const API = axios.create({
        withCredentials: true,
      });

      try {
        const res = await API.post('/auth/loggedIn');
        if (res.data.data) {
          setIsAuthenticated(true);
          setData(res.data.userData);
        } else {
          setIsAuthenticated(false);
        }
      } catch (err) {
        setIsAuthenticated(false);
      }
    };

    checkAuthentication();
  }, []);

  return (
    <div className='App'>
      {isAuthenticated === true ? (
        <Component userData={data} props={props} />
      ) : isAuthenticated === false ? (
        <Navigate to="/login" />
      ) : (
        <div
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'rgba(255, 255, 255, 0.3)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 1000,
              }}
            >
             <DNASpinner /> 
              <h4 className="mx-3 font-italic" >Checking authentication Status...</h4>
            </div>
      )}
    </div>
  );
};

export default ProtectedRoute;
