import React, { useState } from 'react';
import axios from 'axios';
import { Col, Row, Card, CardBody, CardTitle, Spinner } from 'reactstrap';
import toast from 'react-hot-toast';
import { useData } from '../DataContext';
import { AwesomeButton } from 'react-awesome-button';
import 'react-awesome-button/dist/styles.css'; // Import the styles for AwesomeButton
import { TrashIcon,PlusIcon,ZapIcon } from "@primer/octicons-react"; // custom icons

import '../styles/AddClassForm.css';

function AddClassForm() {
  const [classNames, setClassNames] = useState(['']);
  const [loading, setLoading] = useState(false);
  const { classOptions, fetchAll } = useData();

  const preventDefault = (e) => e.preventDefault();
 
  const handleClassSubmit = async (e) => {
    e.preventDefault();


    if (classNames.some(className => className.trim() === '')) {
      toast.error('Please fill in all class names.');
      return;
    }

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
      setLoading(true);

      const response = await axios.post(apiUrl, { classNames });
      console.log('Classes added successfully', response.data);
      toast.success('Added Successfully');
      setClassNames(['']);
      fetchAll();
    } catch (error) {
      console.error('Error adding classes', error);
      toast.error('Sorry, something went wrong. Please try again.');
    } finally {
      setLoading(false);
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
    <div className="my-1 add-class-form border border-dark rounded border-3 mx-auto">
      <Card className="border-0 shadow add-class-card" style={{ maxHeight: '55vh', overflowY: 'auto' }}>
        <CardBody>
          <CardTitle tag="h2" className="text-center text-white bg-dark mb-4 rounded">
            Add Class/es
          </CardTitle>
          <form onSubmit={preventDefault} >
            {classNames.map((className, index) => (
              <div key={index} className="mb-3 row">
                <label htmlFor={`className${index + 1}`} className="col-sm-3 col-form-label">
                  Class {index + 1} :
                </label>
                <div className="col-sm-8 d-flex align-items-center">
                  <input
                    type="text"
                    
                    placeholder={`Enter Class Name ${index + 1}`}
                    value={className}
                    onChange={(e) => handleClassChange(index, e.target.value)}
                    className="w-100 text-center border border-dark rounded me-1"
                  />
                  <AwesomeButton
                    type="secondary"
                    onPress={() => handleCancelClassField(index)}
                    disabled={classNames.length === 1}
                    className="aws-btn"
                    
                  >
                    <TrashIcon />
                     Cancel
                  </AwesomeButton>
                </div>
              </div>
            ))}
            <Row className="mx-auto w-100">
              <Col sm={{ size: 10, offset: 1 }} className="d-flex justify-content-end">
                <AwesomeButton type="primary" onPress={handleClassSubmit}  style={{ fontSize: '100%' }}  className="aws-btn ">
                <ZapIcon />
                   Add Classes
                </AwesomeButton>
                <AwesomeButton type="danger" onPress={handleAddClassField} className="ms-1 aws-btn w=100">
                <PlusIcon size={20} />
                   Add More Class
                </AwesomeButton>
              </Col>
            </Row>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}

export default AddClassForm;
