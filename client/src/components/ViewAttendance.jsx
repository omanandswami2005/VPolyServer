import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Table, Accordion, Button } from 'react-bootstrap';

import { Pie } from 'react-chartjs-2';
import 'chart.js/auto';
import toast from "react-hot-toast";
import axios from "axios";
import { useDarkMode } from '../DarkModeContext';
import {

  createTheme,
  Typography
} from '@mui/material';

import '../styles/ViewAttendance.css';


function ViewAttendance(props) {

  const { isDarkMode } = useDarkMode();
  const darkTheme = createTheme({
    palette: {
      mode: isDarkMode ? 'dark' : 'light',
    },
  })
  // console.log(props.userData.name);
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [selectedDateRange, setSelectedDateRange] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [classList, setClassList] = useState([]);
  const [studentAttendanceData, setStudentAttendanceData] = useState([]);
  const [allStudentAttendanceData, setAllStudentAttendanceData] = useState([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [timeSlots, setTimeSlots] = useState([]);
  const [enrollArray1, setEnrollArray] = useState([]);

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedFilterOption, setSelectedFilterOption] = useState("whole-month");
  const [selectedStudent, setSelectedStudent] = useState(null);


  const [chartData, setChartData] = useState(null); // State for the chart data

  const [selectedDate, setSelectedDate] = useState(null);
  // eslint-disable-next-line
  const [selectedMonth, setSelectedMonth] = useState(null);

  const handleChange = (date, student, studentIndex) => {
    setSelectedDate(date);

    const month = date.getMonth();
    setSelectedMonth(month);

    // Call the fetchAttendanceData function here
    // console.log( month, selectedTimeSlot, enrollArray1);
    fetchAttendanceDataByClass(enrollArray1, month, selectedTimeSlot);
    fetchAttendanceData(student.enrollmentNo, month, studentIndex);
  };

  // console.log(selectedDate)


  useEffect(() => {
    // console.log(selectedClass);
    if (props.userData.name) {
      axios
        .get(`/faculty/classes/${props.userData.name}`)
        .then((response) => {
          const assignedClasses = response.data;
          // Store the assigned classes in the classList state

          setClassList(assignedClasses);
        })
        .catch((error) => {
          console.error("Error fetching assigned classes:", error);
          // navigate("/login");
          toast.error("error fetching assigned classes");
        });
    }

    if (selectedClass) {
      // console.log(selectedClass);
      axios
        .get(`/student/getstudentsbyclass/${selectedClass}`)
        .then((response) => {
          const fetchedStudents = response.data;
          // console.log(fetchedStudents)
          // Store the assigned classes in the classList state
          // Sort the students array based on roll number
          const sortedStudents = fetchedStudents.sort((a, b) => {
            return parseInt(a.rollNo, 10) - parseInt(b.rollNo, 10);
          });

          const enrollArray = sortedStudents.map((student) => student.enrollmentNo);
          setEnrollArray(enrollArray);
          // console.log(enrollArray);
          setStudents(sortedStudents);
        })
        .catch((error) => {
          console.error("Error fetching assigned classes:", error);
          // navigate("/login");
          toast.error("error fetching assigned classes");
        });
    }
    // Fetch student data from the backend when selectedDate or selectedTimeSlot change
  }, [navigate, props.userData.name, selectedClass]);


  useEffect(() => {
    if (selectedClass) {
      // Fetch time slots based on the selected class
      axios
        .get(`/timeSlot/time-slots`)
        .then((response) => {
          const availableTimeSlots = response.data.timeSlots;
          // Store the time slots in state
          // You may need to modify the format based on your API response
          setTimeSlots(availableTimeSlots);
        })
        .catch((error) => {
          console.error("Error fetching time slots:", error);
          toast.error("Error fetching time slots");
        });
    }
  }, [selectedClass]);


  // Handle the class selection change
  const handleClassChange = (e) => {
    setSelectedClass(e.target.value);
  };


  // Calculate the total, present, and absent students




  const fetchAttendanceData = (studentEnrollmentNo, selectedMonth, studentIndex) => {
    // console.log("in fetching")
    // Fetch attendance data based on selected student and date
    const params = {
      selectedMonth: selectedMonth,
      selectedTimeSlot: selectedTimeSlot,
    };

    if (selectedFilterOption === "date-range") {
      params.startDate = startDate;
      params.endDate = endDate;
    }
    axios
      .get(`/attendance/${studentEnrollmentNo}`, {
        params: params,
      })
      .then((response) => {
        // Calculate pie chart data based on attendance
        const totalAttendance = response.data.length;
        const presentAttendance = response.data.filter((item) => item.present).length;
        const absentAttendance = totalAttendance - presentAttendance;

        const data1 = {
          totalAttendance,
          presentAttendance,
          absentAttendance,
        };

        // Update the studentAttendanceData state for the specific student
        const updatedStudentAttendanceData = [...studentAttendanceData];
        updatedStudentAttendanceData[studentIndex] = data1;
        setStudentAttendanceData(updatedStudentAttendanceData);
        const data = {
          labels: ['Present', 'Absent'],
          datasets: [
            {
              data: [presentAttendance, absentAttendance],
              backgroundColor: ['#36A2EB', '#FF6384'],
              hoverBackgroundColor: ['#36A2EB', '#FF6384'],
            },
          ],
        };

        // Update chartData and log it
        setChartData(data);
        // console.log(data);// Update the chart data state
      })
      .catch((error) => {
        console.error('Error fetching attendance data:', error);
        toast.error('Error fetching attendance data');
        return null;
      });
  };

  const fetchAttendanceDataByClass = async (enrollArray, selectedMonth, selectedTimeSlot) => {
    console.log("in fetching");
    console.log(enrollArray, selectedMonth, selectedTimeSlot);

    // Returning the Axios promise for further handling in the calling code
    await axios.get(`/attendance`, {
      params: {
        enrollArray: enrollArray,
        selectedMonth: selectedMonth,
        selectedTimeSlot: selectedTimeSlot,
      },
    })
      .then((response) => {
        console.log(response.data);
        // You might want to do something with the response here
        const rawData = response.data; // Return the data if needed
        // Convert the raw data into the desired format
        // Keep track of unique student IDs
        const uniqueStudentIds = new Set();

        // Convert the raw data into the desired format
        const sampleData = rawData.reduce((acc, dataItem) => {
          const studentId = dataItem.studentId;

          // Check if the student ID is already processed
          if (!uniqueStudentIds.has(studentId)) {
            uniqueStudentIds.add(studentId);

            const rollNo = dataItem.studentRollNo; // Use the actual roll number from backend
            const name = dataItem.studentName;
            const attendance = rawData
              .filter((item) => item.studentId === studentId)
              .reduce((attendanceAcc, item) => {
                const dateObject = new Date(item.date);
                const dateString = dateObject.toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'numeric',
                  day: 'numeric',
                });

                // Sort the dates in ascending order before adding to attendanceAcc
                attendanceAcc[dateString] = item.present ? 'P' : 'A';
                attendanceAcc = Object.fromEntries(
                  Object.entries(attendanceAcc).sort((a, b) => new Date(a[0]) - new Date(b[0]))
                );

                return attendanceAcc;
              }, {});


            acc.push({ rollNo, name, attendance });
          }

          return acc;
        }, []);

        console.log(sampleData);
        setAllStudentAttendanceData(sampleData);
        return sampleData;
      })
      .catch((error) => {
        console.error('Error fetching attendance data:', error);
        toast.error('Error fetching attendance data');
        throw error; // Rethrow the error to be caught by the caller
      })
      .finally(() => {
        console.log("Always executed, regardless of success or failure");
      });
  };


  const handleAccordionOpen = (student, studentIndex) => {
    // Check if the accordion is opened (isOpen === true)
    if (selectedDate) {
      fetchAttendanceData(student.enrollmentNo, selectedMonth, studentIndex);
    }
  };
  const dates = allStudentAttendanceData.length > 0 ? Object.keys(allStudentAttendanceData[0].attendance) : [];


  return (
    <>
      <div className="attendance-controls">
        <Typography variant="h5" align="center" className='mt-4 w-75 mx-auto' style={{ backgroundColor: isDarkMode ? '#f8f9fa' : '#333', color: isDarkMode ? '#000' : '#fff', border: isDarkMode ? '1px solid #000' : '1px solid #fff' }} gutterBottom>
          Attendance Management
        </Typography>

        <div className="attendance-controls">
          <h3>Select Class </h3>
          <hr />

          <select value={selectedClass} onChange={handleClassChange}>
            <option value="classDefault">Select Class</option>
            {classList.map((assignedClass) => (
              <option key={assignedClass} value={assignedClass}>
                {assignedClass}
              </option>
            ))}
          </select>
          <select
            value={selectedTimeSlot}
            onChange={(e) => setSelectedTimeSlot(e.target.value)}
          >
            <option value="timeSlotDefault">Select Time Slot</option>
            {timeSlots.map((timeSlot) => (
              <option key={timeSlot._id} value={`${timeSlot.startTime} -> ${timeSlot.endTime}`}>
                {`${timeSlot.startTime} -> ${timeSlot.endTime}`}
              </option>
            ))}
          </select><br /><br />
        </div>



      </div>



      <Accordion className="accordion">
        {students.map((student, index) => (
          <Accordion.Item key={index} eventKey={index.toString()}>
            <Accordion.Header >{student.name} &nbsp;  <br /><span>Roll No: {student.rollNo}</span></Accordion.Header>
            <Accordion.Body onEnter={() => handleAccordionOpen(student, index)}>


              <h6>Filter By Month:</h6>


              <h6>Filter By Date Range:</h6>
              <select
                value={selectedDateRange}
                onChange={(e) => setSelectedDateRange(e.target.value)}
              >
                <option value="">No Filter</option>
                <option value="10-days">Past 10 Days</option>
                <option value="15-days">Past 15 Days</option>
                <option value="1-month">Past 1 Month</option>
              </select> <br />
              <span>Name: {student.name}</span>

              <span>Enrollment No: {student.enrollmentNo}</span> <br />
              <span>Total Working Days: {studentAttendanceData[index]?.totalAttendance}</span>
              <span>Present Days: {studentAttendanceData[index]?.presentAttendance}</span>
              <span>Absent Days: {studentAttendanceData[index]?.absentAttendance}</span>



              <div className="chart-container">
                {chartData ? <Pie data={chartData} /> :
                  <p>Loading chart data...</p>
                }
              </div>

            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>




      <div style={{ overflowX: 'auto', width: '95vw', margin: 'auto', textAlign: 'center', height: '50vh' }}>
        <Table responsive='sm' striped bordered hover>
          <thead>
            <tr>
              <th>Roll No</th>
              <th>Name</th>
              {dates.map(date => (
                <th key={date}>{date}</th>
              ))}
              <th>Total Present</th>
              <th>Total Absent</th>
            </tr>
          </thead>
          <tbody>
            {allStudentAttendanceData.map((student, index) => (
              <tr key={index}>
                <td>{student.rollNo}</td>
                <td>{student.name}</td>
                {dates.map(date => (
                  <td key={date}>{student.attendance[date] || '-'}</td>
                ))}
                <td>{Object.values(student.attendance).filter(status => status === 'P').length}</td>
                <td>{Object.values(student.attendance).filter(status => status === 'A').length}</td>
              </tr>
            ))}
          </tbody>

        </Table>
      </div>
    </>
  );
}

export default ViewAttendance;
