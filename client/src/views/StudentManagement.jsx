
import DisplayAllStudents from '../components/DisplayAllStudents';


function StudentManagement(props) {
  return (
    <div className='mt-5'>
    
      {console.log(props.userData.name)}      <DisplayAllStudents />
    </div>
  );
}

export default StudentManagement;