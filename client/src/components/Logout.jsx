import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AndroidButton from './AndroidButton';
import LogoutIcon from '@mui/icons-material/Logout';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

const Logoutbutton = () => {
  const hapticFeedback = React.useCallback(() => {
    if ('vibrate' in navigator) {
      navigator.vibrate(75);
    }
  }, []);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    hapticFeedback();
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleLogout = async () => {
    // Make a POST request to the `/logout` endpoint
    await axios.get('/auth/logout');
    navigate('/login');
  };

  return (
    <>
      <AndroidButton color='red' text='Logout' icon={<LogoutIcon size={22} />} fun={handleOpen} />
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Please Confirm Your Logout !</DialogTitle>
        <DialogContent>
          Are you sure you want to log out?
        </DialogContent>
        <DialogActions>
          <Button variant='contained' onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button variant='contained' onClick={handleLogout} color="error">
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export { Logoutbutton };
