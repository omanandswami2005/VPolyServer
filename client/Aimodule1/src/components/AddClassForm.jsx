import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

function AddClassForm() {
  const [classNames, setClassNames] = useState(['']); // Initial array with one empty string for the first class.

  const handleClassSubmit = async (e) => {
    e.preventDefault();

    // Define the API endpoint where you want to send the data.
    const apiUrl = '/class'; // Replace with your actual API endpoint.

    try {
      // Make a POST request to add the classes using Axios.
      const response = await axios.post(apiUrl, { classNames });

      // Handle the response as needed (e.g., show a success message).
      console.log('Classes added successfully', response.data);
      toast.success('Added Successfully');

      // Optionally, you can reset the form after a successful submission.
      setClassNames(['']);
    } catch (error) {
      // Handle any errors that occurred during the API request (e.g., show an error message).
      console.error('Error adding classes', error);
      toast.error('Already Present In DB');
    }
  };

  const handleAddClassField = () => {
    setClassNames([...classNames, '']); // Add a new empty class name field.
  };

  const handleCancelClassField = (index) => {
    if (classNames.length > 1) {
      const updatedClassNames = [...classNames];
      updatedClassNames.splice(index, 1);
      setClassNames(updatedClassNames);
    } else {
      toast.error('At least one class is required.');
    }
  };

  const handleClassChange = (index, value) => {
    const updatedClassNames = [...classNames];
    updatedClassNames[index] = value;
    setClassNames(updatedClassNames);
  };

  return (
    <div>
      <h2>Add Classes</h2>
      <form onSubmit={handleClassSubmit}>
        {classNames.map((className, index) => (
          <div key={index}>
            <input
              type="text"
              required
              placeholder="Enter Class Name"
              value={className}
              onChange={(e) => handleClassChange(index, e.target.value)}
            />
            <button
              type="button"
              onClick={() => handleCancelClassField(index)}
              disabled={classNames.length === 1}
            >
              Cancel
            </button>
          </div>
        ))}
        <button type="button" onClick={handleAddClassField}>
          Add More Class
        </button>
        <button type="submit">Add Classes</button>
      </form>
    </div>
  );
}

export default AddClassForm;
