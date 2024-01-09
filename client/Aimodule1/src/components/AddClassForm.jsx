import React, { useState } from 'react';
import axios from 'axios';
import { Button, Form, FormGroup, Label, Input, Col, Row, Card, CardBody, CardTitle, Spinner } from 'reactstrap';
import toast from 'react-hot-toast';
import { useData } from '../DataContext';

import '../styles/AddClassForm.css';

function AddClassForm() {
  const [classNames, setClassNames] = useState(['']);
  const [loading, setLoading] = useState(false);
  const { classOptions, fetchAll } = useData();

  const handleClassSubmit = async (e) => {
    e.preventDefault();

    // Check if any class name in classNames array already exists in classOptions
    setLoading(true);
    const isAlreadyPresent = classNames.some(className => classOptions.some(option => option.name === className));

    if (isAlreadyPresent) {
      toast.error('Already Present In DB');
      setLoading(false);
      return;
    }

    const apiUrl = '/class';

    try {
      setLoading(true); // Set loading to true when making the request

      const response = await axios.post(apiUrl, { classNames });
      console.log('Classes added successfully', response.data);
      toast.success('Added Successfully');
      setClassNames(['']);
      fetchAll(); // Call fetchAll after adding classes
    } catch (error) {
      console.error('Error adding classes', error);
      toast.error('Sorry, something went wrong. Please try again.');
    } finally {
      setLoading(false); // Set loading back to false after the request is complete
    }
  };

  const handleAddClassField = () => {
    setClassNames([...classNames, '']);
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
    <div className="my-1 add-class-form p-2 border border-dark rounded border-3 mx-auto ">

      <Card className="border-0 shadow add-class-card" style={{ maxHeight: '55vh', overflowY: 'auto' }}>
        <CardBody>
          <CardTitle tag="h2" className="text-center text-white bg-dark mb-4 rounded">
            Add Class/es
          </CardTitle>
          <Form onSubmit={handleClassSubmit}>
            {classNames.map((className, index) => (
              <FormGroup row key={index} className="mb-3">
                <Label sm={3} for={`className${index + 1}`} className='m-0'>
                  Class {index + 1} :
                </Label>
                <Col sm={8} className="d-flex align-items-center">
                  <Input
                    type="text"
                    required
                    placeholder={`Enter Class Name ${index + 1}`}
                    value={className}
                    onChange={(e) => handleClassChange(index, e.target.value)}
                    className="w-100 text-center border border-dark rounded me-1"
                  />
                  <Button
                    type="button"
                    color="danger"
                    onClick={() => handleCancelClassField(index)}
                    disabled={classNames.length === 1}
                  >
                    Cancel
                  </Button>
                </Col>
              </FormGroup>
            ))}
            <Row className="mx-auto w-100">
              <Col sm={{ size: 10, offset: 1 }} className="d-flex justify-content-end">
                <Button type="submit" color="success" disabled={loading} className="">
                  {loading ? <Spinner size="sm" color="light" /> : 'Add Classes'}
                </Button>
                <Button type="button" onClick={handleAddClassField} color="primary" className="ms-2">
                  Add More Class
                </Button>
              </Col>
            </Row>
          </Form>
        </CardBody>
      </Card>
    </div>
  );
}

export default AddClassForm;
