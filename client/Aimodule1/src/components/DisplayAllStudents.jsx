import React, { useState ,useEffect} from 'react';
import {   Form, FormGroup, Label,  Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Input,
  Select,
  MenuItem,
  useTheme,
  Box,
  ThemeProvider,
  createTheme,
  
} from '@mui/material';

import AddStudentForm from './AddStudentsForm';
import { useData } from '../DataContext';
import { useDarkMode } from '../DarkModeContext';


function DisplayAllStudents() {
  
  const { isDarkMode } = useDarkMode();
  const theme = useTheme();

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
   // Define a dark theme
   const darkTheme = createTheme({
    palette: {
      mode: 'dark',
     
    },
  });


  // Define a light theme
  const lightTheme = createTheme({
    palette: {
      mode: 'light',
    },
  });
  // const [filteredStudents, setFilteredStudents] = useState([]);

// useEffect(() => {
//     fetchStudentData();
//     fetchClassOptions();
//   }, []); // Empty dependency array to fetch data only on mount
  
  const toggleAddStudentModal = () => {
    setShowAddStudentModal(!showAddStudentModal);
  };

  // const handleSelectAll = () => {
  //   const allStudents = filteredStudents.map((student) => student._id);

  //   if (selectedStudents.length === allStudents.length) {
  //     // All students are already selected, so deselect all
  //     setSelectedStudents([]);
  //   } else {
  //     // Not all students are selected, so select all
  //     setSelectedStudents(allStudents);
  //   }
  // };


  // const handleSelectStudent = (studentId) => {
  //   if (selectedStudents.includes(studentId)) {
  //     // If already selected, remove from the list
  //     setSelectedStudents((prevSelected) => prevSelected.filter((id) => id !== studentId));
  //   } else {
  //     // If not selected, add to the list
  //     setSelectedStudents((prevSelected) => [...prevSelected, studentId]);
  //   }
  // };
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
        let selectedCount = selectedStudents.length;
        if (selectedCount === 0) {
          toast.error('No students selected');
        } else {
          const confirmDelete = window.confirm(`Are you sure you want to delete selected student(s)? (This Action CANNOT be undone! and Also All The Attendance data will be DELETED For All Time of Selected Students!)`);
          if (confirmDelete) {
            setLoading(true); // Set loading to true during deletion


            try {
              await axios.post('/student/deleteAllStudents', { selectedStudents });
              // console.log('Students deleted successfully');
               setSelectedStudents([]);
               
              //  console.log(selectedStudents);
              toast.success('Deleted Successfully');
              fetchStudentData();
              setLoading(false);

            } catch (error) {
              console.error('Error deleting students', error);
              // Handle the error, display a message, or perform other actions as needed
            }
            finally{
              selectedCount=0;
              setSelectedStudents([]);

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
  // console.log(classOptions)
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
    // rowVirtualizerOptions: { overscan: 5 },
    muiTableContainerProps: { sx: { maxHeight: '50vh', maxWidth: '100vw' } },
    enableRowSelection: true,
    getRowId: (originalRow) => originalRow._id || '',

    renderTopToolbarCustomActions: () => (
      <Box sx={{ display: 'flex', gap: '.5rem', p: '4px',flexWrap: 'wrap' }}>

      <AwesomeButton type="danger" onReleased={toggleAddStudentModal}>
        <PlusIcon size={20} /> Add Student/es
      </AwesomeButton>
      <AwesomeButton type="danger"  disabled={selectedStudents.length === 0} onReleased={() => handleDeleteSelected()}>
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
              <MenuItem value="Show All Students">Show All Students</MenuItem>
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
  
  useEffect(() => {
    const selectedIds = Object.keys(table.getState().rowSelection);
    setSelectedStudents(selectedIds);
    // console.log(selectedIds);
    // eslint-disable-next-line
  }, [table.getState().rowSelection]);
  
  

const modalContent =(
      <Dialog  onClose={toggleModal} open={modal}  >
        <DialogTitle style={{ background: !isDarkMode ? '#333' : '#f8f9fa', color: !isDarkMode ? '#fff' : '#000' }}>
          Update Student
        </DialogTitle>
        <DialogContent style={{ background: !isDarkMode ? '#333' : '#f8f9fa', color: !isDarkMode ? '#fff' : '#000' ,height: '300px',paddingTop: '20px'}}>
          {/* Update form fields */}
          <FormControl fullWidth  style={{marginBottom: '40px'}}
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

          <FormControl fullWidth style={{marginBottom: '40px'}}
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

          <FormControl fullWidth style={{marginBottom: '5px'}}>
            <InputLabel htmlFor="updateClass">Select Class</InputLabel>
            <Select
              id="updateClass"
              value={updateStudentData.selectedClassId}
              onChange={(e) =>
                setUpdateStudentData({ ...updateStudentData, selectedClassId: e.target.value })
              }
              // renderValue={(value) => (value === '' ? 'Select Class' : value)}
            >
              {/* <MenuItem value="">Select Class</MenuItem> */}
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
          <AwesomeButton type='primary' onReleased={() => { handleUpdate(updateStudentData._id); toggleModal(); }}>
            Save
          </AwesomeButton>
          <AwesomeButton type='secondary' onReleased={toggleModal}>
            Cancel
          </AwesomeButton>
        </DialogActions>
      </Dialog>
    
)













  return (
    <ThemeProvider theme={isDarkMode ? lightTheme : darkTheme}>
    <div className="my-5 ">


       <Modal isOpen={showAddStudentModal} toggle={toggleAddStudentModal}>

        <ModalHeader toggle={toggleAddStudentModal} style={{ background: !isDarkMode ? '#333' : '#f8f9fa', color: !isDarkMode ? '#fff' : '#000' }}>Add Student/es
        </ModalHeader>

        <ModalBody style={{ background: !isDarkMode ? '#333' : '#fff', color: !isDarkMode ? '#fff' : '#000' }}>
          <AddStudentForm />
        </ModalBody>
      </Modal>


      {/* <Input
            className='w-50 d-inline-block mx-5 bg-white text-dark'
            type="select"
            id="selectClass"
            
          >
            <option value="">Select Class</option>
            <option value="Show All Students">Show All Students</option>
            {Object.keys(classCounts).map((className) => (
              <option key={className} value={className}>
                {className} ({classCounts[className]})
              </option>
            ))}
          </Input> */}

          


<div style={{ maxHeight: '80vh', maxWidth: '99vw' }} className="w-100 border border-dark rounded ">
          <MaterialReactTable table={table} />
        </div>

<Modal isOpen={modal} toggle={toggleModal}>
       {modalContent}
</Modal>


      {loading && <MutatingDotsSpinner />}

    </div>
    </ThemeProvider>

  );
}

export default DisplayAllStudents;
