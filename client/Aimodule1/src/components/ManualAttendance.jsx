import React, { useEffect, useState } from "react";
import Switch from "react-switch";
import { Button } from "reactstrap";
import { useNavigate } from "react-router-dom";
import "../styles/ManualAttendance.css";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

function ManualAttendance(props) {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [showEnrollmentNo, setShowEnrollmentNo] = useState(false); // New state for showing/hiding Enrollment No.
  const [selectedClass, setSelectedClass] = useState("");
  const [classList, setClassList] = useState([]);
  // console.log(props);

  useEffect(() => {
    console.log(selectedClass);
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
          toast.error("Session Expired :/ Please Login Again");
        });
    }

    // Fetch student data from the backend when selectedDate or selectedTimeSlot change
    if (selectedDate && selectedTimeSlot && selectedClass) {
      try {
        axios
          .post(`/attendance/manualattendance`, { selectedDate, selectedTimeSlot ,className: selectedClass,})
          .then((response) => {
            console.log(response.data.studentAttendance);
            // setStudents([]);
            setStudents(
              response.data.studentAttendance || response.data
            );
          })
          .catch((error) => {
            console.error("Error fetching or creatingAttendance data:", error);
            // navigate("/login");
            toast.error("Session Expired :/ Please Login Again");
          });
      } catch (error) {
        console.error("Error fetching student data:", error);
      }
    }
  }, [selectedDate, selectedTimeSlot, navigate, props.userData.name,selectedClass]);

  // Handle the class selection change
  const handleClassChange = (e) => {
    setSelectedClass(e.target.value);
  };

  const toggleAttendance = (studentEnrollmentNo) => {
    try {
      axios
        .put(`/attendance/update/${studentEnrollmentNo}`, { selectedDate, selectedTimeSlot })
        .then((response) => {
          const updatedTempRecord = response.data.mainRecord;
          const updatedStudents = [...students];
          const studentIndex = updatedStudents.findIndex(
            (student) => student.studentEnrollmentNo === updatedTempRecord.studentEnrollmentNo
          );

          if (studentIndex !== -1) {
            updatedStudents[studentIndex].present = updatedTempRecord.present;
            setStudents(updatedStudents);
          } else {
            console.error("Student not found in the students array.");
          }
        })
        .catch((error) => {
          console.error("Error fetching or creatingAttendance data:", error);
          navigate("/login");
          toast.error("Session Expired :/ Please Login Again");
        });
    } catch (error) {
      console.error("Error toggling attendance:", error);
    }
  };

  // Calculate the total, present, and absent students
  const totalStudents = students.length;
  const presentStudents = students.filter((student) => student.present).length;
  const absentStudents = totalStudents - presentStudents;

  // Function to toggle the Enrollment No. column
  const toggleEnrollmentNo = () => {
    setShowEnrollmentNo(!showEnrollmentNo);
  };
  // console.log(classList);

  return (
    <>
      <h1 className="fw-bold fs-10 text-center h1manualattendance">
        Manual Attendance
      </h1>
      <div className="attendance-controls">
        <h3>Select Date And Time Slot OR Go to Today's Attendance </h3>
        <hr />
        <Link to="/dashboard/todayattendance">
          <Button color="primary">Fill Today's Attendance</Button>
        </Link>
        <hr />
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
        <select
          value={selectedTimeSlot}
          onChange={(e) => setSelectedTimeSlot(e.target.value)}
        >
          <option value="timeSlotDefault">Select Time Slot</option>
          <option value="10:30->12:30">10:30-&gt;12:30</option>
          <option value="01:00->03:00">01:00-&gt;03:00</option>
          <option value="03:30->05:30">03:00-&gt;05:30</option>
        </select>
        <select value={selectedClass} onChange={handleClassChange}>
          <option value="classDefault">Select Class</option>
          {classList.map((assignedClass) => (
            <option key={assignedClass} value={assignedClass}>
              {assignedClass}
            </option>
          ))}
        </select>
        <Button color="primary" onClick={toggleEnrollmentNo}>
          Toggle Enrollment No
        </Button>
      </div>
      <div className="manualAttendance">
      <table className="tb">
        <thead>
          <tr className="tr">
            <th className="th">Roll No.</th>
            {showEnrollmentNo && <th className="th">Enrollment No.</th>}
            <th className="th">Name</th>
            <th className="th">Present</th>
          </tr>
        </thead>
        <tbody>
          {students
            .slice() // Create a shallow copy of the array to avoid mutating the original array
            .sort((a, b) => parseInt(a.studentRollNo, 10) - parseInt(b.studentRollNo, 10)) // Convert to numbers and sort
            .map((student) => (
              <tr key={student.studentRollNo}>
                <td className="td">{student.studentRollNo}</td>
                {showEnrollmentNo && (
                  <td className="td">{student.studentEnrollmentNo}</td>
                )}
                <td className="td">{student.studentName}</td>
                <td className="td">
                  <Switch
                    onChange={() => toggleAttendance(student.studentEnrollmentNo)}
                    checked={student.present}
                  />
                  <p>{student.present ? "Present" : "Absent"}</p>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
      <div className="summary">
        <p>Total Students: {totalStudents}</p>
        <p>Present Students: {presentStudents}</p>
        <p>Absent Students: {absentStudents}</p>
      </div>
    </>
  );
}

export default ManualAttendance;
