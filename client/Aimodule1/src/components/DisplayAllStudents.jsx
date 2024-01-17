import React, { useState ,useEffect} from 'react';
import { Button,  Form, FormGroup, Label, Input, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import '../styles/DisplayAllStudents.css';

import axios from 'axios';
// import { Spinner } from 'react-bootstrap';
import toast from 'react-hot-toast';
import MutatingDotsSpinner from './Spinners/MutatingDotsSpinner';
import { AwesomeButton } from 'react-awesome-button';
import { PlusIcon } from "@primer/octicons-react";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import {  Tooltip } from '@mui/material';

import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import {
  Box,
  Typography,
  Table,
  ThemeProvider,
  createTheme,
  
} from '@mui/material';
import AddStudentForm from './AddStudentsForm';
import { useData } from '../DataContext';
import { useDarkMode } from '../DarkModeContext';


function DisplayAllStudents() {
  
  const { isDarkMode } = useDarkMode();

  const [selectedClass, setSelectedClass] = useState('Select Class');
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const {students,fetchStudentData,classOptions} = useData();

  const [selectedStudents, setSelectedStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  const [updateStudentData, setUpdateStudentData] = useState({
    name: '',
    rollNo: '',
    enrollmentNo: '',
    selectedClassId: '',
  });
  const [modal, setModal] = useState(false);
  // const [filteredStudents, setFilteredStudents] = useState([]);

// useEffect(() => {
//     fetchStudentData();
//     fetchClassOptions();
//   }, []); // Empty dependency array to fetch data only on mount
  
  const toggleAddStudentModal = () => {
    setShowAddStudentModal(!showAddStudentModal);
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
  const handleDisSelectAllStudent = () => {
    const allStudents = filteredStudents.map((student) => student._id);

    if (selectedStudents.length === allStudents.length) {
      // All students are already selected, so deselect all
      setSelectedStudents([]);
    }
  };



  const handleDeleteSelected = async (studentId) => {


    try {
      if (typeof studentId === 'string') {
        
         handleDisSelectAllStudent();
        const confirmDelete = window.confirm('Are you sure you want to delete this student? (This Action CANNOT be undone! and Also All The Attendance data will be DELETED For All Time of respective Student!)');
        // toast.confirmDelete();
        if (confirmDelete) {
          setLoading(true); // Set loading to true during deletion
           handleDelete(studentId);
        } else {
          return;
        }
      } else {
        const selectedCount = selectedStudents.length;
        if (selectedCount === 0) {
          toast.error('No students selected');
        } else {
          const confirmDelete = window.confirm(`Are you sure you want to delete ${selectedCount} student(s)? (This Action CANNOT be undone! and Also All The Attendance data will be DELETED For All Time of Selected Students!)`);
          if (confirmDelete) {
            setLoading(true); // Set loading to true during deletion


            try {
              await axios.post('/student/deleteAllStudents', { selectedStudents });
              console.log('Students deleted successfully');
               setSelectedStudents([]);
               console.log(selectedStudents);
              toast.success('Deleted Successfully');
              fetchStudentData();
              setLoading(false);

            } catch (error) {
              console.error('Error deleting students', error);
              // Handle the error, display a message, or perform other actions as needed
            }

          }
        }
      }
    } catch (error) {
      console.error('Error deleting students', error);
      toast.error('Error Deleting Students');
    }
  };


  // const fetchClassOptions = async () => {
  //   try {
  //     const response = await axios.get('/class');
  //     setClassOptions(response.data);
  //   } catch (error) {
  //     console.error('Error fetching class options:', error);
  //   }
  // };

  // const checkboxStyle = {
  //   transform: 'scale(1.5)',
  //   marginRight: '0px',
  // };

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
  console.log(classOptions)
  // console.trace()

  const classCounts = countStudentsInClasses();

  const sortedStudents =
    selectedClass === 'Show All Students'
      ? students.slice().sort((a, b) => a.rollNo - b.rollNo)
      : students
        .filter((student) => (student.class ? student.class.name : 'N/A') === selectedClass)
        .slice()
        .sort((a, b) => a.rollNo - b.rollNo);

  const filteredStudents = sortedStudents.map((student) => {
    return {
      _id: student._id,
      rollNo: student.rollNo,
      name: student.name,
      enrollmentNo: student.enrollmentNo,
     class: student.class ? student.class.name : 'N/A',
    };
  })

  const openUpdateForm = (student) => {
    setUpdateStudentData({
      _id: student._id,
      rollNo: student.rollNo,
      name: student.name,
      enrollmentNo: student.enrollmentNo,
      selectedClassId: student.class ? student.class._id : '',
    });
    toggleModal();
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
  };

  const handleDelete = (studentId) => {
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
  };

  const toggleModal = () => {
    setModal(!modal);
  };

  let data = React.useMemo(() => {
    return selectedClass === 'Show All Students'
      ? filteredStudents.slice()
      : filteredStudents
          .filter((student) => (student.class ? student.class : 'N/A') === selectedClass)
          .slice()
              // eslint-disable-next-line
  }, [selectedClass, students]);





  const columns =  [
    {
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
      accessorKey: 'class',
      header: 'Class',
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
  ] 

  
  
  const table = useMaterialReactTable({
    columns,
    data ,
    initialState: {
      density: 'compact',
    },
    paginationDisplayMode: 'pages',

    
    enableStickyHeader: true,
    enableColumnResizing: true,
    enableRowVirtualization: true,
    enableColumnVirtualization: true,
    rowVirtualizerOptions: { overscan: 5 },
    muiTableContainerProps: { sx: { maxHeight: '50vh', maxWidth: '100vw' } },
    enableRowSelection: true,
    getRowId: (originalRow) => originalRow._id || '',

    renderTopToolbarCustomActions: () => (
      <Box sx={{ display: 'flex', gap: '1rem', p: '4px' }}>

      <AwesomeButton type="danger" onReleased={toggleAddStudentModal}>
        <PlusIcon size={20} /> Add Student/es
      </AwesomeButton>
      <AwesomeButton type="danger"  disabled={selectedStudents.length === 0} onReleased={() => handleDeleteSelected()}>
          Delete Selected Accounts
        </AwesomeButton>
      </Box>
    ),
  });
  
  useEffect(() => {
    const selectedIds = Object.keys(table.getState().rowSelection);
    setSelectedStudents(selectedIds);
    console.log(selectedStudents);
    // eslint-disable-next-line
  }, [table.getState().rowSelection]);
  

  useEffect(() => {
    // console.log(selectedStudents);
  }, [selectedStudents]);
  















  return (
    <div className="my-5 ">
       <Modal isOpen={showAddStudentModal} toggle={toggleAddStudentModal}>
        <ModalHeader toggle={toggleAddStudentModal}>Add Student/es</ModalHeader>
        <ModalBody>
          <AddStudentForm />
        </ModalBody>
      </Modal>
      <Input
            className='w-50 d-inline-block mx-5 bg-white text-dark'
            type="select"
            id="selectClass"
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
          >
            <option value="">Select Class</option>
            <option value="Show All Students">Show All Students</option>
            {Object.keys(classCounts).map((className) => (
              <option key={className} value={className}>
                {className} ({classCounts[className]})
              </option>
            ))}
          </Input>
         <MaterialReactTable table={table} />
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
                {classOptions && classOptions.map((option) => (
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
          <Button color="danger" onClick={() => { toggleModal(); }}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>

      {loading && <MutatingDotsSpinner />}

    </div>
  );
}

export default DisplayAllStudents;
