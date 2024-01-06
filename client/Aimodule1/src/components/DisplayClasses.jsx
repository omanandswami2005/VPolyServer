import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Button, Input, ListGroup, ListGroupItem, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

function DisplayClasses() {
  const [classOptions, setClassOptions] = useState([]);
  const [updateClassData, setUpdateClassData] = useState({
    id: '',
    name: '',
  });
  const [isModalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchClassOptions();
  }, []);

  const fetchClassOptions = () => {
    axios.get('/class').then((response) => {
      setClassOptions(response.data);
    });
  };

  const openUpdateForm = (classId, className) => {
    setUpdateClassData({ id: classId, name: className });
    setModalOpen(true);
  };

  const closeUpdateForm = () => {
    setModalOpen(false);
  };

  const handleUpdateClass = () => {
    const { id, name } = updateClassData;
    axios
      .put(`/class/${id}`, { name })
      .then((response) => {
        console.log(`Class with ID ${id} updated successfully.`);
        toast.success('Updated Successfully');
        closeUpdateForm();
        fetchClassOptions();
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
          console.log(`Class with ID ${classId} deleted successfully.`);
          toast.success('Deleted Successfully');
          fetchClassOptions();
        })
        .catch((error) => {
          console.error(`Error deleting class with ID ${classId}: ${error}`);
        });
    }
  };

  return (
    <div>
      <hr />
 <h2 className="text-center bg-dark text-light w-75 mx-auto border border-white">List Of All Classes</h2>      <Button color="primary" onClick={fetchClassOptions} className="mb-3 w-25 mx-auto">
        Refresh
      </Button>
      <ListGroup>
        {classOptions.map((option) => (
          <ListGroupItem key={option._id} className="d-flex justify-content-between align-items-center">
            {option.name}
            <div>
              <Button color="info" onClick={() => openUpdateForm(option._id, option.name)} className="mx-2">
                Update
              </Button>
              <Button color="danger" onClick={() => handleDeleteClass(option._id)}>
                Delete
              </Button>
            </div>
          </ListGroupItem>
        ))}
      </ListGroup>

      <Modal isOpen={isModalOpen} toggle={closeUpdateForm}>
        <ModalHeader toggle={closeUpdateForm}>Update Class</ModalHeader>
        <ModalBody>
          <Input
            type="text"
            value={updateClassData.name}
            onChange={(e) => setUpdateClassData({ ...updateClassData, name: e.target.value })}
          />
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
