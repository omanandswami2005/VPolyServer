import React from 'react';
import ViewAttendance from '../components/ViewAttendance'; // Adjust the path based on your project structure

function ViewAttendanceView(props) {
    // console.log(props.userData.name);
  return (
    <div>
      <h1>View Attendance</h1>
      <ViewAttendance props = {props.userData}/>
    </div>
  );
}

export default ViewAttendanceView;
