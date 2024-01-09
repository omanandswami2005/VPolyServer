// DisplayClasses.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Button, Input, Modal, ModalHeader, ModalBody, ModalFooter, Table, Form, FormGroup, Label } from 'reactstrap';
import { useData } from '../DataContext';



function DisplayClasses() {
  
  const { classOptions, faculties, fetchAll, fetchClassOptions } = useData();

  const [updateClassData, setUpdateClassData] = useState({
    id: '',
    name: '',
    assignedFaculty: [],
  });
  // const [faculties, setFaculties] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // const fetchAll = () => {
  //   fetchClassOptions();
  //   fetchFaculties();
  // };

  // const fetchClassOptions = () => {
  //   axios.get('/class').then((response) => {
  //     setClassOptions(response.data);
  //   });
  // };

  // const fetchFaculties = () => {
  //   axios.get('/faculty').then((response) => {
  //     setFaculties(response.data);
  //   });
  // };

  const openUpdateForm = (classId) => {
    const selectedClass = classOptions.find((option) => option._id === classId);

    setUpdateClassData({
      id: selectedClass._id,
      name: selectedClass.name,
      assignedFaculty: selectedClass.assignedFaculty || [],
    });

    setModalOpen(true);
  };

  const closeUpdateForm = () => {
    setModalOpen(false);
  };

  const handleUpdateClass = () => {
    const { id, name, assignedFaculty } = updateClassData;

    axios
      .put(`/class/${id}`, { name, assignedFaculty })
      .then((response) => {
        toast.success('Updated Successfully');
        closeUpdateForm();
       fetchAll();
      })
      .catch((error) => {
        toast.error('Failed to Update');
        console.error(`Error updating class with ID ${id}: ${error}`);
      });
  };

  const handleDeleteClass = (classId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this class?');
    if (confirmDelete) {
      axios
        .delete(`/class/${classId}`)
        .then(() => {
          toast.success('Deleted Successfully');
          fetchClassOptions();
        })
        .catch((error) => {
          console.error(`Error deleting class with ID ${classId}: ${error}`);
        });
    }
  };

  return (
    <div className="w-100">
      <h4 className="text-center bg-dark text-light w-50 mx-auto border border-white">List Of All Classes</h4>
    
      <div style={{ maxHeight: '80vh', overflowY: 'auto' }} className='w-100'>
      <Table bordered responsive hover className="align-middle text-center">
  <thead className='position-sticky top-0 z-1'>
    <tr>
    
      <th className="bg-dark text-light border-secondary border-2">Class Name</th>
      <th className="bg-dark text-light border-secondary border-2">Assigned To</th>
      <th className="bg-dark text-light border-secondary border-2">Actions</th>
    </tr>
  </thead>
       
  <tbody style={{ maxHeight: '80vh', overflowY: 'auto' }} className='w-100' >
    {classOptions.map((option, index) => (
      <tr key={option._id}>
        <td className="border-secondary border-2">({index + 1}) {option.name}</td>
        <td className="border-secondary border-2">
         
        <td className="border-secondary border-2">
  <td className="border-secondary border-1">
  {faculties
    .filter((faculty) => faculty.assignedClasses.includes(option.name))
    .map((faculty, facultyIndex) => (
      <span key={facultyIndex} style={{ fontWeight: faculty.role === 'HOD' ? 'bold' : 'normal', color: faculty.role === 'HOD' ? 'red' : 'inherit' }}>
        [ {faculty.name}{faculty.role === 'HOD' ? ' (HOD)' : ''} ]
      </span>
    ))
    .reduce((prev, curr) => prev.length === 0 ? [curr] : [...prev, ', ', curr], []) || "Not Assigned"}
</td>

</td>

        </td>
        <td className="border-secondary border-2">
          <Button color="info" onClick={() => openUpdateForm(option._id)} className="mx-1 my-1">
            Update
          </Button>
          <Button color="danger" onClick={() => handleDeleteClass(option._id)}>
            Delete
          </Button>
        </td>
      </tr>
    ))}
  </tbody>
</Table>

      </div>
      <Modal isOpen={isModalOpen} toggle={closeUpdateForm}>
        <ModalHeader toggle={closeUpdateForm}>Update Class</ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label for="className">Class Name</Label>
              <Input
                type="text"
                id="className"
                value={updateClassData.name}
                onChange={(e) => setUpdateClassData({ ...updateClassData, name: e.target.value })}
              />
            </FormGroup>
            <FormGroup>
              <Label for="assignedFaculty">Assigned Faculty</Label>
              <Input
                type="select"
                id="assignedFaculty"
                multiple
                value={updateClassData.assignedFaculty}
                onChange={(e) => setUpdateClassData({ ...updateClassData, assignedFaculty: Array.from(e.target.selectedOptions, (item) => item.value) })}
              >
                {faculties.map((faculty) => (
                  <option key={faculty._id} value={faculty.name}>
                    {faculty.name}
                  </option>
                ))}
              </Input>
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleUpdateClass}>
            Save
          </Button>
          <Button color="secondary" onClick={closeUpdateForm}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default DisplayClasses;
