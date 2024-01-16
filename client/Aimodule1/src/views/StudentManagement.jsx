
import DisplayAllStudents from '../components/DisplayAllStudents';


function StudentManagement(props) {
  return (
    <div>
      <h2 className='mgmt-title text-center bg-info rounded text-white border w-100 mx-auto mt-2'>Student Management</h2>
{      console.log(props.userData.name)}      <DisplayAllStudents /> 
    </div>
  );
}

export default StudentManagement;