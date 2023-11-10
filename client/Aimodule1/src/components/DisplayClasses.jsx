import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

function DisplayClasses() {
  const [classOptions, setClassOptions] = useState([]);
  const [updateClassData, setUpdateClassData] = useState({
    id: '',
    name: '',
  });
  const [isUpdateFormVisible, setUpdateFormVisible] = useState(false);

  useEffect(() => {
    fetchClassOptions();
  }, []);

  const fetchClassOptions = () => {
    axios.get('/getclasses').then((response) => {
      setClassOptions(response.data);
    });
  };

  const openUpdateForm = (classId, className) => {
    setUpdateClassData({ id: classId, name: className });
    setUpdateFormVisible(true);
  };

  const closeUpdateForm = () => {
    setUpdateFormVisible(false);
  };

  const handleUpdateClass = () => {
    // Send a PUT request to update the class with the new data.
    const { id, name } = updateClassData;
    axios.put(`/updateclass/${id}`, { name })
      .then((response) => {
        // Handle the success case.
        console.log(`Class with ID ${id} updated successfully.`);
        toast.success('Updated Successfully');
        // Close the update form and refresh the class list after the update.
        closeUpdateForm();
        fetchClassOptions();
      })
      .catch((error) => {
        // Handle any errors.
        toast.error('Failed to Update');

        console.error(`Error updating class with ID ${id}: ${error}`);
      });
  };

  const handleDeleteClass = (classId) => {
    // Handle the delete action (e.g., show a confirmation dialog).
    // Implement the delete functionality according to your requirements.
    // After confirming, you can call an API to delete the class.
    const confirmDelete = window.confirm('Are you sure you want to delete this class?');
if (confirmDelete) {
    // Send a DELETE request to delete the class.
    axios.delete(`/deleteclass/${classId}`)
      .then((response) => {
        // Handle the success case.
        console.log(`Class with ID ${classId} deleted successfully.`);
        // Refresh the class list after deletion.
        fetchClassOptions();
      })
      .catch((error) => {
        // Handle any errors.
        console.error(`Error deleting class with ID ${classId}: ${error}`);
      });}
  };

  return (
    <div>
      <h2>Display Classes</h2>
      <ul>
        {classOptions.map((option) => (
          <li key={option._id}>
            {option.name}
            <button onClick={() => openUpdateForm(option._id, option.name)}>Update</button>
            <button onClick={() => handleDeleteClass(option._id)}>Delete</button>
          </li>
        ))}
      </ul> 

      {isUpdateFormVisible && (
        <div>
          <h3>Update Class</h3>
          <input
            type="text"
            value={updateClassData.name}
            onChange={(e) => setUpdateClassData({ ...updateClassData, name: e.target.value })}
          />
          <button onClick={handleUpdateClass}>Save</button>
          <button onClick={closeUpdateForm}>Cancel</button>
        </div>
      )}
    </div>
  );
}

export default DisplayClasses;
