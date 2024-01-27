import React, { useState, useMemo, useCallback } from 'react';
import axios from 'axios';
import AddClassForm from '../components/AddClassForm';

import toast from 'react-hot-toast';
import { Box, Typography, Table, ThemeProvider, createTheme,Tooltip,
   } from '@mui/material';
import { useDarkMode } from '../DarkModeContext';
import { AwesomeButton } from 'react-awesome-button';
import { PlusIcon } from "@primer/octicons-react";
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { Modal, Form, FormGroup, Label, Input, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { useData } from '../DataContext';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const DisplayClasses = () => {
  const { classOptions, faculties, fetchAll } = useData();
  const { isDarkMode } = useDarkMode();

  const [isAddClassModalOpen, setAddClassModalOpen] = useState(false);
  const toggleAddClassModal = useCallback(() => setAddClassModalOpen(prev => !prev), []);

  const combinedData = useMemo(() => {
    return classOptions.map(classOption => ({
      ...classOption,
      assignedFaculty: faculties
        .filter(faculty => faculty.assignedClasses.includes(classOption.name))
        .map(faculty => ({
          name: faculty.name,
          role: faculty.role === 'HOD' ? 'HOD' : 'Faculty',
        })),
    }));
  }, [classOptions, faculties]);

  const [updateClassData, setUpdateClassData] = useState({
    id: '',
    name: '',
    assignedFaculty: [],
  });

  const [isModalOpen, setModalOpen] = useState(false);

  const openUpdateForm = useCallback(classId => {
    const selectedClass = classOptions.find(option => option._id === classId);

    setUpdateClassData({
      id: selectedClass._id,
      name: selectedClass.name,
      assignedFaculty: selectedClass.assignedFaculty || [],
    });

    setModalOpen(true);
  }, [classOptions]);

  const closeUpdateForm = useCallback(() => {
    setModalOpen(false);
  }, []);

  const handleUpdateClass = useCallback(() => {
    const { id, name, assignedFaculty } = updateClassData;

    axios
      .put(`/class/${id}`, { name, assignedFaculty })
      .then(response => {
        toast.success('Updated Successfully');
        closeUpdateForm();
        fetchAll();
      })
      .catch(error => {
        toast.error('Failed to Update');
        console.error(`Error updating class with ID ${id}: ${error}`);
      });
  }, [updateClassData, closeUpdateForm, fetchAll]);

  const handleDeleteClass = useCallback(classId => {
    const confirmDelete = window.confirm('Are you sure you want to delete this class?');
    if (confirmDelete) {
      axios
        .delete(`/class/${classId}`)
        .then(() => {
          toast.success('Deleted Successfully');
          fetchAll();

        })
        .catch(error => {
          console.error(`Error deleting class with ID ${classId}: ${error}`);
        });
    }
  }, [fetchAll]);

  const columns = useMemo(() => [
    {
      accessorKey: 'name',
      header: 'Class Name',
    },
    {
      accessorKey: 'actions',
      header: 'Actions',
      Cell: ({ row }) => (
        <div>
          <AwesomeButton type="primary" onReleased={() => openUpdateForm(row.original._id)}>
            <Tooltip title="Update Class" placement="top">
              <EditIcon />
            </Tooltip>
          </AwesomeButton>
          <AwesomeButton type="secondary" className='ms-2' onReleased={() => handleDeleteClass(row.original._id || '')}>
            <Tooltip title="Delete Class" placement="top">
              <DeleteIcon />
            </Tooltip>
          </AwesomeButton>
        </div>
      ),
    },
  ], [openUpdateForm, handleDeleteClass,]);

  const renderDetailPanel = useCallback(({ row }) => (
    <Box className="d-flex flex-row gap-2 ">
      <Typography variant="h6">Assigned Faculties:</Typography>
      <Table className="table table-bordered table-striped table-hover mx-auto">
        <thead className="table-dark">
          <tr>
            <th>Name</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {(row.original.assignedFaculty || []).map((faculty, index) => (
            <tr key={index}>
              <td>{faculty.name}</td>
              <td>{faculty.role}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Box>
  ), []);

  const table = useMaterialReactTable({
    columns,
    data: combinedData,
    renderDetailPanel,
    initialState: {
      density: 'compact',
      columnVisibility: { assignedFaculty: false }
    },

    enableStickyHeader: true,
    enableDensityToggle: false, //density does not work with memoized cells
    memoMode: 'cells',
    
    renderTopToolbarCustomActions: useCallback(() => (
      <AwesomeButton type="danger" onReleased={toggleAddClassModal}>
        <PlusIcon size={20} /> Add Class/es
      </AwesomeButton>
    ), [toggleAddClassModal]),
  });

  const modalContent = useMemo(() => (
    <React.Fragment>
      <ModalHeader toggle={closeUpdateForm} style={{ background: isDarkMode ? '#f8f9fa' : '#333', color: isDarkMode ? '#000' : '#fff' }}>
        Update Class
      </ModalHeader>
      <ModalBody style={{ background: isDarkMode ? '#fff' : '#333', color: isDarkMode ? '#00' : '#fff' }}>
        <Form>
          <FormGroup>
            <Label for="className" style={{ color: isDarkMode ? '#000' : '#fff' }}>Class Name</Label>
            <Input
              type="text"
              id="className"
              value={updateClassData.name}
              onChange={e => setUpdateClassData({ ...updateClassData, name: e.target.value })}
              style={{ background: isDarkMode ? '#fff' : '#444', color: isDarkMode ? '#000' : '#fff' }}
            />
          </FormGroup>
          <FormGroup>
            <Label for="assignedFaculty" style={{ color: isDarkMode ? '#000' : '#fff' }}>Assign Faculty (Excluding HOD)</Label>
            <Input
              type="select"
              id="assignedFaculty"
              multiple
              required
              value={updateClassData.assignedFaculty}
              onChange={(e) =>
                setUpdateClassData({
                  ...updateClassData,
                  assignedFaculty: Array.from(e.target.selectedOptions, (item) => item.value),
                })
              }
              style={{ background: !isDarkMode ? "#444" : "#fff", color: !isDarkMode ? "#fff" : "#000" }}
            >
              {faculties
                .filter((faculty) => faculty.role !== "HOD")
                .map((faculty) => (
                  <option key={faculty._id || ""} value={faculty.name}>
                    {faculty.name}
                  </option>
                ))}
            </Input>

          </FormGroup>
        </Form>
      </ModalBody>
      <ModalFooter style={{ background: !isDarkMode ? '#333' : '#f8f9fa', color: !isDarkMode ? '#fff' : '#000' }}>
        <AwesomeButton type="primary" onPress={handleUpdateClass}>
          Save
        </AwesomeButton>
        <AwesomeButton type="secondary" onPress={closeUpdateForm}>
          Cancel
        </AwesomeButton>
      </ModalFooter>
    </React.Fragment>
  ), [updateClassData, isDarkMode, closeUpdateForm, handleUpdateClass, faculties]);

  return (
    <ThemeProvider theme={createTheme({ palette: { mode: isDarkMode ? 'light' : 'dark' } })}>
      
     <Typography variant="h5" align="center" className='mt-4 w-75 mx-auto' style={{ backgroundColor: isDarkMode ? '#f8f9fa' : '#333', color: isDarkMode ? '#000' : '#fff',border: isDarkMode ? '1px solid #000' : '1px solid #fff' }} gutterBottom>
        Class Management
      </Typography>


        <div style={{ maxHeight: '80vh', overflow: 'auto', maxWidth: '95vw' }} className="w-100 border border-dark rounded ">
          <MaterialReactTable table={table} />
        </div>

        <Modal isOpen={isModalOpen} toggle={closeUpdateForm}>
          {modalContent}
        </Modal>

        <AddClassForm isModalOpen={isAddClassModalOpen} toggleAddClassModal={toggleAddClassModal} />

      
    </ThemeProvider>
  );
};

export default DisplayClasses;
