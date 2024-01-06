import React, { useState, useEffect } from 'react';
import { Button, Table, Form, FormGroup, Label, Input, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import '../styles/DisplayAllStudents.css';

import axios from 'axios';
import { Spinner } from 'react-bootstrap';
import toast from 'react-hot-toast';

function DisplayAllStudents() {
  const [students, setStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState('Show All Students');
  const [isUpdateFormVisible, setUpdateFormVisible] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  const [updateStudentData, setUpdateStudentData] = useState({
    name: '',
    rollNo: '',
    enrollmentNo: '',
    selectedClassId: '',
  });
  const [classOptions, setClassOptions] = useState([]);
  const [modal, setModal] = useState(false);

  useEffect(() => {
    fetchStudentData();
    fetchClassOptions();
  }, [selectedClass]);

  const fetchStudentData = async () => {
    try {
      const response = await axios.get('/student');
      setStudents(response.data);
      
        setLoading(false); // Set loading back to false after a short delay
   
    } catch (error) {
      console.error('Error fetching student data:', error);
    }
  };

  const handleSelectAll = () => {
    const allStudents = filteredStudents.map((student) => student._id);

    if (selectedStudents.length === allStudents.length) {
      // All students are already selected, so deselect all
      setSelectedStudents([]);
    } else {
      // Not all students are selected, so select all
      setSelectedStudents(allStudents);
    }
  };

  const handleSelectStudent = (studentId) => {
    if (selectedStudents.includes(studentId)) {
      // If already selected, remove from the list
      setSelectedStudents((prevSelected) => prevSelected.filter((id) => id !== studentId));
    } else {
      // If not selected, add to the list
      setSelectedStudents((prevSelected) => [...prevSelected, studentId]);
    }
  };
  const handleDisSelectAllStudent = (studentId) => {
    const allStudents = filteredStudents.map((student) => student._id);

    if (selectedStudents.length === allStudents.length) {
      // All students are already selected, so deselect all
      setSelectedStudents([]);
    }
  };



  const handleDeleteSelected = async (studentId) => {
    

    try {
      if (typeof studentId === 'string') {
       await handleDisSelectAllStudent(studentId)
        const confirmDelete = window.confirm('Are you sure you want to delete this student?');
        if (confirmDelete) {
          setLoading(true); // Set loading to true during deletion

          await handleDelete(studentId);
          toast.success('Deleted Successfully');
        }
      } else {
        const selectedCount = selectedStudents.length;
        if (selectedCount === 0) {
          toast.error('No students selected');
        } else {
          const confirmDelete = window.confirm(`Are you sure you want to delete ${selectedCount} selected student(s)?`);
          if (confirmDelete) {
            setLoading(true); // Set loading to true during deletion

            await Promise.all(selectedStudents.map(async (studentId) => {
              await handleDelete(studentId);
            }));
            toast.success('Deleted Successfully');
            setSelectedStudents([]);
          }
        }
      }
    } catch (error) {
      console.error('Error deleting students', error);
      toast.error('Error Deleting Students');
    } finally {
      // setTimeout(() => {
      //   setLoading(false); // Set loading back to false after a short delay
      // }, 100);
    }
  };
  

  const fetchClassOptions = async () => {
    try {
      const response = await axios.get('/class');
      setClassOptions(response.data);
    } catch (error) {
      console.error('Error fetching class options:', error);
    }
  };

  const checkboxStyle = {
    transform: 'scale(1.5)',
    marginRight: '0px',
  };

  const countStudentsInClasses = () => {
    const classCounts = { 'N/A': 0 };

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

  const filteredStudents =
    selectedClass === 'Show All Students'
      ? students.slice().sort((a, b) => a.rollNo - b.rollNo)
      : students
        .filter((student) => (student.class ? student.class.name : 'N/A') === selectedClass)
        .slice()
        .sort((a, b) => a.rollNo - b.rollNo);

  const openUpdateForm = (student) => {
    setUpdateFormVisible(true);
    setUpdateStudentData({
      _id: student._id,
      name: student.name,
      rollNo: student.rollNo,
      enrollmentNo: student.enrollmentNo,
      selectedClassId: student.class ? student.class._id : '',
    });
    toggleModal();
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
      await axios.put(`/student/${_id}`, dataToUpdate);
      toast.success('Updated Successfully');
      handleRefresh();
      closeUpdateForm();
    } catch (error) {
      if (error.response && error.response.status === 500) {
        toast.error('Duplicate RollNo In Same Class Is Not Allowed!');
      } else if (error.response && error.response.status === 400 && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Failed to Update');
        console.error(`Error updating student with ID ${_id}: ${error}`);
      }
    }
  };

  const handleDelete = (studentId) => {
    axios
      .delete(`/student/${studentId}`)
      .then(() => {
        handleRefresh();
      })
      .catch((error) => {
        console.error(`Error deleting student with ID ${studentId}: ${error}`);
      });
  };

  const handleRefresh = () => {
    fetchStudentData();
    
  };

  const toggleModal = () => {
    setModal(!modal);
  };

  return (
    <div className="my-5 ">
      <hr />
      <h1 className="text-center bg-dark text-light w-75 mx-auto border border-white">All Students</h1>
      <Form>
        <FormGroup className=''>
          <h5 className='ms-5'>Select Filter :</h5>
          <Input
            className='w-50 d-inline-block mx-5 bg-white text-dark'
            type="select"
            id="selectClass"
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
          >
            <option value="Show All Students">Show All Students</option>
            {Object.keys(classCounts).map((className) => (
              <option key={className} value={className}>
                {className} ({classCounts[className]})
              </option>
            ))}
          </Input>
          <Button color="info" onClick={handleRefresh}>
            Refresh
          </Button>
          <div className="d-flex justify-content-center align-items-center my-3">
            <FormGroup check className="ms-2 bg-white d-inline-block mx-5 border border-dark rounded-3 text-center">
              <Label check>
                <Input
                  type="checkbox"
                  checked={selectedStudents.length === filteredStudents.length}
                  onChange={handleSelectAll}
                />
                {' '}
                {selectedStudents.length === filteredStudents.length ? 'Deselect All' : 'Select All'}
              </Label>
            </FormGroup>
            <Button color="danger" onClick={handleDeleteSelected}>
              Delete Selected
            </Button>
          </div>
        </FormGroup>
      </Form>
      <div className="table-responsive">
        <div className="table-container">
          <div className="table-responsive">
            <Table bordered className='text-center w-100 mx-auto'>
              <thead>
                <tr>
                  <th>Roll No</th>
                  <th>Name</th>
                  <th>Enrollment No</th>
                  <th>Class</th>
                  <th>Actions</th>
                  <th>Selected Students</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => (
                  <tr key={student._id}>
                    <td>{student.rollNo}</td>
                    <td>{student.name}</td>
                    <td>{student.enrollmentNo}</td>
                    <td>{student.class ? student.class.name : 'N/A'}</td>
                    <td>
                      <Button color="primary" onClick={() => openUpdateForm(student)} className='mx-2 mb-1'>
                        Update
                      </Button>
                      <Button color="danger" onClick={() => handleDeleteSelected(student._id)}>
                        Delete
                      </Button>
                    </td>
                    <td>
                      <Input
                        type="checkbox"
                        checked={selectedStudents.includes(student._id)}
                        onChange={() => handleSelectStudent(student._id)}
                        style={checkboxStyle}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </div>
      </div>

      <Modal isOpen={modal} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>Update Student</ModalHeader>
        <ModalBody>
          <Form>
            {/* Update form fields */}
            <FormGroup>
              <Label for="updateName">Name</Label>
              <Input
                type="text"
                id="updateName"
                placeholder="Name"
                value={updateStudentData.name}
                onChange={(e) => setUpdateStudentData({ ...updateStudentData, name: e.target.value })}
              />
            </FormGroup>
            <FormGroup>
              <Label for="updateRollNo">Roll No</Label>
              <Input
                type="text"
                id="updateRollNo"
                placeholder="Roll No"
                value={updateStudentData.rollNo}
                onChange={(e) => setUpdateStudentData({ ...updateStudentData, rollNo: e.target.value })}
              />
            </FormGroup>
            <FormGroup>
              <Label for="updateEnrollmentNo">Enrollment No</Label>
              <Input
                type="text"
                id="updateEnrollmentNo"
                placeholder="Enrollment No"
                value={updateStudentData.enrollmentNo}
                onChange={(e) =>
                  setUpdateStudentData({ ...updateStudentData, enrollmentNo: e.target.value })
                }
              />
            </FormGroup>
            <FormGroup>
              <Label for="updateClass">Select Class</Label>
              <Input
                type="select"
                id="updateClass"
                value={updateStudentData.selectedClassId}
                onChange={(e) =>
                  setUpdateStudentData({ ...updateStudentData, selectedClassId: e.target.value })
                }
              >
                <option value="">Select Class</option>
                {classOptions.map((option) => (
                  <option key={option._id} value={option._id}>
                    {option.name}
                  </option>
                ))}
              </Input>
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={() => { handleUpdate(updateStudentData._id); toggleModal(); }}>
            Save
          </Button>
          <Button color="danger" onClick={() => { closeUpdateForm(); toggleModal(); }}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>

      {loading ? (
  <div
    style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'rgba(255, 255, 255, 0.7)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    }}
  >
    <Spinner animation="border" role="status" variant="primary">
      <span className="visually-hidden">Loading...</span>
    </Spinner>
    <p className="ml-2">Just a second!</p>
  </div>
) : null}

    </div>
  );
}

export default DisplayAllStudents;
