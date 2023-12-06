import React, { useEffect, useState } from "react";
// import { Button } from "reactstrap";
import { useNavigate } from "react-router-dom";

// import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import Accordion from 'react-bootstrap/Accordion';
// import Card from 'react-bootstrap/Card';
// import Form from 'react-bootstrap/Form';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../styles/ViewAttendance.css';
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto';


function ViewAttendance(props) {
  // console.log(props.props.name);
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [selectedDateRange, setSelectedDateRange] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [classList, setClassList] = useState([]);
  const [studentAttendanceData, setStudentAttendanceData] = useState([]);


  const [chartData, setChartData] = useState(null); // State for the chart data

  const [selectedDate, setSelectedDate] = useState(null);
  // eslint-disable-next-line
  const [selectedMonth, setSelectedMonth] = useState(null);

  const handleChange = (date, student,studentIndex) => {
    setSelectedDate(date);
    
    const month = date.getMonth();
    setSelectedMonth(month);
  
    // Call the fetchAttendanceData function here
    fetchAttendanceData(student.enrollmentNo, month,studentIndex);
  };
  
  console.log(selectedDate) 


  useEffect(() => {
    // console.log(selectedClass);
    if (props.props.name) {
      axios
        .get(`/faculty/classes/${props.props.name}`)
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
      console.log(selectedClass);
      axios
        .get(`/student/getstudentsbyclass/${selectedClass}`)
        .then((response) => {
          const fetchedStudents = response.data;
          console.log(fetchedStudents)
          // Store the assigned classes in the classList state
          setStudents(fetchedStudents);
        })
        .catch((error) => {
          console.error("Error fetching assigned classes:", error);
          // navigate("/login");
          toast.error("error fetching assigned classes");
        });
    }
    // Fetch student data from the backend when selectedDate or selectedTimeSlot change
  }, [navigate, props.props.name,selectedClass]);

  // Handle the class selection change
  const handleClassChange = (e) => {
    setSelectedClass(e.target.value);
  };


  // Calculate the total, present, and absent students
  



  const fetchAttendanceData = (studentEnrollmentNo, selectedMonth,studentIndex) => {
    console.log("in fetching")
    // Fetch attendance data based on selected student and date
    axios
      .get(`/attendance/${studentEnrollmentNo}`, {
        params: {
          selectedMonth: selectedMonth,
        },
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
      console.log(data);// Update the chart data state
      })
      .catch((error) => {
        console.error('Error fetching attendance data:', error);
        toast.error('Error fetching attendance data');
        return null;
      });
  };
  return (
    <>
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
        </select> <br /><br />
      </div>
     

      <Accordion defaultActiveKey="0" className="accordion">
      {students.map((student, index) => (
        <Accordion.Item key={index} eventKey={index.toString()}>
          <Accordion.Header>{student.name}</Accordion.Header>
          <Accordion.Body>
            <h6>Filter By Month:</h6>
          <DatePicker 
          selected={selectedDate}
          onChange={(date) => handleChange(date, student, index)}    
          dateFormat="MMMM yyyy"
          showMonthYearPicker
          placeholderText="Select Month Here"
/> 

<h6>Filter By Date Range:</h6>
          <select
            value={selectedDateRange}
            onChange={(e) => setSelectedDateRange(e.target.value)}
          >
            <option value="">No Filter</option>
            <option value="10-days">Past 10 Days</option>
            <option value="15-days">Past 15 Days</option>
            <option value="1-month">Past 1 Month</option>
          </select>
            <p>Name: {student.name}</p>
            <p>Roll No: {student.rollNo}</p>
            <p>Enrollment No: {student.enrollmentNo}</p> <br />
            <p>Total Working Days: {studentAttendanceData[index]?.totalAttendance}</p>
      <p>Present Days: {studentAttendanceData[index]?.presentAttendance}</p>
      <p>Absent Days: {studentAttendanceData[index]?.absentAttendance}</p>

   

            <div className="chart-container">
  {chartData ? <Pie data={chartData} /> : null}
</div>

            {/* Add other student information as needed */}
          </Accordion.Body>
        </Accordion.Item>
      ))}
    </Accordion>
    </>
  );
}

export default ViewAttendance;
