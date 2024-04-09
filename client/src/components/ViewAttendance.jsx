import React, { useState, useEffect } from 'react';
import { Typography, Button, Select, MenuItem, Drawer, List, ListItem, ListItemText } from '@mui/material';
import axios from 'axios';

import { DateRangePicker } from 'react-date-range';
import toast from 'react-hot-toast';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import ViewAttendanceTable from './ViewAttendanceTable';

import { useDarkMode } from '../DarkModeContext';


const ViewAttendanceDashboard = () => {
  const [totalAttendance, setTotalAttendance] = useState(null);

  
  const {isDarkMode} = useDarkMode();

  const [classes, setClasses] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);

  const [selectedClass, setSelectedClass] = useState('Select Class');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('All Time Slots');

  const [state, setState] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection'
    }
  ]);

  const [mobileOpen, setMobileOpen] = React.useState(false);
  useEffect(() => {
    // Fetch classes from your backend API
    fetchClasses();
    fetchTimeSlots();
    // fetchData();

  }, []);

  const fetchData= async ()=>
  {
if (selectedClass ==="Select Class" ){
  console.log("Please select class, start date, and end date.");
  toast.error("Please select class, start date, and end date.");
  return;
}

setMobileOpen(!mobileOpen);


axios.post('/viewattendance', {
  selectedClass,
  dateRange: state[0],
  timeSlot: selectedTimeSlot
}).then((response) => {
  const data = response.data;
  console.log(data)
  setTotalAttendance(data);
  
})



  }

  const fetchClasses = async () => {
    try {
      // Make an API call to fetch classes
      const response = await fetch('/class/');
      const data = await response.json();
      console.log(data)
    //   console.log(data.)
      setClasses(data); // Assuming data is returned as { classes: [...] }
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  const handleClassChange = (event) => {
    const selectedClass = event.target.value;
    setSelectedClass(selectedClass);
  };

  const fetchTimeSlots = async () => {
    try {
      // Make an API call to fetch time slots
      const response = await fetch('/timeSlot/time-slots');
      const data = await response.json();
      setTimeSlots(data.timeSlots); // Assuming data is returned as { timeSlots: [...] }
    } catch (error) {
      console.error('Error fetching time slots:', error);
    }
  };

  const handleTimeSlotChange = (event) => {
    const selectedTimeSlot = event.target.value;
    setSelectedTimeSlot(selectedTimeSlot);
  };




  console.log(state)

const handleDrawerToggle = () => {
  setMobileOpen(!mobileOpen);
}

  const drawer = (
    <Drawer variant="temporary" open={mobileOpen} onClose={handleDrawerToggle} anchor="right" >
      <List>
        <ListItem>
          <ListItemText primary="Filter by Class :" />
          <Select
      value={selectedClass}
      onChange={handleClassChange}
    > 
      <MenuItem value="Select Class" disabled>Select Class</MenuItem>
      {classes.map((classItem,index) => (
        <MenuItem key={index} value={classItem._id}>
          {classItem.name}
        </MenuItem>
      ))}
    </Select>
        </ListItem>
        <ListItem>
      
    <DateRangePicker
    editableDateInputs={true}
    onChange={(items) => {  
      setState([items.selection]);
    }}
    style={{backgroundColor:"black"}}
    months={2}
    direction="horizontal"
    // maxDate={new Date()}
    scroll={{enabled: true}}
    moveRangeOnFirstSelection={false}
    ranges={state}
  /></ListItem>
        <ListItem sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <ListItemText primary="Filter by Time Slot :" />
         <Select
      value={selectedTimeSlot}
      onChange={handleTimeSlotChange}
    >
      <MenuItem value="All Time Slots">All Time Slots</MenuItem>

      {timeSlots.map((timeSlot) => (
        <MenuItem key={timeSlot._id} value={timeSlot.startTime + ' -> ' + timeSlot.endTime}>
          {timeSlot.startTime} - {timeSlot.endTime}
        </MenuItem>
      ))}
    </Select>
        </ListItem>
        <ListItem sx={{ display: 'flex', justifyContent: 'center' }}>
          <Button variant="contained" onClick={fetchData}>Apply</Button>
          </ListItem>
      </List>
    </Drawer>
  );

  return (
    <div>
       <Typography variant="h5" align="center" className='w-100 mx-auto' style={{ backgroundColor: isDarkMode ? '#f8f9fa' : '#333', color: isDarkMode ? '#000' : '#fff',border: isDarkMode ? '1px solid #000' : '1px solid #fff' ,marginTop: "70px",padding: "5px"}} gutterBottom>
        View Attendance !
      </Typography>

        <Button variant="outlined"  sx={{margin: "10px",}} className='w-100 mx-auto' onClick={handleDrawerToggle}>Change Filter</Button>
        {drawer}

{totalAttendance &&
(
        totalAttendance.attendanceData[0]?.attendance.length > 0 ? (
          <ViewAttendanceTable attendanceData={totalAttendance.attendanceData} Class={classes.find(classItem => classItem._id === selectedClass)?.name || ''} timeSlot={selectedTimeSlot} />
        ):<h3> <br />No Attendance Data Found !!!</h3>
)}
    </div>
  );
};

export default ViewAttendanceDashboard;
