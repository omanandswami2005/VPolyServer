import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input } from 'reactstrap';
import { useData } from '../DataContext';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { AwesomeButton } from 'react-awesome-button';
import 'react-awesome-button/dist/styles.css';
import { ZapIcon, TrashIcon } from "@primer/octicons-react";
import BallTriangle from './Spinners/BallTriangleSpinner';

function DisplayClasses() {

  const { classOptions, faculties, fetchAll, fetchClassOptions } = useData();
  const [spinner, setSpinner] = useState(false);

  const [updateClassData, setUpdateClassData] = useState({
    id: '',
    name: '',
    assignedFaculty: [],
  });

  const [isModalOpen, setModalOpen] = useState(false);

  // useEffect( () => {
    
  // }, [classOptions, faculties]);
  console.log('Class Options:', classOptions);
  console.log('Faculties:', faculties);

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

  const gridOptions = {
    rowSelection: 'multiple',
    domLayout: 'autoHeight',
    defaultColDef: {
      sortable: true,
      resizable: true,
    },
  };


  const columnDefs = [
    { headerCheckboxSelection: true, checkboxSelection: true, width: 40, suppressSizeToFit: true },
    { headerName: 'Class Name', field: 'name', sortable: true, filter: true },
    {
      headerName: 'Assigned Faculty',
      field: 'assignedFaculty',
      cellRenderer: (params) => {
        const assignedFaculties = faculties
          .filter((faculty) => faculty.assignedClasses.includes(params.data.name))
          .map((faculty) => faculty.name);

        return (
          <select
            style={{
              width: '100%',
              boxSizing: 'border-box',
              overflowY: 'auto',
              height: '50%',
              textAlign: 'center', // Center text horizontally
              
            }}
            multiple
            disabled
          >
             {assignedFaculties.map((faculty) => (
              <option
                key={faculty}
                value={faculty}
                style={{
                  borderBottom: '1px solid #ccc', // Border between names
                  color: faculty.role === 'HOD' ? 'red' : 'inherit', // Different color for HOD role
                  fontWeight: faculty.role === 'HOD' ? 'bold' : 'normal', // Bold text for HOD role
                }}
              >
                {faculty}
              </option>
            ))}
          </select>
        );
      },
      sortable: false,
      filter: false,
      height: 500,
      wrapText: true,
      
    },
    {
      headerName: 'Actions',
      cellRenderer: (params) => (
        <div>
          <AwesomeButton type="primary" onPress={() => openUpdateForm(params.data._id)} className="mx-1 my-1">
            <ZapIcon /> Update
          </AwesomeButton>
          <AwesomeButton type="danger" onPress={() => handleDeleteClass(params.data._id)}>
            <TrashIcon /> Delete
          </AwesomeButton>
        </div>
      ),
      
      sortable: false,
      filter: false,
    },
  ];

  // const [colDefs] = useState([
  //   { field: 'mission' },
  //   { field: 'company' },
  //   { field: 'location' },
  //   { field: 'date' },
  //   { field: 'price' },
  //   { field: 'successful' },
  //   { field: 'rocket' },
  // ]);

  return (
    <div className="w-100">
      <h4 className="text-center bg-dark text-light w-50 mx-auto border border-white">List Of All Classes</h4>

      <div style={{ height: '80vh', width: '90vw', marginBottom: '20px' }} className="ag-theme-alpine">
        <AgGridReact gridOptions={gridOptions} columnDefs={columnDefs} rowData={classOptions}  tooltipShowDelay={0}
          tooltipHideDelay={2000}></AgGridReact>
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
                onChange={(e) =>
                  setUpdateClassData({
                    ...updateClassData,
                    assignedFaculty: Array.from(e.target.selectedOptions, (item) => item.value),
                  })
                }
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
          <AwesomeButton type="primary" onPress={handleUpdateClass}>
            Save
          </AwesomeButton>
          <AwesomeButton type="secondary" onPress={closeUpdateForm}>
            Cancel
          </AwesomeButton>
        </ModalFooter>
      </Modal>

      {spinner && <BallTriangle />}
    </div>
  );
}

export default DisplayClasses;
