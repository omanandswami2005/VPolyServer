import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'reactstrap';
import '../styles/ClassStudentMgmt.css';

function ClassStudentMgmt() {
  return (
    <div className='mgmt-main'>
      <h1 className='mgmt-title'>Manage Class & Students</h1>
      <div className='std-mgmt'>
        <h2 className='mgmt-subtitle'>Students Management</h2>
       
        <Link to="/dashboard/addstudent">
          <Button className='add-button bg-dark'>Add Students</Button>
        </Link>
        <Link to="/dashboard/showstudents">
          <Button className='view-button bg-success'>View & Update Students</Button>
        </Link>
      </div>
      <div className='cls-mgmt'>
        <h2 className='mgmt-subtitle'>Classes Management</h2>
        
        <Link to="/dashboard/addclass">
          <Button className='add-button bg-primary'>Add Class</Button>
        </Link>
        <Link to="/dashboard/showclasses">
          <Button className='view-button bg-danger'>View & Update Classes</Button>
        </Link>
      </div>
    </div>
  );
}

export default ClassStudentMgmt;
