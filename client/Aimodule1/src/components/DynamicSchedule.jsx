import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  
  Typography,
  createTheme,
  ThemeProvider,
} from '@mui/material';
import '../styles/DynamicSchedule.css';

const theme = createTheme({
  palette: {
    mode: 'light', // Initial mode, can be 'light' or 'dark'
  },
});

function TimeSlotForm({ onTimeSlotCreate }) {
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Send a request to create a new time slot
    try {
      const response = await axios.post('/timeSlot/create-time-slot', { startTime, endTime });
      onTimeSlotCreate(response.data.newTimeSlot);
      // Optionally, clear the form fields
      setStartTime('');
      setEndTime('');
      toast.success('Time slot created successfully!');
    } catch (error) {
      console.error('Error creating time slot:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="time-slot-form">
      <FormControl fullWidth>
        {/* <InputLabel htmlFor="start-time">Start Time:</InputLabel> */}
        <input
          className="time-slot-input"
          type="time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          required
        />
      </FormControl>
      <FormControl fullWidth>
        {/* <InputLabel htmlFor="end-time">End Time:</InputLabel> */}
        <input
          className="time-slot-input"
          type="time"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          required
        />
      </FormControl>
      <Button variant="contained" color="primary" type="submit">
        Add Time Slot
      </Button>
    </form>
  );
}

function DynamicSchedule() {
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('timeSlotDefault');

  useEffect(() => {
    // Fetch time slots from the server
    axios.get('/timeSlot/time-slots').then((response) => {
      setTimeSlots(response.data.timeSlots);
    });
  }, []);

  const handleTimeSlotCreate = (newTimeSlot) => {
    // Update the list of time slots
    setTimeSlots((prevTimeSlots) => [...prevTimeSlots, newTimeSlot]);
  };

  const handleTimeSlotDelete = async () => {
    if (selectedTimeSlot === 'timeSlotDefault') {
      alert('Please select a time slot to delete.');
      return;
    }

    // Make a DELETE request to delete the selected time slot
    try {
      const confirm = window.confirm('Are you sure you want to delete this time slot?');
      if (!confirm) return;
      await axios.delete(`/timeSlot/deleteTimeSlot/${selectedTimeSlot}`);
      // Update the list of time slots by removing the deleted time slot
      setTimeSlots((prevTimeSlots) => prevTimeSlots.filter((slot) => slot._id !== selectedTimeSlot));
      // Clear the selected time slot
      setSelectedTimeSlot('');
      toast.success('Time slot deleted successfully!');
    } catch (error) {
      console.error('Error deleting time slot:', error);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <div className="schedule">
        <Typography variant="h4" align="center" gutterBottom>
          Schedule Management
        </Typography>

        <Typography variant="h6" gutterBottom>
          Select Time To Create
        </Typography>

        <TimeSlotForm onTimeSlotCreate={handleTimeSlotCreate} />

        <Typography variant="h6" gutterBottom>
          Select Time-slot To Delete
        </Typography>

        <FormControl fullWidth>
          <InputLabel htmlFor="time-slot-select" style={{ color: `${theme.palette.mode === 'light' ? 'black' : 'white'}`, background: `${theme.palette.mode === 'light' ? 'white' : 'black'}` }}>Select Time Slot</InputLabel>
          <Select
            id="time-slot-select"
            value={selectedTimeSlot}
            style={{ color: `${theme.palette.mode === 'light' ? 'black' : 'white'}`, background: `${theme.palette.mode === 'light' ? 'white' : 'black'}` }}

            onChange={(e) => setSelectedTimeSlot(e.target.value)}
          >
            <MenuItem value="timeSlotDefault">Select Time Slot</MenuItem>
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
        >
          Delete Selected Slot
        </Button>
      </div>
    </ThemeProvider>
  );
}

export default DynamicSchedule;
