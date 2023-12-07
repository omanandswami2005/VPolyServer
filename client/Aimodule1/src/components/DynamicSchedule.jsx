import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
    } catch (error) {
      console.error('Error creating time slot:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Start Time:
        <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
      </label>
      <label>
        End Time:
        <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
      </label>
      <button type="submit">Add Time Slot</button>
    </form>
  );
}

function DynamicSchedule() {
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');

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

  return (
    <div>
      <TimeSlotForm onTimeSlotCreate={handleTimeSlotCreate} />

      <select
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
    </div>
  );
}

export default DynamicSchedule;









// import React, { useState } from 'react';

// function TimeSlotForm({ onTimeSlotCreate }) {
//   const [startTime, setStartTime] = useState('');
//   const [endTime, setEndTime] = useState('');

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     // Create a new time slot object
//     const newTimeSlot = {
//       _id: Date.now(), // You can use a unique identifier
//       startTime,
//       endTime,
//     };

//     // Pass the new time slot to the parent component
//     onTimeSlotCreate(newTimeSlot);

//     // Optionally, clear the form fields
//     setStartTime('');
//     setEndTime('');
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <label>
//         Start Time:
//         <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
//       </label>
//       <label>
//         End Time:
//         <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
//       </label>
//       <button type="submit">Add Time Slot</button>
//     </form>
//   );
// }

// function DynamicSchedule() {
//   const [timeSlots, setTimeSlots] = useState([]);
//   const [selectedTimeSlot, setSelectedTimeSlot] = useState('');

//   const handleTimeSlotCreate = (newTimeSlot) => {
//     // Update the list of time slots
//     setTimeSlots((prevTimeSlots) => [...prevTimeSlots, newTimeSlot]);
//   };

//   return (
//     <div>
//       <TimeSlotForm onTimeSlotCreate={handleTimeSlotCreate} />

//       <select
//         value={selectedTimeSlot}
//         onChange={(e) => setSelectedTimeSlot(e.target.value)}
//       >
//         <option value="timeSlotDefault">Select Time Slot</option>
//         {timeSlots.map((timeSlot) => (
//           <option key={timeSlot._id} value={timeSlot._id}>
//             {`${timeSlot.startTime} -> ${timeSlot.endTime}`}
//           </option>
//         ))}
//       </select>
//     </div>
//   );
// }

// export default DynamicSchedule;
