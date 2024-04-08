import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AttendanceTable1() {
  const [attendanceData, setAttendanceData] = useState([]);
  const [classId, setClassId] = useState('');
  const [timeSlotId, setTimeSlotId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    fetchAttendanceData();
  }, [classId, timeSlotId, startDate, endDate]);

  const fetchAttendanceData = async () => {
    try {
      const response = await axios.get('/attendance', {
        params: { classId, timeSlotId, startDate, endDate }
      });
      setAttendanceData(response.data);
    } catch (error) {
      console.error('Error fetching attendance data:', error);
    }
  };

  return (
    <div>
      <h2>Attendance Table</h2>
      <div>
        <label>Class ID:</label>
        <input type="text" value={classId} onChange={(e) => setClassId(e.target.value)} />
      </div>
      <div>
        <label>Time Slot ID:</label>
        <input type="text" value={timeSlotId} onChange={(e) => setTimeSlotId(e.target.value)} />
      </div>
      <div>
        <label>Start Date:</label>
        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
      </div>
      <div>
        <label>End Date:</label>
        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
      </div>
      <table>
        <thead>
          <tr>
            <th>Student Name</th>
            <th>Enrollment No</th>
            <th>Roll No</th>
            <th>Date</th>
            <th>Time Slot</th>
            <th>Present</th>
          </tr>
        </thead>
        <tbody>
          {attendanceData.map((attendance) => (
            <tr key={attendance._id}>
              <td>{attendance.studentName}</td>
              <td>{attendance.studentEnrollmentNo}</td>
              <td>{attendance.studentRollNo}</td>
              <td>{new Date(attendance.date).toLocaleDateString()}</td>
              <td>{attendance.timeSlot.startTime} - {attendance.timeSlot.endTime}</td>
              <td>{attendance.present ? 'Yes' : 'No'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AttendanceTable1;
