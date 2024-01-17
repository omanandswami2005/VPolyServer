import React, { useState, useMemo } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import AddClassForm from '../components/AddClassForm';
import {
  Box,
  Typography,
  Table,
  ThemeProvider,
  createTheme,

} from '@mui/material';
import { useDarkMode } from '../DarkModeContext';

import { AwesomeButton } from 'react-awesome-button';
import { PlusIcon } from "@primer/octicons-react";

import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import { Modal, Form, FormGroup, Label, Input, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

import { useData } from '../DataContext';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Tooltip } from '@mui/material';

const DisplayClasses = () => {
  const { classOptions, faculties, fetchAll, fetchClassOptions } = useData();

  const { isDarkMode } = useDarkMode();
  const [isAddClassModalOpen, setAddClassModalOpen] = useState(false);

  const toggleAddClassModal = () => {
    setAddClassModalOpen(!isAddClassModalOpen);
  };

  const combinedData = useMemo(() => {
    return classOptions.map((classOption) => ({
      ...classOption,
      assignedFaculty: faculties
        .filter((faculty) => faculty.assignedClasses.includes(classOption.name))
        .map((faculty) => {
          if (faculty.role === 'HOD') {
            return { name: faculty.name, role: 'HOD' };
          } else {
            return { name: faculty.name, role: 'Faculty' };
          }
        }),
    }));
  }, [classOptions, faculties]);

  const [updateClassData, setUpdateClassData] = useState({
    id: '',
    name: '',
    assignedFaculty: [],
  });

  const [isModalOpen, setModalOpen] = useState(false);
  // console.log(classOptions);
  // console.trace();
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
    // table.setRowSelection([]);
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

  const columns = [
    {
      accessorKey: 'name',
      header: 'Class Name',
    },
    // {
    //   accessorKey: 'assignedFaculty',
    //   header: 'Assigned To',
    //   Cell: ({ row }) => (
    //     <span>
    //       {(row.original.assignedFaculty || []).map((faculty, index) => (
    //         <span
    //           key={faculty.name}
    //           style={{
    //             fontWeight: 'normal',
    //             color: faculty.role === 'HOD' ? 'blue' : 'black',
    //           }}
    //         >
    //           {index > 0 && ', '}
    //           {faculty.role === 'HOD' ? `[${faculty.name} (${faculty.role}) ] ` : faculty.name}
    //         </span>
    //       ))}
    //     </span>
    //   ),
    // },
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
  ];

  const renderDetailPanel = ({ row }) => (
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
  );

  const table = useMaterialReactTable({
    columns,
    data: combinedData,
    renderDetailPanel,
    initialState: {
      density: 'compact',
      columnVisibility: { assignedFaculty: false },
    },
    // enablePagination: false,
    enableStickyHeader: true,
    enableColumnResizing: true,
    enableRowVirtualization: true,
    enableColumnVirtualization: true,

    renderTopToolbarCustomActions: () => (
      <AwesomeButton type="danger" onReleased={toggleAddClassModal}>
        <PlusIcon size={20} /> Add Class/es
      </AwesomeButton>
    ),
  });

  const modalContent = (
    <React.Fragment>
      <ModalHeader toggle={closeUpdateForm} style={{ background: !isDarkMode ? '#333' : '#f8f9fa', color: !isDarkMode ? '#000' : '#fff' }}>
        Update Class
      </ModalHeader>
      <ModalBody style={{ background: !isDarkMode ? '#333' : '#fff', color: !isDarkMode ? '#fff' : '#000' }}>
        <Form>
          <FormGroup>
            <Label for="className" style={{ color: !isDarkMode ? '#fff' : '#000' }}>Class Name</Label>
            <Input
              type="text"
              id="className"
              value={updateClassData.name}
              onChange={(e) => setUpdateClassData({ ...updateClassData, name: e.target.value })}
              style={{ background: !isDarkMode ? '#444' : '#fff', color: !isDarkMode ? '#fff' : '#000' }}
            />
          </FormGroup>
          <FormGroup>
            <Label for="assignedFaculty" style={{ color: !isDarkMode ? '#fff' : '#000' }}>Assigned Faculty</Label>
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
              style={{ background: !isDarkMode ? '#444' : '#fff', color: !isDarkMode ? '#fff' : '#000' }}
            >
              {faculties.map((faculty) => (
                <option key={faculty._id || ''} value={faculty.name}>
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
  );





  return (
    <ThemeProvider theme={createTheme({ palette: { mode: isDarkMode ? 'light' : 'dark' } })}>
      <div className={`w-100 `}>
        <h4 className={`text-center w-50 mx-auto border border-white`}>
          List Of All Classes
        </h4>
        <div style={{ maxHeight: '80vh', overflow: 'auto', maxWidth: '95vw' }} className="w-100 border border-dark rounded ">
          <MaterialReactTable table={table} />
        </div>

        <Modal isOpen={isModalOpen} toggle={closeUpdateForm}>
          {modalContent}
        </Modal>

        <AddClassForm isModalOpen={isAddClassModalOpen} toggleAddClassModal={toggleAddClassModal} />


      </div>
    </ThemeProvider>
  );
};

export default DisplayClasses;
