import React, { useState, } from 'react';

import axios from 'axios';
import toast from 'react-hot-toast';
import { useDropzone } from 'react-dropzone';
import * as XLSX from 'xlsx';
import MutatingDotsSpinner from './Spinners/MutatingDotsSpinner';
import { useData } from '../DataContext';
import { useDarkMode } from '../DarkModeContext';

import {
  Container,
  Button,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
  TextField,
  Box,
  Card,
} from '@mui/material';

function AddStudentForm() {
  const [studentData, setStudentData] = useState([
    {
      name: '',
      enrollmentNo: '',
    },
  ]);
 
  const [selectedClass, setSelectedClass] = useState('');
  const [classId, setClassId] = useState('');
  const [loading, setLoading] = useState(false); // 
  const { isDarkMode } = useDarkMode();

  const { classOptions, fetchStudentData } = useData();

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    onDrop: (acceptedFiles, rejectedFiles) => {
      if (rejectedFiles && rejectedFiles.length > 0) {
        console.warn('Invalid files:', rejectedFiles);
      }

      handleExcelUpload(acceptedFiles);
    },
  });

  



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
    // Check if any enrollmentNo is empty
    if (studentData.some((student) => student.enrollmentNo === '')) {
      toast.error('Please fill Enrollment No.');
      return;
    }

    try {

      setLoading(true);

      const response = await axios.post('/student', {
        studentData,
        classId: classId,
      });

      if (response.data) {
        toast.success('Students added successfully');
        setLoading(false);
      } else {
        toast.error('Failed to add students');
      }

      fetchStudentData();
      setStudentData([]); // Clear studentData after successful submission
    } catch (error) {
      console.error('Error adding students', error);
      toast.error('Duplicate Enrollments Detected');
    } finally {
      setLoading(false);
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
    setLoading(true);
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
      finally {
        setLoading(false);
      }
    };
    reader.readAsArrayBuffer(file);

  };

  return (
    <>
   
    <Container className="my-3">
      <form onSubmit={handleStudentSubmit}>
       

        <Box mb={3}>
          <FormControl fullWidth>
            <InputLabel id="class-select-label">Select Class</InputLabel>
            <Select
              labelId="class-select-label"
              value={selectedClass}
              required
              onChange={handleClassChange}
              fullWidth
            >
             
              {classOptions.map((option) => (
                <MenuItem key={option._id} value={option.name}>
                  {option.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Card className={`border-0 shadow add-class-card`} style={{ maxHeight: '50vh', overflowY: 'auto',borderRadius: '10px',borderColor:'red' }} >
        {studentData.map((student, index) => (
          <Box key={index} mb={1} >
            <TextField
            style={{ margin: '10px' }}
              type="text"
              placeholder="Enter Name"
              required
              value={student.name}
              onChange={(e) => handleStudentChange(index, 'name', e.target.value)}
              fullWidth
            />
            <TextField
              type="number"
              style={{ margin: '10px' }}
              placeholder="Enrollment No"
              value={student.enrollmentNo}
              onChange={(e) => handleStudentChange(index, 'enrollmentNo', e.target.value)}
              fullWidth
            />
            {studentData.length > 1 && (
              <Button
                variant="contained"
                color="warning"
                style={{ marginInline: '30px' }}

                onClick={() => handleCancelStudent(index)}
                fullWidth
              >
                Cancel
              </Button>
            )}
          </Box>
        ))}
</Card>
        <Box mb={3} mt={2}>
          <Button variant="contained" onClick={handleAddStudent}>
            Multiple
          </Button>
        </Box>

        <Box mb={3}>
          <Button
            variant="contained"
            color="success"
            type="submit"
            disabled={studentData.length === 0}
            fullWidth
          >
            Add Students
          </Button>
        </Box>

       

        <Box mb={3} border={1} className={`text-center ${isDarkMode ? 'bg-light' : 'bg-dark'} rounded-3`}>
          <Box {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''}`}>
            <input {...getInputProps()} />
            <p>Drag 'n' drop an Excel file here, or click to select one</p>
          </Box>
        </Box>
      </form>
    </Container>

    {loading && <MutatingDotsSpinner />}
  </>
  );
}

export default AddStudentForm;
