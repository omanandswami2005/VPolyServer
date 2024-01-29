import React, { useState,useCallback,useMemo } from 'react';
import {    Modal, ModalHeader, ModalBody, } from 'reactstrap';
// import '../styles/DisplayAllStudents.css';

import axios from 'axios';
import toast from 'react-hot-toast';
import MutatingDotsSpinner from './Spinners/MutatingDotsSpinner';
import { AwesomeButton } from 'react-awesome-button';
import { PlusIcon } from "@primer/octicons-react";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Tooltip } from '@mui/material';

import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Input,
  Select,
  MenuItem,
  Box,

  Typography,
  
} from '@mui/material';

import AddStudentForm from './AddStudentsForm';
import { useData } from '../DataContext';
import { useDarkMode } from '../DarkModeContext';


function DisplayAllStudents() {

  const { isDarkMode } = useDarkMode();

  const [selectedClass, setSelectedClass] = useState('Select Class');
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const { students, fetchStudentData, classOptions } = useData();

  const [selectedStudents, setSelectedStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  const [updateStudentData, setUpdateStudentData] = useState({
    name: '',
    rollNo: '',
    enrollmentNo: '',
    selectedClassId: '',
  });
  const [modal, setModal] = useState(false);
  

 

  const toggleAddStudentModal = () => {
    setShowAddStudentModal(!showAddStudentModal);
  };
 
  const handleDelete = useCallback((studentId) => {
    axios
      .delete(`/student/${studentId}`)
      .then(() => {
        fetchStudentData();
        setLoading(false);
        toast.success('Deleted Successfully');
      })
      .catch((error) => {
        console.error(`Error deleting student with ID ${studentId}: ${error}`);
        setLoading(false);
      });
  }, [fetchStudentData]);


  const handleDeleteSelected = useCallback(async (studentId) => {
    try {
      if (typeof studentId === 'string') {
        const confirmDelete = window.confirm('Are you sure you want to delete this student? (This Action CANNOT be undone! and Also All The Attendance data will be DELETED For All Time of respective Student!)');
        if (confirmDelete) {
          setLoading(true);
          table.resetRowSelection();
          await handleDelete(studentId);
        } else {
          return;
        }
      } else {
        console.log(studentId);
        const selectedCount =  Object.keys(studentId).length;
        if (selectedCount === 0) {
          toast.error('No students selected');
        } else {
          const selectedStudents1 = Object.keys(studentId);
          const confirmDelete = window.confirm(`Are you sure you want to delete selected ${selectedCount} student(s)? (This Action CANNOT be undone! and Also All The Attendance data will be DELETED For All Time of Selected Students!)`);
          if (confirmDelete) {
            setLoading(true);
            await axios.post('/student/deleteAllStudents', { selectedStudents1 });
            table.resetRowSelection();
            setSelectedStudents([]);
            toast.success('Deleted Successfully');
            fetchStudentData();
          }
        }
      }
    } catch (error) {
      console.error('Error deleting students', error);
      toast.error('Error Deleting Students');
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedStudents, handleDelete, setLoading, fetchStudentData]);
  


  const countStudentsInClasses = useCallback(() => {
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
  }, [students]);

// console.log(students);
  const classCounts = countStudentsInClasses();


  
  const toggleModal = useCallback(() => {
    setModal(!modal);
  }, [modal]);

   const openUpdateForm = useCallback((student) => {
    setUpdateStudentData({
      _id: student._id,
      rollNo: student.rollNo,
      name: student.name,
      enrollmentNo: student.enrollmentNo,
      selectedClassId: student.class ? student.class._id : '',
    });
    toggleModal();
  }, [toggleModal]);




  const handleUpdate = useCallback(async () => {
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
      toggleModal();
      fetchStudentData();
    } catch (error) {
      if (error.response && error.response.status === 500) {
        toast.error('Enrollment Number Already Exists!');
      } else if (error.response && error.response.status === 400 && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Failed to Update');
        console.error(`Error updating student with ID ${_id}: ${error}`);
      }
    }
  }, [updateStudentData, fetchStudentData,toggleModal]);

 

  

  let data = React.useMemo(() => {
    return students
        .filter((student) => (student.class.name ? student.class.name : 'N/A') === selectedClass)
        .slice().sort((a, b) => a.rollNo - b.rollNo); 
    // eslint-disable-next-line
  }, [selectedClass, students,]);

// conso


  const columns = React.useMemo(() => [
    {
      id: 'rollNo',
      accessorKey: 'rollNo',
      header: 'Roll No.',
    },
    {
      accessorKey: 'name',
      header: 'Name',
      
      
    },
    {
      accessorKey: 'enrollmentNo',
      header: 'Enrollment No.',
    },
    {
      accessorKey: 'actions',
      header: 'Actions',
      Cell: ({ row }) => (
        <div>
          <AwesomeButton type="primary" onReleased={() => openUpdateForm(row.original)}>
            <Tooltip title="Update Class" placement="top">
              <EditIcon />
            </Tooltip>
          </AwesomeButton>
  
          <AwesomeButton type="secondary" className='ms-2' onReleased={() => handleDeleteSelected(row.original._id || '')}>
            <Tooltip title="Delete Class" placement="top">
              <DeleteIcon />
            </Tooltip>
          </AwesomeButton>
        </div>
      ),
    },
    // eslint-disable-next-line
  ], [ handleDeleteSelected, openUpdateForm,]);
  

  // console.log(data);

  const table = useMaterialReactTable({
    columns,
    data,
    initialState: {
      density: 'compact',
      sorting: [
        { id: 'rollNo', desc: false },
      ]
      
    },
    
    paginationDisplayMode: 'pages',
    muiTableBodyCellProps: {
      style: {
        
        textWrap: 'wrap',
        maxWidth: '50vw',
      }
    },
    enableStickyHeader: true,
    enableColumnResizing: false,
    enableRowSelection: true,
    enableDensityToggle: false, //density does not work with memoized cells
    memoMode: 'cells',
   
    selectAllMode: 'all',
    muiSelectCheckboxProps: {
      color: 'secondary',
    },
    positionToolbarAlertBanner: 'bottom',
    muiTableContainerProps: { sx: { maxHeight: '50vh', maxWidth: '99vw' } },

    getRowId: (originalRow) => originalRow._id || '',

    renderTopToolbarCustomActions: () => (
      <Box sx={{ display: 'flex', gap: '.5rem', p: '4px', flexWrap: 'wrap' }}>

        <AwesomeButton type="danger" onReleased={toggleAddStudentModal}>
          <PlusIcon size={20} /> Add Student/es
        </AwesomeButton>
        <AwesomeButton type="secondary"  onReleased={() => handleDeleteSelected(table.getState().rowSelection)}>
          Delete Selected
        </AwesomeButton>
        <Box >
          <FormControl style={{ width: '100%', }}>

            <Select
              labelId="class-select-label"
              value={selectedClass}
              required
              onChange={(e) => setSelectedClass(e.target.value)}
              fullWidth
              renderValue={(value) => (value === '' ? 'Select Class' : value)}

            >
              <MenuItem value="N/A">
                N/A
              </MenuItem>
              {classOptions.map((option) => (
                classCounts[option.name] > 0 && (
                  <MenuItem key={option._id} value={option.name}>
                    {option.name} {classCounts[option.name] ? `(${classCounts[option.name]})` : ''}
                  </MenuItem>
                )
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>
    ),
  });
  


  const modalContent = useMemo(() => (
    <Dialog onClose={toggleModal} open={modal}>
      <DialogTitle style={{ background: !isDarkMode ? '#333' : '#f8f9fa', color: !isDarkMode ? '#fff' : '#000' }}>
        Update Student
      </DialogTitle>
      <DialogContent style={{ background: !isDarkMode ? '#333' : '#f8f9fa', color: !isDarkMode ? '#fff' : '#000', height: '300px', paddingTop: '20px' }}>
        {/* Update form fields */}
        <FormControl fullWidth style={{ marginBottom: '40px' }}
        >
          <InputLabel htmlFor="updateName">Name :</InputLabel>
          <Input
            type="text"
            id="updateName"
            placeholder="Name"
            value={updateStudentData.name}
            onChange={(e) => setUpdateStudentData({ ...updateStudentData, name: e.target.value })}
          />
        </FormControl>

        <FormControl fullWidth style={{ marginBottom: '40px' }}
        >
          <InputLabel htmlFor="updateEnrollmentNo">Enrollment No :</InputLabel>
          <Input
            type="text"
            id="updateEnrollmentNo"
            placeholder="Enrollment No"
            value={updateStudentData.enrollmentNo}
            onChange={(e) =>
              setUpdateStudentData({ ...updateStudentData, enrollmentNo: e.target.value })
            }
          />
        </FormControl>

        <FormControl fullWidth style={{ marginBottom: '5px' }}>
          <InputLabel htmlFor="updateClass">Select Class</InputLabel>
          <Select
            id="updateClass"
            value={updateStudentData.selectedClassId}
            onChange={(e) =>
              setUpdateStudentData({ ...updateStudentData, selectedClassId: e.target.value })
            }

          >

            {classOptions &&
              classOptions.map((option) => (
                <MenuItem key={option._id} value={option._id}>
                  {option.name}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <AwesomeButton type='primary' onReleased={() => { handleUpdate(updateStudentData._id); }}>
          Save
        </AwesomeButton>
        <AwesomeButton type='secondary' onReleased={toggleModal}>
          Cancel
        </AwesomeButton>
      </DialogActions>
    </Dialog>

  ), [isDarkMode, updateStudentData, handleUpdate, toggleModal,classOptions,modal]);



  return (
    
      <div className="">
      <Typography variant="h5" align="center" className='mt-4 w-75 mx-auto' style={{ backgroundColor: isDarkMode ? '#f8f9fa' : '#333', color: isDarkMode ? '#000' : '#fff',border: isDarkMode ? '1px solid #000' : '1px solid #fff' }} gutterBottom>
        Student Management
      </Typography>

        <Modal isOpen={showAddStudentModal} toggle={toggleAddStudentModal}>

          <ModalHeader toggle={toggleAddStudentModal} style={{ background: !isDarkMode ? '#333' : '#f8f9fa', color: !isDarkMode ? '#fff' : '#000' }}>Add Student/es
          </ModalHeader>

          <ModalBody style={{ background: !isDarkMode ? '#333' : '#fff', color: !isDarkMode ? '#fff' : '#000' }}>
            <AddStudentForm />
          </ModalBody>
        </Modal>


        <div style={{ maxHeight: '80vh', maxWidth: '99vw' }} className="w-100 border border-dark rounded ">
          <MaterialReactTable table={table} />
        </div>

        <Modal isOpen={modal} toggle={toggleModal}>
          {modalContent}
        </Modal>


        {loading && <MutatingDotsSpinner />}

      </div>

  );
}

export default DisplayAllStudents;
