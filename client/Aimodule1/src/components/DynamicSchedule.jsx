import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import '../styles/DynamicSchedule.css';


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
      <label className="time-slot-label">
        Start Time:
        <input  className="time-slot-input" type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)}
        required />
      </label>
      <label className="time-slot-label">
        End Time:
        <input className="time-slot-input" type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} required />
      </label>
      <button className='time-slot-button' type="submit">Add Time Slot</button>
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
    <div className='schedule'>
      <h1 className="fw-bold fs-10 text-center h1schedule">
        Schedule Management
      </h1>
      <h3>Select Time To Create</h3>
    <TimeSlotForm onTimeSlotCreate={handleTimeSlotCreate} />

    <h3>Select Time-slot To Delete</h3>
    <select className='time-slot-select'
      value={selectedTimeSlot}
      onChange={(e) => setSelectedTimeSlot(e.target.value)}
    >
      <option value="timeSlotDefault">Select Time Slot</option>
      {timeSlots.map((timeSlot) => (
        <option key={timeSlot._id} value={timeSlot._id}>
          {`${timeSlot.startTime} -> ${timeSlot.endTime}`}
        </option>
      ))}
    </select>

    <button className='time-slot-button1'  onClick={handleTimeSlotDelete}>Delete Selected Slot</button>
    </div >
);
}

export default DynamicSchedule;