// DataContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [classOptions, setClassOptions] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [students, setStudents] = useState([]);


  useEffect(() => {
    fetchAll();
    fetchStudentData();
  }, []);

  const fetchAll = async () => {
    try {
      // Fetch classes
      const classResponse = await axios.get('/class');
      setClassOptions(classResponse.data);

      // Fetch faculties
      const facultyResponse = await axios.get('/faculty');
      setFaculties(facultyResponse.data);
    } catch (error) {
      console.error('Error fetching data', error);
    }
  };


  const fetchClassOptions = async () => {
    try {
      const response = await axios.get('/class');
      setClassOptions(response.data);
    } catch (error) {
      console.error('Error fetching class options:', error);
    }
  }

  const fetchStudentData = async () => {
    try {
      const response = await axios.get('/student');
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching student data:', error);
    }
  };

  

  const state = {
    classOptions,
    faculties,
    students,
  };

  const actions = {
    fetchAll,
    fetchClassOptions,
    fetchStudentData,
  };
  console.log(classOptions)

  return (
    <DataContext.Provider value={{ ...state, ...actions }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  return useContext(DataContext);
};
