import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  Button,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  ListGroup,
  ListGroupItem,
  Row,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';
import '../styles/FacultyCRUD.css';
function FacultyManagement() {
  const [facultyList, setFacultyList] = useState([]);
  const [newFaculty, setNewFaculty] = useState({
    name: '',
    id: '',
    assignedClasses: [],
    role: 'Select Role',
    password: '',
  });
  const [availableClasses, setAvailableClasses] = useState([]);
  const [editFaculty, setEditFaculty] = useState(null);
  const [editClasses, setEditClasses] = useState([]);
  const [editRole, setEditRole] = useState('');
  const [isModalOpen, setModalOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isHOD, setIsHOD] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [updateDropdownOpen, setUpdateDropdownOpen] = useState(false);

  useEffect(() => {
    axios.get('/faculty').then((response) => {
      setFacultyList(response.data);
    });

    axios.get('/class').then((response) => {
      setAvailableClasses(response.data);
    });

  }, []);

  const toggleDropdown = () => setDropdownOpen((prevState) => !prevState);
  const toggleUpdateDropdown = () => setUpdateDropdownOpen((prevState) => !prevState);

  const createFacultyMember = async () => {
    if (!newFaculty.name || !newFaculty.id || !newFaculty.role || !newFaculty.password) {
      toast.error('Please fill in all the required fields.');
      return;
    }
    if (facultyList.some((faculty) => faculty.id === newFaculty.id)) {
      toast.error('Faculty ID already exists. Please choose a different ID.');
      return;
    }
    if (facultyList.some((faculty) => faculty.name === newFaculty.name)) {
      toast.error('Faculty with the same Name already exists. Please enter a different Name.');
      return;
    }

    const newFacultyData = {
      name: newFaculty.name,
      id: newFaculty.id,
      assignedClasses: newFaculty.role === 'HOD' ? availableClasses.map((facultyClass) => facultyClass.name) : editClasses,
      role: newFaculty.role,
      password: newFaculty.password,
    };

    await axios
      .post('/faculty', newFacultyData)
      .then((response) => {
        toast.success('Faculty Added Successfully!');
        setFacultyList([...facultyList, response.data]);
        setNewFaculty({
          name: '',
          id: '',
          assignedClasses: [],
          role: 'Select Role',
          password: '',
        });
      })
      .catch((error) => {
        console.error('Error creating faculty member:', error);
      });
  };

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
      assignedClasses: editRole === 'HOD' ? availableClasses.map((facultyClass) => facultyClass.name) : editClasses,
      role: editRole,
      password: editFaculty.password,
    };

    axios
      .put(`/faculty/${editFaculty._id}`, updatedFaculty)
      .then(() => {
        toast.success('Faculty Updated Successfully!');
        setEditFaculty(null);
        setModalOpen(false);
        axios.get('/faculty').then((response) => {
          setFacultyList(response.data);
        });
      })
      .catch((error) => {
        console.error('Error updating faculty member:', error);
      });
  };

  const cancelEdit = () => {
    setEditFaculty(null);
    setModalOpen(false);
  };

  const deleteFaculty = (facultyId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this faculty member?');
    if (confirmDelete) {
      axios.delete(`/faculty/${facultyId}`).then(() => {
        toast.success('Faculty Deleted Successfully!');
        setFacultyList(facultyList.filter((faculty) => faculty._id !== facultyId));
      });
    }
  };

  const handleClassSelection = (event) => {
    const selectedClassIds = Array.from(event.target.options)
      .filter((option) => option.selected)
      .map((option) => option.value);

    setEditClasses(selectedClassIds);
  };

  const setFac = (e) => {
    if (e === 'HOD') {
      setEditRole(e);
      setNewFaculty({
        ...newFaculty,
        role: e,
        assignedClasses: availableClasses.map((facultyClass) => facultyClass.name),
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
  };

  return (
    <div className='mgmt-main '>
      <h1 className='mgmt-title text-center bg-info rounded text-white border w-100 mx-auto mt-2'>Faculties Management</h1>
      <div className='std-mgmt123'>
      
        <h2 className="text-center my-3 d-block bg-dark text-white w-75 mx-auto border">Add Faculties</h2>
        <Form>
          <Row>
            <Col md={4}>
              <FormGroup>
                <Label for="name">Name</Label>
                <Input
                  type="text"
                  id="name"
                  placeholder="Enter Name"
                  required
                  value={newFaculty.name}
                  onChange={(e) => setNewFaculty({ ...newFaculty, name: e.target.value })}
                />
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label for="id">ID</Label>
                <Input
                  type="text"
                  id="id"
                  placeholder="Enter ID"
                  required
                  value={newFaculty.id}
                  onChange={(e) => setNewFaculty({ ...newFaculty, id: e.target.value })}
                />
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label for="role">Role</Label>
                <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown} onMouseLeave={toggleDropdown}>
                  <DropdownToggle caret onMouseOver={toggleDropdown} onClick={toggleDropdown} style={{ backgroundColor: '#007bff', color: '#ffffff' }}>
                    {newFaculty.role}
                  </DropdownToggle >
                  <DropdownMenu>
                    <DropdownItem onClick={() => setFac('HOD')}>HOD</DropdownItem>
                    <DropdownItem onClick={() => setFac('Teacher')}>Teacher</DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </FormGroup>

            </Col>
          </Row>
          <FormGroup>
            <Label for="password">Password</Label>
            <Input
              type={showPassword ? 'text' : 'password'}
              id="password"
              placeholder="Enter Password"
              required
              value={newFaculty.password}
              onChange={(e) => setNewFaculty({ ...newFaculty, password: e.target.value })}
            />
            <Button
              type="button"
              color="secondary"
              onClick={() => setShowPassword(!showPassword)}
              className="mt-2"
            >
              {showPassword ? 'Hide Password' : 'Show Password'}
            </Button>
          </FormGroup>
          <FormGroup>
            <Label for="assignedClasses">Assigned Classes</Label>
            {isHOD ? (
              <Input
                type="text"
                id="assignedClasses"
                value="All Classes (HOD)"
                readOnly
                disabled
              />
            ) : (
              <Input
                type="select"
                id="assignedClasses"
                multiple
                required
                onChange={handleClassSelection}
                value={editClasses}
              >
                {availableClasses.map((facultyClass) => (
                  <option key={facultyClass._id} value={facultyClass.name}>
                    {facultyClass.name}
                  </option>
                ))}
              </Input>
            )}
          </FormGroup>
          <Button color="primary" className="mx-auto d-block" onClick={createFacultyMember}>
            Create Faculty
          </Button>
        </Form>
      </div>
      <hr />
      <div>
        <h2 className="text-center bg-dark text-light w-50 mx-auto border border-white">Faculties List</h2>
        <ListGroup>
          {facultyList.map((faculty) => (
            <ListGroupItem key={faculty._id}>
              <>
                <h4> Name: {faculty.name} ({faculty.id})</h4>
                <h6>Role: {faculty.role}</h6>
                <h6>
                  Assigned Classes:{' '}
                  {faculty.assignedClasses && faculty.assignedClasses.length > 0
                    ? faculty.assignedClasses.join(', ')
                    : 'None'}
                </h6>
                <Button color="primary" onClick={() => editFacultyMember(faculty)} className="mx-2">
                  Edit
                </Button>
                <Button color="danger" onClick={() => deleteFaculty(faculty._id)} className="mx-2">
                  Delete
                </Button>
              </>
            </ListGroupItem>
          ))}
        </ListGroup>
      </div>
      <Modal isOpen={isModalOpen} toggle={cancelEdit} className=' ' style={{ maxWidth: '700px', margin: '0 auto' }}>
        <ModalHeader toggle={cancelEdit}>Update Faculty</ModalHeader>
        <ModalBody>
          <Form>
            <Row>
              <Col md={4}>
                <FormGroup>
                  <Label for="modalName">Name</Label>
                  <Input
                    type="text"
                    id="modalName"
                    value={editFaculty ? editFaculty.name : ''}
                    onChange={(e) => setEditFaculty({ ...editFaculty, name: e.target.value })}
                  />
                </FormGroup>
              </Col>
              <Col md={4}>
                <FormGroup>
                  <Label for="modalId">ID</Label>
                  <Input
                    type="text"
                    id="modalId"
                    value={editFaculty ? editFaculty.id : ''}
                    onChange={(e) => setEditFaculty({ ...editFaculty, id: e.target.value })}
                  />
                </FormGroup>
              </Col>
              <Col md={4}>
              <FormGroup>
                <Label for="">Role</Label>
                <Dropdown isOpen={updateDropdownOpen} toggle={toggleUpdateDropdown} onMouseLeave={toggleUpdateDropdown}>
                  <DropdownToggle caret onMouseOver={toggleUpdateDropdown} onClick={toggleUpdateDropdown} style={{ backgroundColor: '#007bff', color: '#ffffff' }}>
                    {editRole}
                  </DropdownToggle>
                  <DropdownMenu>
                    <DropdownItem onClick={() => setFac('HOD')}>HOD</DropdownItem>
                    <DropdownItem onClick={() => setFac('Teacher')}>Teacher</DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </FormGroup>
              </Col>
            </Row>
            <FormGroup>
              <Label for="modalPassword">Password</Label>
              <Input
                type={showPassword ? 'text' : 'password'}
                id="modalPassword"
                placeholder="Enter New Password"
                value={editFaculty ? editFaculty.password : ''}
                onChange={(e) => setEditFaculty({ ...editFaculty, password: e.target.value })}
              />
              <Button
                type="button"
                color="secondary"
                onClick={() => setShowPassword(!showPassword)}
                className="mt-2"
              >
                {showPassword ? 'Hide Password' : 'Show Password'}
              </Button>
            </FormGroup>
            {editRole === 'HOD' ? (
              <FormGroup>
                <Label for="modalAssignedClasses">Assigned Classes</Label>
                <Input
                  type="text"
                  id="modalAssignedClasses"
                  value="All Classes (HOD)"
                  readOnly
                  disabled
                />
              </FormGroup>
            ) : (
              <FormGroup>
                <Label for="modalAssignedClasses">Assigned Classes</Label>
                <Input
                  type="select"
                  id="modalAssignedClasses"
                  multiple
                  required
                  onChange={handleClassSelection}
                  value={editClasses}
                >
                  {availableClasses.map((facultyClass) => (
                    <option key={facultyClass._id} value={facultyClass.name}>
                      {facultyClass.name}
                    </option>
                  ))}
                </Input>
              </FormGroup>
            )}
          </Form>
        </ModalBody>

        <ModalFooter>
          <Button color="primary" onClick={updateFacultyMember} className="mx-2 d-block mx-auto">
            Update Faculty
          </Button>
          <Button color="secondary" onClick={cancelEdit} className="d-block mx-auto">
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default FacultyManagement;
