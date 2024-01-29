import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import axios from 'axios';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [classOptions, setClassOptions] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [students, setStudents] = useState([]);

  const fetchAll = useCallback(async () => {
    try {
      const [classResponse, facultyResponse] = await Promise.all([
        axios.get('/class'),
        axios.get('/faculty'),
      ]);

      setClassOptions(classResponse.data);
      setFaculties(facultyResponse.data);
    } catch (error) {
      console.error('Error fetching data', error);
    }
  }, []);

  const fetchStudentData = useCallback(async () => {
    try {
      const response = await axios.get('/student');
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching student data:', error);
    }
  }, []); // Empty dependency array since there are no dependencies

  // const fetchClassOptions = useCallback(async () => {
  //   try {
  //     const response = await axios.get('/class');
  //     setClassOptions(response.data);
  //   } catch (error) {
  //     console.error('Error fetching class options:', error);
  //   }
  // },[]);

  useEffect(() => {
    fetchAll();
    fetchStudentData();
  }, [fetchAll, fetchStudentData]);

  const memoizedState = useMemo(
    () => ({
      classOptions,
      faculties,
      students,
    }),
    [classOptions, faculties, students]
  );

  const actions = useMemo(
    () => ({
      fetchAll,
      
      fetchStudentData,
    }),
    [fetchAll, fetchStudentData]
  );

  return (
    <DataContext.Provider value={{ ...memoizedState, ...actions }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  return useContext(DataContext);
};
