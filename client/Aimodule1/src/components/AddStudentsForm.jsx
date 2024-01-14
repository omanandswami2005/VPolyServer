  import React, { useState, useEffect,useRef } from 'react';
  import { Form, Button, Row, Col, Container, } from 'react-bootstrap'; // Import Spinner
  import axios from 'axios';
  import toast from 'react-hot-toast';
  import { useDropzone } from 'react-dropzone';
  import * as XLSX from 'xlsx';
  import MutatingDotsSpinner from './Spinners/MutatingDotsSpinner';

  function AddStudentForm() {
    const [studentData, setStudentData] = useState([
      {
        name: '',
        enrollmentNo: '',
      },
    ]);
    const [classOptions, setClassOptions] = useState([]);
    const [selectedClass, setSelectedClass] = useState('');
    const [classId, setClassId] = useState('');
    const [loading, setLoading] = useState(false); // Add loading state
    const formRef = useRef(null);
    // const lastFormFieldRef = useRef(null);


    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      onDrop: (acceptedFiles) => {
        handleExcelUpload(acceptedFiles);
      },
    });

    const handleGoToBottom = () => {
      if (formRef.current) {
        formRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }
    };
    
    const handleGoToUP = () => {
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

    
    useEffect(() => {
      console.log('Updated studentData:', studentData);
    }, [studentData]);

    useEffect(() => {
      axios.get('/class').then((response) => {
        setClassOptions(response.data);
      });
    }, []);

    const handleCancelStudent = (index) => {
      const updatedStudentData = [...studentData];
      updatedStudentData.splice(index, 1);
      setStudentData(updatedStudentData);
    };

    const handleClassChange = (e) => {
      const selectedClass = e.target.value;
      setSelectedClass(selectedClass);
      const selectedClassId = classOptions.find((option) => option.name === selectedClass)?._id;
      setClassId(selectedClassId);
    };

    const handleStudentSubmit = async (e) => {
      e.preventDefault();
      try {
        setLoading(true); // Set loading to true before making the request
         // Sort student data based on enrollment numbers before processing
    const sortedStudentData = studentData
    .slice() // Create a copy to avoid modifying the original array
    .sort((a, b) => a.enrollmentNo - b.enrollmentNo);
        console.log('studentData:', studentData);
        const responses = await Promise.all(
          sortedStudentData.map(async (student, index) => {
            console.log('student:', student);
            const response = await axios.post('/student', {
              name: student.name,
              enrollmentNo: student.enrollmentNo,
              class: classId,
              rollNo: index + 1, 

            });
            return response.data;
          })
        );
        console.log('Students added successfully, Please Refresh with Refresh Button', responses);
        toast.success('Added Successfully, Please Use Refresh Button');
        setStudentData([]);
      } catch (error) {
        console.log('Error adding students', error);
        toast.error('Already Present In DB');
      } finally {
        setLoading(false); // Set loading to false after the request is complete
      }
    };

    const handleAddStudent = () => {
      setStudentData([...studentData, { name: '', enrollmentNo: '' }]);
    };

    const handleStudentChange = (index, field, value) => {
      const updatedStudentData = [...studentData];
      updatedStudentData[index][field] = value;
      setStudentData(updatedStudentData);
    };

    const handleExcelUpload = async (files) => {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          const excelData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
          const [headers, ...rows] = excelData;
          const studentsFromExcel = rows.map((row) => {
            const student = {};
            headers.forEach((header, index) => {
              student[header] = row[index];
            });
            return student;
          });
          console.log(studentsFromExcel);
          setStudentData(studentsFromExcel);
        } catch (error) {
          console.error('Error processing Excel file', error);
          toast.error('Error processing Excel file');
        }
      };
      reader.readAsArrayBuffer(file);
    };

    return (
      <>
        <h1 className="text-center my-3 d-block bg-dark text-white w-75 mx-auto border">Add Student/es</h1>
        <Container className="my-3" ref={formRef}>
          <Form onSubmit={handleStudentSubmit}>
          {studentData.length > 10 && (
          <Row className="mb-3">
            <Col>
              <Button variant="secondary" onClick={handleGoToBottom}>
                Go to Bottom
              </Button>
            </Col>
          </Row>
        )}
            <Row className="mb-3">
              <Col>
                <Form.Select
                  value={selectedClass}
                  required
                  onChange={handleClassChange}
                  className="w-50"
                >
                  <option value="">Select Class</option>
                  {classOptions.map((option) => (
                    <option key={option._id} value={option.name}>
                      {option.name}
                    </option>
                  ))}
                </Form.Select>
              </Col>
            </Row>

            {studentData.map((student, index) => (
              <Row key={index} className="mb-3">
                <Col md={6} className="mb-2">
                  <Form.Control
                    type="text"
                    placeholder="Name"
                    required
                    value={student['name']}
                    onChange={(e) => handleStudentChange(index, 'name', e.target.value)}
                    className="w-75 mx-auto"
                  />
                </Col>
              
                <Col md={6} className="mb-2">
                  <Form.Control
                    type="number"
                    placeholder="Enrollment No"
                    value={student['enrollmentNo']}
                    onChange={(e) => handleStudentChange(index, 'enrollmentNo', e.target.value)}
                    className="w-75 mx-auto"
                  />
                </Col>
                {studentData.length > 1 && (
                  <Col md={3} className="">
                    <Button
                      variant="warning"
                      onClick={() => handleCancelStudent(index)}
                      className="w-100 mx-auto"
                    >
                      Cancel
                    </Button>
                  </Col>
                )}
              </Row>
            ))}

            <Row className="mb-3">
              <Col>
                <Button variant="primary" onClick={handleAddStudent}>
                  Add More Student
                </Button>
              </Col>
            </Row>
            <Row>
              <Col>
              <Button variant="success" type="submit" disabled={studentData.length === 0}>
                  Add Students
                </Button> 
              </Col>
            </Row>
            {studentData.length > 10 && (
          <Row className="mb-3">
            <Col>
              <Button variant="secondary" onClick={handleGoToUP}>
                Go to Bottom
              </Button>
            </Col>
          </Row>
        )}
            
            <Row className="w-100 mx-auto border mt-3  text-center bg-light rounded-3">
              <Col>
              
                <a href="#" className=''>
                  <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''}`}>
                    <input {...getInputProps()} />
                    <p>Drag 'n' drop an Excel file here, or click to select one</p>
                  </div>
                </a>
              </Col>
            </Row>
          </Form>
        </Container>
        {loading && 
              <MutatingDotsSpinner/>
            }
      </>
    );
  }

  export default AddStudentForm;
