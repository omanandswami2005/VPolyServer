import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

function DisplayAllStudents() {
  const [students, setStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState('Show All Students');
  const [isUpdateFormVisible, setUpdateFormVisible] = useState(false);
const [updateStudentData, setUpdateStudentData] = useState({
  name: '',
  rollNo: '',
  enrollmentNo: '',
  selectedClassId: '',
});
const [classOptions, setClassOptions] = useState([]);



  

  useEffect(() => {
    // Fetch student data from the server
    axios.get('/getstudents').then((response) => {
      setStudents(response.data);
    });
    fetchClassOptions();
  }, [setStudents]);
  const fetchClassOptions = () => {
    axios.get('/getclasses').then((response) => {
      setClassOptions(response.data);
    //   console.log(response.data);
    });
  };
  // Function to count the number of students in each class
  const countStudentsInClasses = () => {
    const classCounts = {};

    students.forEach((student) => {
      const className = student.class ? student.class.name : 'N/A';

      if (!classCounts[className]) {
        classCounts[className] = 1;
      } else {
        classCounts[className]++;
      }
    });

    return classCounts;
  };

  const classCounts = countStudentsInClasses();

  // Function to filter students by class
  const filteredStudents = selectedClass === 'Show All Students'
    ? students
    : students.filter(student => (student.class ? student.class.name : 'N/A') === selectedClass);

    const openUpdateForm = (student) => {
  setUpdateFormVisible(true);
  setUpdateStudentData({
    _id: student._id, // Set the _id property
    name: student.name,
    rollNo: student.rollNo,
    enrollmentNo: student.enrollmentNo,
    selectedClassId: student.class ? student.class._id : '', // Set the class ID property
  });
};

      const closeUpdateForm = () => {
        setUpdateFormVisible(false);
      };
      
      const handleUpdate = async () => {
        const { _id, name, rollNo, enrollmentNo, selectedClassId } = updateStudentData;
      
        const dataToUpdate = {
          name,
          rollNo,
          enrollmentNo,
          selectedClassId,
        };
      
        try {
          const response = await axios.put(`/updatestudent/${_id}`, dataToUpdate);
          console.log(`Student with ID ${_id} updated successfully.`);
          toast.success('Updated Successfully');
      
          // Extract the updated student data from the response
          const updatedStudent = response.data;
      
          // Update the class information immediately
          const updatedClassId = updatedStudent.class;
          const updatedStudents = students.map((student) => {
            if (student._id === _id) {
              return updatedStudent;
            }
            return student;
          });
      
          // Find and update the class for the updated student
          const updatedClass = classOptions.find((option) => option._id === updatedClassId);
          updatedStudent.class = updatedClass;
      
          // Update the state with the modified student data
          setStudents(updatedStudents);
      
          // Close the update form after a successful update.
          closeUpdateForm();
        } catch (error) {
          toast.error('Failed to Update');
          console.error(`Error updating student with ID ${_id}: ${error}`);
        }
      };
      
      
      
      
      
      const handleDelete = (studentId) => {
        // Implement the logic to delete a student here.
      const confirmDelete = window.confirm('Are you sure you want to delete this student?');
      if (confirmDelete) {
          
      
        axios
          .delete(`/deletestudent/${studentId}`)
          .then((response) => {
            // Handle the success case.
            console.log(`Student with ID ${studentId} deleted successfully.`);
            toast.success('Deleted Successfully');
            // fetchClassOptions();

            // You can also update the state to remove the deleted student if needed.
          })
          .catch((error) => {
            // Handle any errors.
            toast.error('Failed to Delete');
            console.error(`Error deleting student with ID ${studentId}: ${error}`);
          });
        }
      };
      
      

  return (
    <div>
      <h1>All Students</h1>
      <select
        value={selectedClass}
        onChange={(e) => setSelectedClass(e.target.value)}
      >
        <option value="Show All Students">Show All Students</option>
        {Object.keys(classCounts).map((className) => (
          <option key={className} value={className}>
            {className} ({classCounts[className]})
          </option>
        ))}
      </select>
      <table border="1">
        <thead>
          <tr>
            <th>Name</th>
            <th>Roll No</th>
            <th>Enrollment No</th>
            <th>Class</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredStudents.map((student) => (
            <tr key={student._id}>
              <td>{student.name}</td>
              <td>{student.rollNo}</td>
              <td>{student.enrollmentNo}</td>
              <td>{student.class ? student.class.name : 'N/A'}</td>
              <td>
              <button onClick={() => openUpdateForm(student)}>Update</button>
<button onClick={() => handleDelete(student._id)}>Delete</button>


              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {isUpdateFormVisible && (
      <div>
      <input
        type="text"
        placeholder="Name"
        value={updateStudentData.name}
        onChange={(e) => setUpdateStudentData({ ...updateStudentData, name: e.target.value })}
      />
      <input
        type="text"
        placeholder="Roll No"
        value={updateStudentData.rollNo}
        onChange={(e) => setUpdateStudentData({ ...updateStudentData, rollNo: e.target.value })}
      />
      <input
        type="text"
        placeholder="Enrollment No"
        value={updateStudentData.enrollmentNo}
        onChange={(e) => setUpdateStudentData({ ...updateStudentData, enrollmentNo: e.target.value })}
      />
     <select
  value={updateStudentData.selectedClassId} // Store the class ID in the state
  onChange={(e) => setUpdateStudentData({ ...updateStudentData, selectedClassId: e.target.value })}
>
  {classOptions.map((option) => (
    <option key={option._id} value={option._id}>
      {option.name} {/* Display the class name to the user */}
    </option>
  ))}
</select>

<button onClick={() => handleUpdate(updateStudentData._id)}>Save</button>

      <button onClick={closeUpdateForm}>Cancel</button>
    </div>
    )}
    </div>
  );
}

export default DisplayAllStudents;
