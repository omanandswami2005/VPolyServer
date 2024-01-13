import React, { useState } from 'react';
import AddClassForm from '../components/AddClassForm';
import DisplayClasses from '../components/DisplayClasses';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { AwesomeButton } from 'react-awesome-button';
import 'react-awesome-button/dist/styles.css';
import { PlusIcon } from "@primer/octicons-react";

function ClassManagement(props) {
  const [isAddClassModalOpen, setAddClassModalOpen] = useState(false);

  const toggleAddClassModal = () => {
    setAddClassModalOpen(!isAddClassModalOpen);
  };

  return (
    <div className='mx-auto'>
      <h2 className='mgmt-title text-center bg-info rounded text-white border w-100 mx-auto mt-2'>Class Management</h2>
      <hr />

      <div className="d-flex justify-content-center align-items-center mb-3">
        <AwesomeButton
          type="primary"
          onPress={toggleAddClassModal}
        >
          <PlusIcon size={20} /> Add Class/es
        </AwesomeButton>
      </div>

      <Modal isOpen={isAddClassModalOpen} toggle={toggleAddClassModal}>
        <ModalHeader toggle={toggleAddClassModal}>Add Class</ModalHeader>
        <ModalBody>
          <AddClassForm />
        </ModalBody>
        <ModalFooter>
          {/* You can add additional buttons or actions here if needed */}
          <AwesomeButton
            type="secondary"
            onPress={toggleAddClassModal}
          >
            Done!
          </AwesomeButton>
        </ModalFooter>
      </Modal>

      <div className="border-left p-0 w-100">
        <DisplayClasses />
      </div>
    </div>
  );
}

export default ClassManagement;
