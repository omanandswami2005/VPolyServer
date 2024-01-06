import React, { useState } from 'react';
import axios from 'axios';
import { Button, Form, FormGroup, Label, Input, Col } from 'reactstrap';
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
      <hr />
       <h2 className="text-center my-3 d-block bg-dark text-white w-75 mx-auto border">Add Class/es</h2>
      <Form onSubmit={handleClassSubmit}>
        {classNames.map((className, index) => (
          <FormGroup row key={index}>
            <Label sm={6} for={`className${index + 1}`}>Class Name {index + 1} :</Label>
            <Col sm={9} className="d-flex align-items-center w-100 mx-auto">
              <Input
                type="text"
                required
                placeholder={`Enter Class Name ${index + 1}`}
                value={className}
                onChange={(e) => handleClassChange(index, e.target.value)}
                className="mx-1 w-75"
              />
              <Button
                type="button"
                color="danger"
                onClick={() => handleCancelClassField(index)}
                disabled={classNames.length === 1}
                className="ml-2"
              >
                Cancel
              </Button>
            </Col>
          </FormGroup>
        ))}
        
        <FormGroup row className=' w-100 mx-auto'>
          <Col sm={{ size: 10, offset: 2 }}  >
            <Button type="submit" color="success" className='mx-2'>
              Add Classes
            </Button>
         
            <Button type="button" onClick={handleAddClassField} color="primary">
              Add More Class
            </Button>
          </Col>
        </FormGroup>
      </Form>
    </div>
  );
}

export default AddClassForm;
