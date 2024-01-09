import React, { useState } from 'react';
import AddClassForm from '../components/AddClassForm';
import DisplayClasses from '../components/DisplayClasses';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

function ClassManagement(props) {
  const [isAddClassModalOpen, setAddClassModalOpen] = useState(false);

  const toggleAddClassModal = () => {
    setAddClassModalOpen(!isAddClassModalOpen);
  };

  return (
    <div className=' mx-auto'>
      <h2 className='mgmt-title text-center bg-info rounded text-white border w-100 mx-auto mt-2'>Class Management</h2>
      <hr />

      <div className="d-flex justify-content-center align-items-center mb-3">
        <Button color="primary" onClick={toggleAddClassModal}>
          Add Class/es
        </Button>
      </div>

      <Modal isOpen={isAddClassModalOpen} toggle={toggleAddClassModal}>
        <ModalHeader toggle={toggleAddClassModal}>Add Class</ModalHeader>
        <ModalBody>
          <AddClassForm />
        </ModalBody>
        <ModalFooter>
          {/* You can add additional buttons or actions here if needed */}
          <Button color="secondary" onClick={toggleAddClassModal}>
            Done!
          </Button>
        </ModalFooter>
      </Modal>

      <div className="border-left p-0">
        <DisplayClasses />
      </div>
    </div>
  );
}

export default ClassManagement;
