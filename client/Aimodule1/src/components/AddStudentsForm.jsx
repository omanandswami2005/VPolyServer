import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';


function AddStudentForm() {
  const [studentData, setStudentData] = useState([
    {
      name: '',
      rollNo: '',
      enrollmentNo: '',
    },
  ]);
  const [classOptions, setClassOptions] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [classId, setClassId] = useState('');

  // Fetch class options from the server
  useEffect(() => {
    axios.get('/class').then((response) => {
      setClassOptions(response.data);
    });
  }, []);

  const handleCancelStudent = (index) => {
    const updatedStudentData = [...studentData];
    updatedStudentData.splice(index, 1);
    setStudentData(updatedStudentData);
  };

  const handleClassChange = (e) => {
    const selectedClass = e.target.value;
    setSelectedClass(selectedClass);

    // Find the classId for the selected class
    const selectedClassId = classOptions.find((option) => option.name === selectedClass)?._id;
    setClassId(selectedClassId);
  };

  const handleStudentSubmit = async (e) => {
    e.preventDefault();

    try {
      // Submit each student's data to the server with the selected class
      const responses = await Promise.all(
        studentData.map(async (student) => {
          const response = await axios.post('/student', {
            name: student.name,
            rollNo: student.rollNo,
            enrollmentNo: student.enrollmentNo,
            class: classId,
          });
          return response.data;
        })
      );

      // Handle the response as needed (e.g., show a success message).
      console.log('Students added successfully', responses);
      toast.success('Added Successfully');

      // Optionally, you can reset the form after a successful submission.
      setStudentData([{ name: '', rollNo: '', enrollmentNo: '' }]);
    } catch (error) {
      // Handle any errors that occurred during the API request (e.g., show an error message).
      console.log('Error adding students', error);
      toast.error('Already Present In DB');
    }
  };

  const handleAddStudent = () => {
    setStudentData([...studentData, { name: '', rollNo: '', enrollmentNo: '' }]);
  };

  const handleStudentChange = (index, field, value) => {

    const updatedStudentData = [...studentData];
    updatedStudentData[index][field] = value;
    setStudentData(updatedStudentData);
  };

  return (
    <div>
      <form onSubmit={handleStudentSubmit}>
        <select
          value={selectedClass}
          required
          onChange={handleClassChange}
        >
          <option value="">Select Class</option>
          {classOptions.map((option) => (
            <option key={option._id} value={option.name}>
              {option.name}
            </option>
          ))}
        </select>
        {studentData.map((student, index) => (
          <div key={index}>
            <input
              type="text"
              placeholder="Name"
              required  
              value={student.name}
              onChange={(e) => handleStudentChange(index, 'name', e.target.value)}
            />
            <input
              type="number"
              placeholder="Roll No"
              value={student.rollNo}
              onChange={(e) => handleStudentChange(index, 'rollNo', e.target.value)}
            />
            <input
              type="number"
              placeholder="Enrollment No"
              value={student.enrollmentNo}
              onChange={(e) => handleStudentChange(index, 'enrollmentNo', e.target.value)}
            />
              {studentData.length > 1 && (
              <button type="button" onClick={() => handleCancelStudent(index)}>
                Cancel
              </button>
            )}
          </div>
        ))}
        <button type="button" onClick={handleAddStudent}>
          Add More Student
        </button>
        <button type="submit">Add Students</button>
      </form>
    </div>
  );
}

export default AddStudentForm;
