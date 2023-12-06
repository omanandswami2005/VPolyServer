import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/ManualAttendance.css';
import Switch from "react-switch";
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const today = new Date();

function FillAttendanceForToday(props) {
  const navigate = useNavigate();

  const [attendanceData, setAttendanceData] = useState([]);
  const [selectedTimeSlot, setTimeSlot] = useState('');
  const [selectedDate, setDate] = useState('');
  const [showEnrollment, setShowEnrollment] = useState(true); // Control displaying enrollment numbers
  const [totalPresent, setTotalPresent] = useState(0);
  const [totalAbsent, setTotalAbsent] = useState(0);
  const [totalStudents, setTotalStudents] = useState(0);
  const [selectedClass, setSelectedClass] = useState("");
  const [classList, setClassList] = useState([]);

  const day = today.getDate();
  const month = today.getMonth();
  const year = today.getFullYear();
  const Date = `${year}-${month + 1}-${day}`;

  useEffect(() => {
    // Fetch attendance data for today based on the selected time slot
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
          navigate("/login");
          toast.error("Session Expired :/ Please Login Again");
        });
    }


    if (selectedTimeSlot && selectedClass) {
      try {
        axios
          .post('/attendance/manualAttendanceForToday', { selectedTimeSlot ,className: selectedClass, })
          .then((response) => {
            setAttendanceData(response.data.studentAttendance || response.data);

            updateSummaryData(response.data.studentAttendance || response.data);

          }).catch((error) => {
            navigate('/login');
            toast.error('Session Expired :/ Please Login Again');
          });
      } catch (error) {
        console.error('Error fetching or creating attendance data:', error);
      }
    }
  }, [selectedTimeSlot, navigate,props.userData.name,selectedClass]);

  const handleClassChange = (e) => {
    setSelectedClass(e.target.value);
  };



  const updateSummaryData = (data) => {
    const presentCount = data.filter((student) => student.present).length;
    const absentCount = data.length - presentCount;
    setTotalPresent(presentCount);
    setTotalAbsent(absentCount);
    setTotalStudents(data.length);
  };

  const toggleAttendance = async (studentEnrollmentNo) => {
    if (attendanceData.length === 0) {
      return;
    }

    try {
      await axios.put(`/attendance/update/${studentEnrollmentNo}`, { selectedDate, selectedTimeSlot })
        .then((response) => {
          const updatedTempRecord = response.data.mainRecord;
          const updatedStudents = [...attendanceData];
          const studentIndex = updatedStudents.findIndex((student) => student.studentEnrollmentNo === updatedTempRecord.studentEnrollmentNo);

          if (studentIndex !== -1) {
            updatedStudents[studentIndex].present = updatedTempRecord.present;
            setAttendanceData(updatedStudents);
            updateSummaryData(updatedStudents);
          } else {
            console.error('Student not found in the students array.');
          } 
        }).catch((error) => {
          navigate('/login');
          toast.error('Session Expired :/ Please Login Again');
        });
    } catch (error) {
      console.error('Error toggling attendance:', error);
    }
  };

  return (
    <div className='attendance-controls'>
      <h1 className='fw-bold fs-10 text-center h1manualattendance'>Fill Attendance for Today</h1> <br />
      <select value={selectedClass} onChange={handleClassChange}>
          <option value="classDefault">Select Class</option>
          {classList.map((assignedClass) => (
            <option key={assignedClass} value={assignedClass}>
              {assignedClass}
            </option>
          ))}
        </select>
      <select value={selectedTimeSlot}
        onChange={(e) => {
          setTimeSlot(e.target.value); setDate(Date);
        }}
      >
        <option value='selectedTimeSlotDefault'>Select Time Slot</option>
        <option value='10:30->12:30'>10:30-&gt;12:30</option>
        <option value='01:00->03:00'>01:00-&gt;03:00</option>
        <option value='03:30->05:30'>03:00-&gt;05:30</option>
      </select>
      {/* <p>Selected Time Slot: {selectedTimeSlot}</p> */}
      <button onClick={() => setShowEnrollment(!showEnrollment)}>
        {showEnrollment ? 'Hide Enrollment' : 'Show Enrollment'}
      </button>
      <p>Total Present: {totalPresent}</p>
      <p>Total Absent: {totalAbsent}</p>
      <p>Total Students: {totalStudents}</p>
      <div className="manualAttendance">
        <table className='tb'>
          <thead>
            <tr className='tr'>
              <th className='th'>Roll No</th>
              {showEnrollment && <th className='th'>Enrollment No</th>}
              <th className='th'>Student Name</th>
              <th className='th'>Present</th>
            </tr>
          </thead>
          <tbody>
            {attendanceData.map((student) => (
              <tr key={student.studentRollNo}>
                <td className='td'>{student.studentRollNo}</td>
                {showEnrollment && <td className='td'>{student.studentEnrollmentNo}</td>}
                <td className='td'>{student.studentName}</td>
                <td className='td'>
                  <Switch onChange={() => {
                    toggleAttendance(student.studentEnrollmentNo);
                  }} checked={student.present} />
                  <p>{student.present ? 'Present' : 'Absent'}</p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default FillAttendanceForToday;
