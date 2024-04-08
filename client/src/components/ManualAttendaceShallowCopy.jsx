import React, { useEffect, useState, useCallback } from "react";
import Switch from 'react-switch';

import { useNavigate } from "react-router-dom";
// import "../styles/ManualAttendance.css";
import toast from "react-hot-toast";
import axios from "axios";
import { useDarkMode } from '../DarkModeContext';
import AttendanceTable from './AttendanceTable'; // Path to your AttendanceTable component
import DNASpinner from "./Spinners/DNASpinner";

import {
  ThemeProvider,
  createTheme,
  Select, MenuItem,
  Card, CardContent, Typography, Grid, Dialog, DialogTitle, DialogContent, DialogActions,

} from '@mui/material';
import 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import dayjs from 'dayjs';
import { DatePicker } from "@mui/x-date-pickers";

import { AwesomeButton } from "react-awesome-button";


dayjs.extend(utc);
dayjs.extend(require('dayjs/plugin/timezone'));



function ManualAttendance(props) {
  const { isDarkMode } = useDarkMode();
  // dayjs.tz.setDefault('Asia/Kolkata');
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('To Be Selected');
  // const [showEnrollmentNo, setShowEnrollmentNo] = useState(false); // New state for showing/hiding Enrollment No.
  const [selectedClass, setSelectedClass] = useState('To Be Selected');
  const [classList, setClassList] = useState([]);
  const [allPresent, setAllPresent] = useState("false");
  const [isFiltersModalOpen, setFiltersModalOpen] = useState(false);
  const [timeSlots, setTimeSlots,] = useState([]);
  const [spinner,setSpinner]=useState(false)
  // const [searchTerm, setSearchTerm] = useState(""); // State to store search term


  const [timeSlotDropdownOpen, setTimeSlotDropdownOpen] = useState(false);
  const [classDropdownOpen, setClassDropdownOpen] = useState(false);
  const darkTheme = createTheme({
    palette: {
      mode: 'dark',

    },
  });


  // Define a light theme
  const lightTheme = createTheme({
    palette: {
      mode: 'light',
    },
  });


  const hapticFeedback = useCallback(() => {
    if ('vibrate' in navigator) {
      navigator.vibrate(75);
    }
  }, []);

  const toggleTimeSlot = useCallback(() => {
    setClassDropdownOpen(false); // Close the class dropdown
    setTimeSlotDropdownOpen((prevState) => !prevState);
    hapticFeedback(); // Call haptic feedback when toggling time slot
  }, [setClassDropdownOpen, setTimeSlotDropdownOpen, hapticFeedback]);

  const toggleClass = useCallback(() => {
    setTimeSlotDropdownOpen(false); // Close the time slot dropdown
    setClassDropdownOpen((prevState) => !prevState);
    hapticFeedback(); // Call haptic feedback when toggling class
  }, [setTimeSlotDropdownOpen, setClassDropdownOpen, hapticFeedback]);






  useEffect(() => {
    console.log(selectedClass);
    if (props.userData.name) {
      setSpinner(true)
      axios
        .get(`/faculty/classes/${props.userData.name}`)
        .then((response) => {
          const assignedClasses = response.data;
          // Store the assigned classes in the classList state
          setClassList(assignedClasses);
          setSpinner(false)

        })
        .catch((error) => {
          console.error("Error fetching assigned classes:", error);
          // navigate("/login");
          toast.error("Session Expired :/ Please Login Again");
        });
    }

    // Fetch student data from the backend when selectedDate or selectedTimeSlot change

  }, [navigate, props.userData.name, selectedClass]);


  const getAttendance = useCallback(async () => {
    if (selectedDate && (selectedTimeSlot !== 'To Be Selected') && (selectedClass !== 'To Be Selected')) {
      try {
        hapticFeedback();
        console.log(selectedDate);
        setSpinner(true)
       
        axios
          .post(`/attendance/manualattendance`, { selectedDate, selectedTimeSlot, className: selectedClass, })
          .then((response) => {
            if (response.data.studentAttendance.length < 1) {
              toast.error("No Students Found, Please Add Students in Selected Class");
              setStudents([]);
            } else {
              setStudents(response.data.studentAttendance);
              console.log(response.data.studentAttendance.length);
            }
          })
          .catch((error) => {
            console.error("Error fetching or creatingAttendance data:", error);
            toast.error("Session Expired :/ Please Login Again");
          });
      } catch (error) {
        console.error("Error fetching student data:", error);
      }finally{
        setSpinner(false)
      }
    }
  }, [selectedDate, selectedTimeSlot, selectedClass, hapticFeedback]); // Dependencies added here



  const toggleFiltersModal = useCallback(() => {
    setFiltersModalOpen((prev) => !prev);
  }, [setFiltersModalOpen]);

  useEffect(() => {
    // Fetch time slots from the server
    setSpinner(true)

    axios.get('/timeSlot/time-slots')
    .then((response) => {
      setTimeSlots(response.data.timeSlots);
      setSpinner(false)

    }).catch((error) => {
      console.error('Error fetching time slots:', error);
    });

    // Check if all students are present
    const allStudentsPresent = students.length > 0 && students.every(student => student.present === "true");
    setAllPresent(allStudentsPresent === true ? "true" : "false");

  }, [students]);


  const toggleAllStudents = useCallback(async () => {
    hapticFeedback();
    const updatedStudents = students.map((student) => ({
      ...student,
      present: allPresent === "true" ? "false" : "true",
    }));
    setStudents(updatedStudents);
    setAllPresent(allPresent === "true" ? "false" : "true");

    // Update the database for all students
    try {
      setSpinner(true)

      await axios.put(`/attendance/updateAll/${selectedDate}/${selectedTimeSlot}`, {
        present: allPresent === "true" ? false : true,
        className: selectedClass
      });
      setSpinner(false)

    } catch (error) {

      console.error("Error updating all students:", error);
      toast.error("Failed to update all students");
    }
  }, [students, allPresent, selectedDate, selectedTimeSlot, selectedClass, setStudents, hapticFeedback,]);

  const toggleAttendance = useCallback(async (studentEnrollmentNo) => {
    try {
      hapticFeedback();

      // Find the student in the students array
      const studentIndex = students.findIndex(
        (student) => student.enrollmentNo === studentEnrollmentNo
      );

      // If the student is found, update the attendance status
      if (studentIndex !== -1) {
        const updatedStudents = [...students];
        const updatedStudent = { ...updatedStudents[studentIndex] };


        updatedStudent.present === "true" ? updatedStudent.present = "false" : updatedStudent.present = "true";
        // Update the state with the modified student
        updatedStudents[studentIndex] = updatedStudent;
        setStudents(updatedStudents);

        // Update the database for the specific student
        setSpinner(true)

        await axios.put(`/attendance/update/${studentEnrollmentNo}`, {
          selectedDate,
          selectedTimeSlot,
          present: updatedStudent.present === "true" ? true : false,
          className: selectedClass,
        });


      } else {
        console.error("Student not found in the students array.");
      }
    } catch (error) {
      console.error("Error toggling attendance:", error);
    }finally{
      setSpinner(false)

    }
  }, [students, selectedDate, selectedTimeSlot, selectedClass, setStudents, hapticFeedback]);


  // Calculate the total, present, and absent students
  const totalStudents = students.length;
  const presentStudents = students.filter((student) => student.present === "true").length;
  const absentStudents = totalStudents - presentStudents;


  const columns = React.useMemo(
    () => [
      {
        id: 'rollNo',
        accessorKey: 'rollNo',
        header: 'Roll No.',
      },
      {
        accessorKey: 'present',
        header: `Attendance`,
        Cell: ({ cell, toggleAttendance }) => {
          return (
            <div>
              <Switch
                checked={cell.getValue() === 'true' ? true : false}
                onChange={() => toggleAttendance(cell.row.original.enrollmentNo)}
                offColor="#f44336"
                onColor="#4caf50"
                uncheckedHandleIcon={
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "100%",
                      color: "red",
                      fontStyle: "italic",
                      fontSize: 20,
                      fontWeight: "bolder",

                    }}
                  >
                    A
                  </div>
                }
                checkedHandleIcon={
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "100%",
                      color: "green",
                      fontSize: 20,
                      fontStyle: "cursive",
                      fontWeight: "bolder",
                    }}
                  >
                    P
                  </div>
                }
              /> <br />
              {cell.getValue() === 'true' ? 'Present' : 'Absent'}
            </div>
          );
        }
      },
      {
        accessorKey: 'name',
        header: 'Name',
      },
      {
        accessorKey: 'enrollmentNo',
        header: 'Enrollment No.',
      },
    ],
    []
  );


  const filterModal = React.useMemo(() => (
    <Dialog open={isFiltersModalOpen} onClose={toggleFiltersModal} style={{ width: '100', margin: '0' }} className="p-0">
      <DialogTitle>
        <Typography variant="h5" component="div" className={`text-center mb-4`}>
          Select Date, Time-Slot And Class to Fill Attendance
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Card className={`border-0 shadow add-class-card`} style={{ maxHeight: '60vh', overflowY: 'auto' }}>
          <CardContent>
            <Grid container spacing={2} className="justify-content-center align-items-center">
              <Grid item md={12} className="d-flex justify-content-center align-items-center" >

                <DatePicker
                  label="Select Date"
                  value={selectedDate}
                  onChange={(date) => {
                    setSelectedDate(date);
                    hapticFeedback();
                  }}
                  format="DD-MM-YYYY"
                  timezone="system"
                  disableFuture={props.userData.role === "teacher" ? true : false}
                />


              </Grid>

              <Grid item md={5}>

                <Select
                  open={timeSlotDropdownOpen}
                  onClose={toggleTimeSlot}
                  onOpen={toggleTimeSlot}
                  value={selectedTimeSlot}
                  displayEmpty


                >
                  <MenuItem value="To Be Selected" disabled>
                    Select Time Slot
                  </MenuItem>

                  {timeSlots.map((timeSlot) => (
                    <MenuItem key={timeSlot._id} value={`${timeSlot.startTime} -> ${timeSlot.endTime}`} onClick={() => {
                      hapticFeedback();
                      setSelectedTimeSlot(`${timeSlot.startTime} -> ${timeSlot.endTime}`);
                    }}>
                      {`${timeSlot.startTime} -> ${timeSlot.endTime}`}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>
              <Grid item md={5}>
                <Select
                  open={classDropdownOpen}
                  onClose={toggleClass}
                  onOpen={toggleClass}
                  value={selectedClass}
                  displayEmpty

                >
                  <MenuItem value="To Be Selected" disabled>
                    Select Class
                  </MenuItem>
                  {classList.map((assignedClass) => (
                    <MenuItem key={assignedClass} value={assignedClass} onClick={() => {
                      hapticFeedback();
                      setSelectedClass(assignedClass);
                    }}>
                      {assignedClass}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>

            </Grid>

          </CardContent>
        </Card>
      </DialogContent>
      <DialogActions>
        <AwesomeButton type="primary" onReleased={() => { toggleFiltersModal(); getAttendance() }} disabled={selectedTimeSlot === 'To Be Selected' || selectedClass === 'To Be Selected'}>
          Get/Generate Attendance
        </AwesomeButton>
        <AwesomeButton type="secondary" onReleased={toggleFiltersModal}>
          Cancle
        </AwesomeButton>
      </DialogActions>
    </Dialog>
  ), [toggleFiltersModal, selectedDate, selectedTimeSlot, selectedClass, getAttendance, timeSlotDropdownOpen, classDropdownOpen, toggleTimeSlot, toggleClass, timeSlots, classList, hapticFeedback, isFiltersModalOpen, props.userData.role]);


  return (
    < div className='mt-4' >
      <ThemeProvider theme={isDarkMode ? lightTheme : darkTheme}>
        <Typography variant="h5" align="center" className='mt-5 w-75 mx-auto' style={{ backgroundColor: isDarkMode ? '#f8f9fa' : '#333', color: isDarkMode ? '#000' : '#fff', border: isDarkMode ? '1px solid #000' : '1px solid #fff' }} gutterBottom>
          Manual Attendance
        </Typography>

        {filterModal}

        <div className="w-100  border-primary d-flex align-items-center border" style={{ justifyContent: 'space-evenly' }}> <span className="text-center" > &bull;Date:<br /> {selectedDate.toString().slice(0, 16) ? selectedDate.toString().slice(0, 16) : "To Be Selected"} </span>

          <span className="border border-primary rounded-2 p-2 text-center">  &bull;Time:<br /> {selectedTimeSlot} </span> <span className="text-center p-1"> &bull;Class: <br /> {selectedClass}</span></div>

      </ThemeProvider>





      <div className="d-flex align-items-center justify-content-center my-2 flex-wrap flex-direction-column">
        <AwesomeButton type="danger" onReleased={toggleFiltersModal}>
          Modify Filters
        </AwesomeButton>
        <AwesomeButton type="primary" onReleased={toggleAllStudents} className="mx-2"
          disabled={!students.length}>
          {allPresent === "true" ? "Mark All Absent" : "Mark All Present"}
        </AwesomeButton>
      </div>
      <div className="text-center mx-auto my-2  w-100">

        &bull; Tatal Students: {totalStudents} |  &nbsp;
        &bull;Present Students: {presentStudents} | &nbsp;
        &bull;Absent Students: {absentStudents}

      </div>

      <AttendanceTable columns={columns} data={students} toggleAttendance={toggleAttendance} />
{spinner && <DNASpinner />}
    </ div>
  );
}

export default ManualAttendance;