import React, { useState, useEffect } from 'react';
import axios from 'axios';

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

  useEffect(() => {
    axios.get('/faculty').then((response) => {
      setFacultyList(response.data);
    });

    axios.get('/getclasses').then((response) => {
      setAvailableClasses(response.data);
    });
  }, []);

   const createFacultyMember = async () => {
    // Create a new faculty member with the provided data
    const newFacultyData = {
      name: newFaculty.name,
      id: newFaculty.id,
      assignedClasses: editClasses, // Use the edited classes (selected classes)
      role: editRole, // Use the edited role
      password: newFaculty.password,
    };
// console.log(newFacultyData);
    await axios
      .post('/faculty', newFacultyData)
      .then((response) => {
        // console.log('Faculty member created successfully:', response.data);

        // Add the newly created faculty member to the list
        console.log(facultyList);
        
        setFacultyList([...facultyList, response.data]);

        // Reset only the name, id, and password fields
        setNewFaculty({
          ...newFaculty,
          name: '',
          id: '',
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
  
    // Initialize newFaculty with the faculty data
    setNewFaculty({
      name: faculty.name,
      id: faculty.id,
      assignedClasses: faculty.assignedClasses || [],
      role: faculty.role,
      password: '', // Don't include the password in the editing form
    });
  };
  

  const updateFacultyMember = () => {
    const updatedFaculty = {
      _id: editFaculty._id,
      name: newFaculty.name,
      id: newFaculty.id,
      assignedClasses: editClasses,
      role: editRole,
      password: newFaculty.password,
    };

    axios
      .put(`/faculty/${editFaculty._id}`, updatedFaculty)
      .then((response) => {
        console.log('Faculty member updated successfully:', response.data);
        setEditFaculty(null);
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
  };

  const deleteFaculty = (facultyId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this faculty member?');
    if (confirmDelete) {
      axios.delete(`/faculty/${facultyId}`).then(() => {
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

  return (
    <div>
      <h1>Faculty Management</h1>
      <div>
        <h2>Create/Edit Faculty Member</h2>
        <input
          type="text"
          required
          placeholder="Name"
          value={newFaculty.name}
          onChange={(e) => setNewFaculty({ ...newFaculty, name: e.target.value })}
        />
        <input
          type="text"
          required
          placeholder="ID"
          value={newFaculty.id}
          onChange={(e) => setNewFaculty({ ...newFaculty, id: e.target.value })}
        />
        <div>
          <label>Role:</label>
          <select
            style={{ width: '55%' }}
            value={editRole}
            required
            onChange={(e) => setEditRole(e.target.value)}
          >
            <option value="SelectRole">Select Role Of Faculty</option>
            <option value="Teacher">Teacher</option>
            <option value="HOD">HOD</option>
          </select>
        </div>
        <input
          required
          type="password"
          placeholder="Password"
          value={newFaculty.password}
          onChange={(e) => setNewFaculty({ ...newFaculty, password: e.target.value })}
        />
        <div>
          <label>Assigned Classes:</label>
          <select multiple required onChange={handleClassSelection} style={{ width: '55%' }} value={editClasses}>
            
            {availableClasses.map((facultyClass) => (
              <option
                key={facultyClass._id}
                value={facultyClass.name}
                selected={editClasses.includes(facultyClass.name)}
              >
                {facultyClass.name}
              </option>
            ))}
          </select>
        </div>
        {editFaculty ? (
          <div>
            <button onClick={updateFacultyMember}>Update Faculty</button>
            <button onClick={cancelEdit}>Cancel</button>
          </div>
        ) : (
          <button onClick={createFacultyMember}>Create Faculty</button>
        )}
      </div>
      <div>
      <h2>Faculty List</h2>
<ul>
  {facultyList.map((faculty) => (
    <li key={faculty._id}>
      {editFaculty === faculty ? (
        <>
          <input
            type="text"
            value={newFaculty.name}
            onChange={(e) => setNewFaculty({ ...newFaculty, name: e.target.value })}
          />
          <input
            type="text"
            value={newFaculty.id}
            onChange={(e) => setNewFaculty({ ...newFaculty, id: e.target.value })}
          />
          <input
            type="password"
            placeholder='Password'
            value={newFaculty.password}
            onChange={(e) => setNewFaculty({ ...newFaculty, password: e.target.value })}
          />
        </>
      ) : (
        <>
          {faculty.name} ({faculty.id})
          <br />
          Role: {faculty.role}
          <br />
          Assigned Classes: {faculty.assignedClasses && faculty.assignedClasses.length > 0
            ? faculty.assignedClasses.join(', ')
            : 'None'}

          <button onClick={() => editFacultyMember(faculty)}>Edit</button>
          <button onClick={() => deleteFaculty(faculty._id)}>Delete</button>
        </>
      )}
    </li>
  ))}
</ul>

      </div>
    </div>
  );
}

export default FacultyManagement;
