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
       
        <Link to="/dashboard/studentManagement">
          <Button className='add-button bg-dark'>Student Management</Button>
        </Link>
       
      </div>
      <div className='cls-mgmt'>
        <h2 className='mgmt-subtitle'>Classes Management</h2>
        
        <Link to="/dashboard/classManagement">
          <Button className='add-button bg-primary'> Class Management</Button>
        </Link>
        
      </div>
    </div>
  );
}

export default ClassStudentMgmt;
