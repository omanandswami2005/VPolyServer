// import React, { useState, useEffect } from 'react';
// import { Form, Button, Row, Col, Container } from 'react-bootstrap';
// import axios from 'axios';
// import toast from 'react-hot-toast';

// function AddStudentForm() {
//   const [studentData, setStudentData] = useState([
//     {
//       name: '',
//       rollNo: '',
//       enrollmentNo: '',
//     },
//   ]);
//   const [classOptions, setClassOptions] = useState([]);
//   const [selectedClass, setSelectedClass] = useState('');
//   const [classId, setClassId] = useState('');

//   // Fetch class options from the server
//   useEffect(() => {
//     axios.get('/class').then((response) => {
//       setClassOptions(response.data);
//     });
//   }, []);

//   const handleCancelStudent = (index) => {
//     const updatedStudentData = [...studentData];
//     updatedStudentData.splice(index, 1);
//     setStudentData(updatedStudentData);
//   };

//   const handleClassChange = (e) => {
//     const selectedClass = e.target.value;
//     setSelectedClass(selectedClass);

//     // Find the classId for the selected class
//     const selectedClassId = classOptions.find((option) => option.name === selectedClass)?._id;
//     setClassId(selectedClassId);
//   };

//   const handleStudentSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       // Submit each student's data to the server with the selected class
//       const responses = await Promise.all(
//         studentData.map(async (student) => {
//           const response = await axios.post('/student', {
//             name: student.name,
//             rollNo: student.rollNo,
//             enrollmentNo: student.enrollmentNo,
//             class: classId,
//           });
//           return response.data;
//         })
//       );

//       // Handle the response as needed (e.g., show a success message).
//       console.log('Students added successfully', responses);
//       toast.success('Added Successfully');

//       // Optionally, you can reset the form after a successful submission.
//       setStudentData([{ name: '', rollNo: '', enrollmentNo: '' }]);
//     } catch (error) {
//       // Handle any errors that occurred during the API request (e.g., show an error message).
//       console.log('Error adding students', error);
//       toast.error('Already Present In DB');
//     }
//   };

//   const handleAddStudent = () => {
//     setStudentData([...studentData, { name: '', rollNo: '', enrollmentNo: '' }]);
//   };

//   const handleStudentChange = (index, field, value) => {
//     const updatedStudentData = [...studentData];
//     updatedStudentData[index][field] = value;
//     setStudentData(updatedStudentData);
//   };

//   return (
//     <Container className="my-3">
//       <Form onSubmit={handleStudentSubmit}>
//         <Row className="mb-3">
//           <Col>
//             <Form.Select
//               value={selectedClass}
//               required
//               onChange={handleClassChange}
//               className="w-50"
//             >
//               <option value="">Select Class</option>
//               {classOptions.map((option) => (
//                 <option key={option._id} value={option.name}>
//                   {option.name}
//                 </option>
//               ))}
//             </Form.Select>
//           </Col>
//         </Row> 
    
//         {studentData.map((student, index) => (
//           <Row key={index} className="mb-3">
//             <hr />
//             <Col md={6} className="mb-2">
//       <Form.Control
//                 type="text"
//                 placeholder="Name"
//                 required
//                 value={student.name}
//                 onChange={(e) => handleStudentChange(index, 'name', e.target.value)}
//                 className="w-75 mx-auto"
//               />
//             </Col>
//             <Col md={6} className="mb-2">
//       <Form.Control
//                 type="number"
//                 placeholder="Roll No"
//                 value={student.rollNo}
//                 onChange={(e) => handleStudentChange(index, 'rollNo', e.target.value)}
//                 className="w-75 mx-auto"
//               />
//             </Col>
//             <Col md={6} className="mb-2">
//               <Form.Control
//                 type="number"
//                 placeholder="Enrollment No"
//                 value={student.enrollmentNo}
//                 onChange={(e) => handleStudentChange(index, 'enrollmentNo', e.target.value)}
//                 className="w-75 mx-auto"
//               />
//             </Col><br />
//             {studentData.length > 1 && (
//               <Col md={3} className="">
//                 <Button variant="warning" onClick={() => handleCancelStudent(index)} className="w-100 mx-auto">
//                   Cancel
//                 </Button>
//               </Col>
//             )}
//           </Row>
//         ))}
//         <hr />
//         <Row className="mb-3">
//           <Col>
//             <Button variant="primary" onClick={handleAddStudent}>
//               Add More Student
//             </Button>
//           </Col>
//         </Row>
//         <Row>
//           <Col>
//             <Button variant="success" type="submit">
//               Add Students
//             </Button>
//           </Col>
//         </Row>
//       </Form>
//     </Container>
//   );
// }

// export default AddStudentForm;





import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Container } from 'react-bootstrap';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useDropzone } from 'react-dropzone';
import * as XLSX from 'xlsx';

// ... (other imports)

function AddStudentForm() {
  const [studentData, setStudentData] = useState([]);
  const [classOptions, setClassOptions] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [classId, setClassId] = useState('');

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    onDrop: (acceptedFiles) => {
      handleExcelUpload(acceptedFiles);
    },
  });
  
  

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
      console.log('studentData:', studentData);
      const responses = await Promise.all(
        studentData.map(async (student) => {
          console.log('student:', student);
          const response = await axios.post('/student', {
            name: student.name,
            rollNo: student.rollNo,
            enrollmentNo: student.enrollmentNo,
            class: classId,
          });
          return response.data;
        })
      );
      console.log('Students added successfully', responses);
      toast.success('Added Successfully');
      setStudentData([]);
    } catch (error) {
      console.log('Error adding students', error);
      toast.error('Already Present In DB');
    }
  };

  const handleAddStudent = () => {
    setStudentData([...studentData, { name: '', rollNo: '', enrollmentNo: '' }]);
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
    <Container className="my-3">
      <Form onSubmit={handleStudentSubmit}>
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
        value={student['name']} // 'Name' is the header from Excel
        onChange={(e) => handleStudentChange(index, 'name', e.target.value)}
        className="w-75 mx-auto"
      />
    </Col>
    <Col md={6} className="mb-2">
      <Form.Control
        type="number"
        placeholder="Roll No"
        value={student['rollNo']} // 'Roll No' is the header from Excel
        onChange={(e) => handleStudentChange(index, 'rollNo', e.target.value)}
        className="w-75 mx-auto"
      />
    </Col>
    <Col md={6} className="mb-2">
      <Form.Control
        type="number"
        placeholder="Enrollment No"
        value={student['enrollmentNo']} // 'Enrollment No' is the header from Excel
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
            <Button variant="success" type="submit">
              Add Students
            </Button>
          </Col>
        </Row>
        <Row>
          <Col>
            <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''}`}>
              <input {...getInputProps()} />
              <p>Drag 'n' drop an Excel file here, or click to select one</p>
            </div>
          </Col>
        </Row>
      </Form>
    </Container>
  );
}

export default AddStudentForm;
