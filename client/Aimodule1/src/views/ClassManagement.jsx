// In ClassManagement.js (similarly for other views)
import React from 'react';
import AddClassForm from '../components/AddClassForm';
import DisplayClasses from '../components/DisplayClasses';

function ClassManagement(props) {
  // console.log(props)
  return (
    <div>
      
      <h2 className='mgmt-title text-center bg-info rounded text-white border w-100 mx-auto mt-2'>Class Management</h2>
 <AddClassForm /> 
 
  <DisplayClasses />

     
      {/* Display class information here */}
    </div>
  );
}

export default ClassManagement;