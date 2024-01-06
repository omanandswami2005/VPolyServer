// In ClassManagement.js (similarly for other views)
import React from 'react';
import AddStudentsForm from '../components/AddStudentsForm';
import DisplayAllStudents from '../components/DisplayAllStudents';


function StudentManagement(props) {
  return (
    <div>
      <h2 className='mgmt-title text-center bg-info rounded text-white border w-100 mx-auto mt-2'>Student Management</h2>
      <AddStudentsForm />
      <DisplayAllStudents /> 
      {/* Display class information here */}
    </div>
  );
}

export default StudentManagement;