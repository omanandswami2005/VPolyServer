import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  Button,
  FormControl,
  
  MenuItem,
  Select,
  Typography,
  createTheme,
  ThemeProvider,
  TextField,
} from '@mui/material';
import { useDarkMode } from '../DarkModeContext';

import { TimePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';


const theme = createTheme({
  palette: {
    mode: 'light', // Initial mode, can be 'light' or 'dark'
  },
});
const darkTheme = createTheme({
  palette: {
    mode: 'dark',

  },
});

function DynamicSchedule({ onTimeSlotCreate }) {
  const { isDarkMode } = useDarkMode();

  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('timeSlotDefault');

  useEffect(() => {
    // Fetch time slots from the server
    axios.get('/timeSlot/time-slots').then((response) => {
      setTimeSlots(response.data.timeSlots);
    });
  }, []);
 

  const handleTimeSlotDelete = async () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(500);
    }
    if (selectedTimeSlot === 'timeSlotDefault') {
      toast.error('Please select a time slot to delete.');
      return;
    }
    let confirmationCount = 0;
while (confirmationCount < 4) {
  const confirm = window.confirm('Are you sure you want to delete this time slot? This action cannot be undone and will permanently delete the selected time slot with all associated attendance data.');
  if (confirm) {
    if ('vibrate' in navigator) {
      navigator.vibrate(100);
    }
    confirmationCount++;
  } else {
    // break;
    return;
  }
}
    // Make a DELETE request to delete the selected time slot
    try {

      
      await axios.delete(`/timeSlot/deleteTimeSlot/${selectedTimeSlot}`);
      // Update the list of time slots by removing the deleted time slot
      setTimeSlots((prevTimeSlots) => prevTimeSlots.filter((slot) => slot._id !== selectedTimeSlot));
      // Clear the selected time slot
      setSelectedTimeSlot('timeSlotDefault');
      toast.success('Time slot deleted successfully!');
    } catch (error) {
      console.error('Error deleting time slot:', error);
      toast.error('An error occurred while deleting the time slot.');
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Validate the time inputs
    if (!startTime || !endTime) {
      toast.error('Please select both start and end times.');
      return;
    }
  
    // Validate if the end time is after the start time
    if (dayjs(endTime).isBefore(startTime)) {
      toast.error('End time must be after start time.');
      return;
    }
  
    // Send a request to create a new time slot
    try {
      const response = await axios.post('/timeSlot/create-time-slot', {
        startTime: dayjs(startTime).format('HH:mm'),
        endTime: dayjs(endTime).format('HH:mm'),
      });
      onTimeSlotCreate(response.data.newTimeSlot);
      // Optionally, clear the form fields
      setStartTime(null);
      setEndTime(null);
      toast.success('Time slot created successfully!');
    } catch (error) {
      console.error('Error creating time slot:', error);
      toast.error('An error occurred while creating the time slot.');
    }
  };
  

  return (
    <ThemeProvider theme={!isDarkMode ? darkTheme : theme } >
       <Typography variant="h5" align="center" className='mt-5 w-75 mx-auto' style={{ backgroundColor: isDarkMode ? '#f8f9fa' : '#333', border: isDarkMode ? '1px solid #000' : '1px solid #fff' }} gutterBottom>
        Schedule Management
      </Typography>

<div className='border border-primary border-3 d-flex flex-column justify-content-center align-items-center p-4  mainSchedule mx-3'>

    <form onSubmit={handleSubmit} className="items-center ">
      <FormControl fullWidth>

        <Typography variant="h6" >    
              Select Time To Create:  
        </Typography>
  
        <TimePicker
        className='mb-3'
        ampm={false}
        value={startTime}
        onChange={(value) => setStartTime(value)}
        label="Start Time"
        renderInput={(props) => <TextField {...props} fullWidth />}
        required
        style={{ marginBottom: '15px' }}
      />
      </FormControl>
      <FormControl fullWidth>
      
         <TimePicker
         className='mb-3'
        ampm={false}
        value={endTime}
        onChange={(value) => setEndTime(value)}
        label="End Time"
        renderInput={(props) => <TextField {...props} fullWidth />}
        required
        style={{ marginBottom: '15px' }}
      />

      </FormControl>
      <Button variant="contained" color="primary" type="submit" className='w-100'>
        Add Time Slot
      </Button>
    </form>
    <hr />
    <Typography variant="h6" gutterBottom className='text-danger text-center'>
          Select Time-slot To Delete
        </Typography>

        <FormControl fullWidth>
        
          <Select
           
            value={selectedTimeSlot}
            onChange={(e) => setSelectedTimeSlot(e.target.value)}
          >
            <MenuItem value="timeSlotDefault">Select Time Slot To Delete</MenuItem>
            {timeSlots.map((timeSlot) => (
              <MenuItem key={timeSlot._id} value={timeSlot._id}>
                {`${timeSlot.startTime} -> ${timeSlot.endTime}`}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          variant="contained"
          color="secondary"
          onClick={handleTimeSlotDelete}
          disabled={selectedTimeSlot === 'timeSlotDefault'}
          className='mt-3'
        >
          Delete Selected Slot
        </Button>
        </div>
    </ThemeProvider>

  );
}


export default DynamicSchedule;


