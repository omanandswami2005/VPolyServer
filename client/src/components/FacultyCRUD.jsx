import React, { useState, useCallback, useMemo } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useDarkMode } from '../DarkModeContext';
import EditIcon from '@mui/icons-material/Edit';

import {
  Button,
  Col,
  Form,
  Table,
  Input,
  Label,
  Row,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from 'reactstrap';
import { useData } from '../DataContext';
import {
  FormGroup,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Chip,
  Box,
  OutlinedInput,
  Typography,
} from '@mui/material';
import { AwesomeButton } from 'react-awesome-button';
import { PlusIcon } from '@primer/octicons-react';

function FacultyManagement( props) {
  const { isDarkMode } = useDarkMode();


  const { fetchAll, classOptions, faculties } = useData();
  // const [faculties, setfaculties] = useState(faculties);
  const [newFaculty, setNewFaculty] = useState({
    name: '',
    id: '',
    assignedClasses: [],
    role: 'Select Role',
    password: '',
  });
  // const [availableClasses, setAvailableClasses] = useState(classOptions);
  const [editFaculty, setEditFaculty] = useState(null);
  const [editClasses, setEditClasses] = useState([]);
  const [editRole, setEditRole] = useState('');
  const [isModalOpen, setModalOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isHOD, setIsHOD] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [updateDropdownOpen, setUpdateDropdownOpen] = useState(false);
  const [isAddFacultyModalOpen, setAddFacultyModalOpen] = useState(false);
  const toggleAddFacultysModal = useCallback(() => setAddFacultyModalOpen(prev => !prev), []);

  // useEffect(() => {
  //   axios.get('/faculty').then((response) => {
  //     setfaculties(response.data);
  //   });

  //   axios.get('/class').then((response) => {
  //     setAvailableClasses(response.data);
  //   });

  // }, []);

  const toggleDropdown = () => setDropdownOpen((prevState) => !prevState);
  const toggleUpdateDropdown = () => setUpdateDropdownOpen((prevState) => !prevState);

  const createFacultyMember = useCallback(async () => {
    if (!newFaculty.name || !newFaculty.id || !newFaculty.role || !newFaculty.password) {
      toast.error('Please fill in all the required fields.');
      return;
    }
    if (faculties.some((faculty) => faculty.id === newFaculty.id)) {
      toast.error('Faculty ID already exists. Please choose a different ID.');
      return;
    }
    if (faculties.some((faculty) => faculty.name === newFaculty.name)) {
      toast.error('Faculty with the same Name already exists. Please enter a different Name.');
      return;
    }
  
    const newFacultyData = {
      name: newFaculty.name,
      id: newFaculty.id,
      assignedClasses: newFaculty.role === 'HOD' ? classOptions.map((facultyClass) => facultyClass.name) : editClasses,
      role: newFaculty.role,
      password: newFaculty.password,
    };
  
    try {
      await axios.post('/faculty', newFacultyData);
      toast.success('Faculty Added Successfully!');
      // setfaculties([...faculties, response.data]);
      setNewFaculty({
        name: '',
        id: '',
        assignedClasses: [],
        role: 'Select Role',
        password: '',
      });
      fetchAll();
    } catch (error) {
      console.error('Error creating faculty member:', error);
    }
  }, [newFaculty, faculties, classOptions, editClasses, setNewFaculty, fetchAll]);
  

  const editFacultyMember = (faculty) => {
    setEditFaculty(faculty);
    setEditClasses(faculty.assignedClasses || []);
    setEditRole(faculty.role);
    setModalOpen(true);
  };


  const updateFacultyMember = () => {
    if (!editFaculty) {
      return;
    }

    const updatedFaculty = {
      _id: editFaculty._id,
      name: editFaculty.name,
      id: editFaculty.id,
      assignedClasses: editRole === 'HOD' ? classOptions.map((facultyClass) => facultyClass.name) : editClasses,
      role: editRole,
      password: editFaculty.password,
    };

    axios
      .put(`/faculty/${editFaculty._id}`, updatedFaculty)
      .then(() => {
        toast.success('Faculty Updated Successfully!');
        setEditFaculty(null);
        setModalOpen(false);
        fetchAll();


      })
      .catch((error) => {
        console.error('Error updating faculty member:', error);
      });
  };

  const cancelEdit = () => {
    setEditFaculty(null);
    setModalOpen(false);
  };

  const deleteFacultyMember = (facultyId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this faculty member?');
    if (confirmDelete) {
      axios.delete(`/faculty/${facultyId}`).then(() => {
        toast.success('Faculty Deleted Successfully!');

        fetchAll();
      });
    }
  };

  const handleClassSelection = useCallback((event) => {
    const selectedClassIds = event.target.value;
    setEditClasses(selectedClassIds);
  }, [setEditClasses]);
  


  const setFac = useCallback((e) => {
    if (e === 'HOD') {
      setEditRole(e);
      setNewFaculty({
        ...newFaculty,
        role: e,
        assignedClasses: classOptions.map((facultyClass) => facultyClass.name),
      });
      setIsHOD(true);
    } else {
      setEditRole(e);
      setNewFaculty({
        ...newFaculty,
        role: e,
        assignedClasses: editClasses || [],
      });
      setIsHOD(false);
    }
  }, [newFaculty, setEditRole, classOptions, editClasses, setIsHOD]);
  
  const addFaculty = useMemo(() => (
    <div className='std-mgmt123'>
      <Modal isOpen={isAddFacultyModalOpen} toggle={toggleAddFacultysModal}>
        <ModalHeader toggle={toggleAddFacultysModal} style={{ background: isDarkMode ? '#f8f9fa' : '#333', color: isDarkMode ? '#000' : '#fff' }}>
          Add Faculties      </ModalHeader>

        <ModalBody style={{ background: isDarkMode ? '#fff' : '#333', color: isDarkMode ? '#00' : '#fff' }}>
          <Form>
            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label for="name"> Name:</Label>
                  <Input
                    type="text"
                    id="name"
                    placeholder="Enter Name"
                    style={{ background: isDarkMode ? '#fff' : '#333', color: isDarkMode ? '#000' : '#fff' }}
                    required
                    value={newFaculty.name}
                    onChange={(e) => setNewFaculty({ ...newFaculty, name: e.target.value })}
                  />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="id">ID:</Label>
                  <Input
                    type="text"
                    id="id"
                    placeholder="Enter ID"
                    style={{ background: isDarkMode ? '#fff' : '#333', color: isDarkMode ? '#000' : '#fff' }}
                    required
                    value={newFaculty.id}
                    onChange={(e) => setNewFaculty({ ...newFaculty, id: e.target.value })}
                  />
                </FormGroup>
              </Col>
              <Col md={8} >
                <FormControl fullWidth variant="outlined" margin="normal">
                  <InputLabel id="demo-multiple-chip-label" style={{ color: isDarkMode ? '#000' : '#fff' }}> Select Role:</InputLabel>
                  <Select
                    labelId="demo-multiple-chip-label"
                    open={dropdownOpen}
                    onClose={toggleDropdown}
                    onOpen={toggleDropdown}
                    value={newFaculty.role}
                    input={<OutlinedInput id="select-multiple-chip" label="Chip" />}

                    onChange={(e) => setFac(e.target.value)}
                    style={{

                      color: !isDarkMode ? '#fff' : '#000',
                    }}
                  >
                    <MenuItem value="HOD" >HOD</MenuItem>
                    <MenuItem value="Teacher" >Teacher</MenuItem>
                  </Select>
                </FormControl>

              </Col>
            </Row>
            <Col md={8} >
              <FormGroup>
                <Label for="password">Password:</Label>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  placeholder="Enter Password"
                  required
                  style={{ background: isDarkMode ? '#fff' : '#333', color: isDarkMode ? '#00' : '#fff' }}
                  value={newFaculty.password}
                  onChange={(e) => setNewFaculty({ ...newFaculty, password: e.target.value })}
                />
                <Button
                  type="button"
                  color="secondary"
                  onClick={() => setShowPassword(!showPassword)}
                  className="mt-2 w-50"
                >
                  {showPassword ? 'Hide Password' : 'Show Password'}
                </Button>
              </FormGroup>
            </Col>
            <FormGroup>
              <Label for="assignedClasses">Assigned Classes:</Label>
              {/* {console.log(isHOD)} */}
              <FormControl fullWidth>
                {isHOD ? (
                  <Chip
                    label="All Classes (HOD)"
                    style={{
                      backgroundColor: isDarkMode ? '#fff' : '#333',
                      color: isDarkMode ? '#000' : '#fff',
                    }}
                    disabled
                  />
                ) : (
                  <Select
                    id="assignedClasses"
                    multiple
                    placeholder='Select Claases'
                    required
                    value={editClasses}
                    style={{
                      backgroundColor: isDarkMode ? '#fff' : '#333',
                      color: isDarkMode ? '#000' : '#fff',
                      margin: '2px',
                    }}
                    onChange={handleClassSelection}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip
                            key={value}
                            label={value}
                            style={{

                              color: isDarkMode ? '#000' : '#fff',
                              margin: '2px',
                            }}
                          />
                        ))}
                      </Box>
                    )}
                  >
                    {classOptions.map((facultyClass) => (
                      <MenuItem key={facultyClass._id} value={facultyClass.name} style={{
                        backgroundColor: isDarkMode ? '' : '#333',
                        color: isDarkMode ? '#000' : '#fff',

                      }}>
                        {facultyClass.name}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              </FormControl>
            </FormGroup>

          </Form>
        </ModalBody>
        <ModalFooter style={{ background: !isDarkMode ? '#333' : '#f8f9fa', color: !isDarkMode ? '#fff' : '#000' }}>
          <AwesomeButton type="primary" className="mx-auto d-block" onReleased={createFacultyMember}>
            Create Faculty
          </AwesomeButton>
          <AwesomeButton type="secondary" onReleased={toggleAddFacultysModal} className="d-block mx-auto">
            Cancel
          </AwesomeButton>
        </ModalFooter>
      </Modal>
    </div>
  ), [createFacultyMember, isHOD, toggleAddFacultysModal, isDarkMode, classOptions, handleClassSelection, editClasses, setNewFaculty, newFaculty, dropdownOpen, showPassword, isAddFacultyModalOpen, setFac,]);

  const editModal = (
    <div className='std-mgmt123'>
      <Modal isOpen={isModalOpen} toggle={cancelEdit}>
        <ModalHeader toggle={cancelEdit} style={{ background: isDarkMode ? '#f8f9fa' : '#333', color: isDarkMode ? '#000' : '#fff' }}>
          Update Faculties      </ModalHeader>

        <ModalBody style={{ background: isDarkMode ? '#fff' : '#333', color: isDarkMode ? '#00' : '#fff' }}>
          <Form>
            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label for="name">Update Name:</Label>
                  <Input
                    type="text"
                    id="name"
                    placeholder="Enter Name"
                    style={{ background: isDarkMode ? '#fff' : '#333', color: isDarkMode ? '#000' : '#fff' }}
                    required
                    value={editFaculty ? editFaculty.name : ''}
                    onChange={(e) => setEditFaculty({ ...editFaculty, name: e.target.value })}
                  />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="id"> Update ID:</Label>
                  <Input
                    type="text"
                    id="id"
                    placeholder="Enter ID"
                    style={{ background: isDarkMode ? '#fff' : '#333', color: isDarkMode ? '#000' : '#fff' }}
                    required
                    value={editFaculty ? editFaculty.id : ''}
                    onChange={(e) => setEditFaculty({ ...editFaculty, id: e.target.value })}
                  />
                </FormGroup>
              </Col>
              <Col md={8} >
                <FormControl fullWidth variant="outlined" margin="normal">
                  <InputLabel id="demo-multiple-chip-label" style={{ color: isDarkMode ? '#000' : '#fff' }}> Update Role:</InputLabel>
                  <Select
                    labelId="demo-multiple-chip-label"
                    open={updateDropdownOpen}
                    onClose={toggleUpdateDropdown}
                    onOpen={toggleUpdateDropdown}
                    value={editRole}
                    input={<OutlinedInput id="select-multiple-chip" label="Chip" />}

                    onChange={(e) => setFac(e.target.value)}
                    style={{

                      color: !isDarkMode ? '#fff' : '#000',
                    }}
                  >
                    <MenuItem value="HOD" >HOD</MenuItem>
                    <MenuItem value="Teacher" >Teacher</MenuItem>
                  </Select>
                </FormControl>

              </Col>
            </Row>
            <Col md={8} >
              <FormGroup>
                <Label for="password">Update Password:</Label>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  placeholder="Update Password"
                  required
                  style={{ background: isDarkMode ? '#fff' : '#333', color: isDarkMode ? '#00' : '#fff' }}
                  value={editFaculty ? editFaculty.password : ''}
                  onChange={(e) => setEditFaculty({ ...editFaculty, password: e.target.value })}
                />
                <Button
                  type="button"
                  color="secondary"
                  onClick={() => setShowPassword(!showPassword)}
                  className="mt-2 w-50"
                >
                  {showPassword ? 'Hide Password' : 'Show Password'}
                </Button>
              </FormGroup>
            </Col>
            <FormGroup>
              <Label for="assignedClasses"> Update Assigned Classes:</Label>
              {/* {console.log(isHOD)} */}
              <FormControl fullWidth>
                {isHOD ? (
                  <Chip
                    label="All Classes (HOD)"
                    style={{
                      backgroundColor: isDarkMode ? '#fff' : '#333',
                      color: isDarkMode ? '#000' : '#fff',
                    }}
                    disabled
                  />
                ) : (
                  <Select
                    id="assignedClasses"
                    multiple
                    placeholder='Select Claases'
                    required
                    value={editClasses}
                    style={{
                      backgroundColor: isDarkMode ? '#fff' : '#333',
                      color: isDarkMode ? '#000' : '#fff',
                      margin: '2px',
                    }}
                    onChange={handleClassSelection}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip
                            key={value}
                            label={value}
                            style={{

                              color: isDarkMode ? '#000' : '#fff',
                              margin: '2px',
                            }}
                          />
                        ))}
                      </Box>
                    )}
                  >
                    {classOptions.map((facultyClass) => (
                      <MenuItem key={facultyClass._id} value={facultyClass.name} style={{
                        backgroundColor: isDarkMode ? '' : '#333',
                        color: isDarkMode ? '#000' : '#fff',

                      }}>
                        {facultyClass.name}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              </FormControl>
            </FormGroup>

          </Form>
        </ModalBody>
        <ModalFooter style={{ background: !isDarkMode ? '#333' : '#f8f9fa', color: !isDarkMode ? '#fff' : '#000' }}>
          <AwesomeButton type="primary" className="mx-auto d-block" onReleased={updateFacultyMember}>
            
            Update Faculty
          </AwesomeButton>
          <AwesomeButton type="secondary" onReleased={cancelEdit} className="d-block mx-auto">
            Cancel
          </AwesomeButton>
        </ModalFooter>
      </Modal>
    </div>
  )



// console.log(props.userData)

  return ( 
    <div className='mt-4'>
     <Typography variant="h5" align="center" className='mt-4 w-75 mx-auto' style={{ backgroundColor: isDarkMode ? '#f8f9fa' : '#333', color: isDarkMode ? '#000' : '#fff',border: isDarkMode ? '1px solid #000' : '1px solid #fff' }} gutterBottom>
        Faculty Management
      </Typography>


      <AwesomeButton type="danger" onReleased={toggleAddFacultysModal} className="d-block mb-1"> <PlusIcon />  Add New Faculty</AwesomeButton>
      {addFaculty}
      <div style={{ overflowX: 'auto',width: '99vw',margin: 'auto' }}>
       
        <Table responsive bordered hover size="md" className="text-center" dark={!isDarkMode}   >
          <thead>
            <tr >
              <th>Name</th>
              <th>ID</th>
              <th>Role</th>
              <th>Assigned Classes</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {faculties.map((faculty) => (
              <tr key={faculty._id}>
                <td>{faculty.name}</td>
                <td>{faculty.id}</td>
                <td>{faculty.role}</td>
                <td>
                  {faculty.assignedClasses && faculty.assignedClasses.length > 0
                    ? faculty.assignedClasses.join(', ')
                    : 'None'}
                </td>
                <td>
                  <AwesomeButton
                    type="primary"
                    onReleased={() => editFacultyMember(faculty)}
                    className="mx-2"
                  ><EditIcon/>
                    Edit
                  </AwesomeButton>
                  <AwesomeButton
                    type="secondary"
                    onReleased={() => deleteFacultyMember(faculty._id)}
                    className="mx-2"
                  >
                    Delete
                  </AwesomeButton>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {editModal}
    </div>
  );
}

export default FacultyManagement;
