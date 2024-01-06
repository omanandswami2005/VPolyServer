import React, { useEffect, useState } from "react";
import Switch from "react-switch";
import { Button } from "reactstrap";
import { useNavigate } from "react-router-dom";
import "../styles/ManualAttendance.css";
import toast from "react-hot-toast";
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import axios from "axios";

function ManualAttendance(props) {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('timeSlotDefault');
  const [showEnrollmentNo, setShowEnrollmentNo] = useState(false); // New state for showing/hiding Enrollment No.
  const [selectedClass, setSelectedClass] = useState('classDefault');
  const [classList, setClassList] = useState([]);
  const [allPresent, setAllPresent] = useState(false);

  // console.log(props);
  const [filteredStudents, setFilteredStudents] = useState([]); // State to store filtered students
  const [searchTerm, setSearchTerm] = useState(""); // State to store search term
  

  const [timeSlotDropdownOpen, setTimeSlotDropdownOpen] = useState(false);
  const [classDropdownOpen, setClassDropdownOpen] = useState(false);

  // const toggleTimeSlotDropdown = () => setTimeSlotDropdownOpen(prevState => !prevState);
  // const toggleClassDropdown = () => setClassDropdownOpen(prevState => !prevState);

  const toggleTimeSlot = () => {
    setClassDropdownOpen(false); // Close the class dropdown
    setTimeSlotDropdownOpen((prevState) => !prevState);
  };
  
  const toggleClass = () => {
    setTimeSlotDropdownOpen(false); // Close the time slot dropdown
    setClassDropdownOpen((prevState) => !prevState);
  };
  

const to =()=>{}


  useEffect(() => {
    // Filter students based on the search term
    const filtered = students.filter(student =>
      student.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studentEnrollmentNo.includes(searchTerm)
    );
    setFilteredStudents(filtered);
  }, [searchTerm, students]);
 

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
    if (selectedDate && (selectedTimeSlot !== 'timeSlotDefault') && (selectedClass !== 'classDefault')) {
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
  
  const [timeSlots, setTimeSlots] = useState([]);

  useEffect(() => {
    // Fetch time slots from the server
    axios.get('/timeSlot/time-slots').then((response) => {
      setTimeSlots(response.data.timeSlots);
    }).catch((error) => {
      console.error('Error fetching time slots:', error);
    });
  }, []);

  // Handle the class selection change
  const handleClassChange = (e) => {
    setSelectedClass(e.target.value);
  };
  const setTodaysDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    setSelectedDate(`${year}-${month}-${day}`);
  }

  const toggleAllStudents = async () => {
    const updatedStudents = students.map((student) => ({
      ...student,
      present: !allPresent,
    }));
    setStudents(updatedStudents);
    setAllPresent(!allPresent);

    // Update the database for all students
    try {
      await axios.put(`/attendance/updateAll/${selectedDate}/${selectedTimeSlot}`, {
        present: !allPresent,
        studentList: updatedStudents.map((student) => student.studentEnrollmentNo),
      }).then((response) => {
        console.log(response.data);
        toast.success("Updated all students");
      })
    } catch (error) {
      console.error("Error updating all students:", error);
      toast.error("Failed to update all students");
    }
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
    < >
      <h1 className="fw-bold fs-10 text-center h1manualattendance">
        Manual Attendance
      </h1>
      <div className="attendance-controls">
        <h3>Select Date, Time-Slot And Class to Fill Attendance</h3>
        <hr />
        
          <Button color="primary" onClick={setTodaysDate}>Fill Today's Attendance</Button>
       <h5>OR</h5>

      
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="border-dark rounded-2 my-2"
          placeholder="Select Date"
        />
       
<hr />
<hr />
<div className="d-flex justify-content-center align-items-center  p-2">
<Dropdown  isOpen={timeSlotDropdownOpen} toggle={toggleTimeSlot} className="me-3" onMouseLeave={toggleTimeSlot}>
        <DropdownToggle onMouseOver={timeSlotDropdownOpen?to:toggleTimeSlot }    caret  color="light" className="border-dark rounded-2 my-2" data-attr="dropdown-toggle" onClick={toggleTimeSlot}>
          {selectedTimeSlot === 'timeSlotDefault' ? 'Select Time Slot' : selectedTimeSlot}
        </DropdownToggle>
        <DropdownMenu   >
          <DropdownItem header>Select Below &#8609;</DropdownItem>
          {timeSlots.map((timeSlot) => (
            <DropdownItem
              key={timeSlot._id}
              onClick={() => {
                setSelectedTimeSlot(`${timeSlot.startTime} -> ${timeSlot.endTime}`);
              }}
            >
              {`${timeSlot.startTime} -> ${timeSlot.endTime}`}
            </DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown>

      <Dropdown isOpen={classDropdownOpen} onMouseLeave={toggleClass}  toggle={toggleClass}>
        <DropdownToggle onMouseOver={ classDropdownOpen?to:toggleClass}  caret color="light" className="border-dark rounded-2 my-2" onClick={toggleClass}>
          {selectedClass === 'classDefault' ? 'Select Class' : selectedClass}
        </DropdownToggle>
        <DropdownMenu >
          <DropdownItem header>Select Below &#8609;	</DropdownItem>
          {classList.map((assignedClass) => (
            <DropdownItem
            
              key={assignedClass}
              onClick={() => {
                setSelectedClass(assignedClass);
              }}
            >
              {assignedClass}
            </DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown>
      </div>
      <hr />
        <Button color="primary" onClick={toggleEnrollmentNo} className="mx-2">
          Toggle Enrollment No
        </Button>
        <Button color="success" onClick={toggleAllStudents} className="mx-2"
        disabled={!students.length} // Disable if students are not fetched
                  >
          {allPresent ? "Mark All Absent" : "Mark All Present"}
        </Button>
        
      </div>
      <hr />
      <div className="search-bar-container my-3  mx-auto text-center" >
  <input
    type="text"
    placeholder="Search by Name or enrollment No."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="search-bar w-75 "
    
    
  />
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
              .slice()
              .sort((a, b) => parseInt(a.studentEnrollmentNo, 10) - parseInt(b.studentEnrollmentNo, 10))
              .map((student, index) => {
                // Check if the student matches the search term
                const matchesSearch = (
                  student.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  student.studentEnrollmentNo.includes(searchTerm)
                );

                // If there's a search term and the student doesn't match, skip rendering
                if (searchTerm && !matchesSearch) {
                  return null;
                }

                return (
                  <tr key={student.studentEnrollmentNo}>
                    <td className="td">{index + 1}</td>
                    {showEnrollmentNo && <td className="td">{student.studentEnrollmentNo}</td>}
                    <td className="td">{student.studentName}</td>
                    <td className="td">
                      <Switch
                        onChange={() => toggleAttendance(student.studentEnrollmentNo)}
                        checked={student.present}
                      />
                      <p>{student.present ? "Present" : "Absent"}</p>
                    </td>
                  </tr>
                );
              })}
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
