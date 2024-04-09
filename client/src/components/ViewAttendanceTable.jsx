import React,{ useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';
import { Chart as ChartJS, ArcElement, Tooltip, } from 'chart.js';
import { Pie } from 'react-chartjs-2';


import Toolbar from '@mui/material/Toolbar';


import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';

import { useDarkMode } from '../DarkModeContext';

import ExportToWord from './ExportToWord';

ChartJS.register(ArcElement, Tooltip,);

function AttendanceTable10({ attendanceData,Class,timeSlot }) {
  const [openRowIndex, setOpenRowIndex] = useState(null); // State to keep track of the open row index

  //Function to toggle collapse for a row
  const toggleCollapse = (index) => {
    setOpenRowIndex(openRowIndex === index ? null : index);
  };

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));

  
  
const {isDarkMode} = useDarkMode();

 // Extract unique dates from the attendance data
const dates = [...new Set(attendanceData.reduce((acc, curr) => {
  return acc.concat(curr.attendance.map(a => {
      const date = new Date(a.date);
      return date.toLocaleDateString('en-GB'); // Format date as dd/mm/yy
  }));
}, []))];

console.log(dates);

  // Function to generate data for the pie chart
  const generatePieChartData = (attendance) => {
    const presentCount = attendance.filter(a => a.present).length;
    const absentCount = attendance.length - presentCount;
    return {
      labels: ['Present', 'Absent'],
      legend: { display: true },

      datasets: [
        {
          label: 'Attendance',
          data: [presentCount, absentCount],
          backgroundColor: ['#36a2eb', '#ff6384'],
          hoverBackgroundColor: ['#36A2EB', '#FF6384']
        },
      ],
    };
  };

  return (
    <>
    <Toolbar sx={{display:"flex",justifyContent:"space-evenly"}}>
    <Button onClick={() => ExportToWord(attendanceData, dates,Class,timeSlot)} variant='contained'>Export to Word</Button>
    <Typography > Selected Class : {Class}</Typography>
    <Typography > Selected Time Slot : { timeSlot}</Typography>
    </Toolbar>
      <TableContainer sx={{ maxHeight: 400, maxWidth: 1000 }}>
        <Table sx={{ minWidth: 700, border: 1, backgroundColor: isDarkMode ? "#fff" : "#000", borderCollapse: 'collapse' }} size="medium" aria-label="customized table" stickyHeader>
          <TableHead>
            <TableRow>

              <TableCell >Pie Info</TableCell>
              <TableCell sx={{ position: 'sticky', left: 0, zIndex: 1000 }}>Roll No</TableCell>
              <TableCell sx={{ position: 'sticky', left: 50, zIndex: 1000 }}>Name</TableCell>
              {dates.sort().map(date => (
                <TableCell key={date} sx={{transform:"rotate(-35deg)",height:"25px",width:"30px",borderRadius:"100%"}}>{date}</TableCell>
              ))}
              <TableCell sx={{ position: "sticky", zIndex: 10, right: 80 }}>Total Attendance</TableCell> {/* Total Attendance Column */}
              <TableCell sx={{ position: "sticky", zIndex: 10, right: 0 }}>Defaulter</TableCell> {/* Defaulter Column */}
            </TableRow>
          </TableHead>
          <TableBody>
            {attendanceData.map((student, index) => {
              const totalAttendance = student.attendance.filter(a => a.present).length; // Calculate total attendance
              const totalDays = dates.length; // Total number of days
              const attendancePercentage = (totalAttendance / totalDays) * 100; // Calculate attendance percentage
              const isDefaulter = attendancePercentage < 75; // Check if the student is a defaulter
              const isRowOpen = openRowIndex === index;

              return (
                <React.Fragment key={student.studentName}>
                  <StyledTableRow hover={true}>
                    <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => toggleCollapse(index)}
          >
            {isRowOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
                    <TableCell sx={{ position: 'sticky', left: 0, zIndex: 100, backgroundColor: isDarkMode ? "#aaa" : "#000", border: '1px solid #ddd' }}>{student.rollNo}</TableCell>
                    <TableCell sx={{ position: 'sticky', left: 50, zIndex: 100, backgroundColor: isDarkMode ? "#aaa" : "#000", border: '1px solid #ddd' }}>{student.studentName}</TableCell>
                    {dates.map(date => {
                      const attendance = student.attendance.find(a => {
                        const dateObj = new Date(a.date);
                        const formattedDate = dateObj.toLocaleDateString('en-GB'); // Format date as dd/mm/yy
                        return formattedDate === date;
                      });
                      const status = attendance ? (attendance.present ? 'P' : 'A') : ''; // Assuming 'P' for present and 'A' for absent
                      return <TableCell key={`${student.studentName}-${date}`} sx={{ border: '1px solid #ddd' }}>{status}</TableCell>;
                    })}
                    <TableCell sx={{ position: 'sticky', right: 80, zIndex: 1, backgroundColor: isDarkMode ? "#aaa" : "#000", border: '1px solid #ddd' }}>{totalAttendance}/{totalDays}</TableCell> {/* Total Attendance */}
                    <TableCell sx={{ position: 'sticky', right: 0, zIndex: 1, backgroundColor: isDarkMode ? "#aaa" : "#000", border: '1px solid #ddd' }}>{isDefaulter ? 'Yes' : 'No'}</TableCell> {/* Defaulter */}
                  </StyledTableRow>
                  <StyledTableRow>
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={dates.length + 4}>
                      
                      <Collapse in={isRowOpen} timeout="auto" unmountOnExit>                        
                       <Box margin={1} sx={{  height: '200px' , overflow: 'hidden', border: '5px solid #ddd', borderRadius: '4px', display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center',paddingLeft: '100px'}}>

                         
                          <Typography variant="h6" gutterBottom component="div">
                         Total Days: {totalDays} <br/>
                         Present Days: {totalAttendance} <br/>
                         Absent Days: {totalDays - totalAttendance} <br/>
                         Defauter : {isDefaulter ? 'Yes' : 'No'} <br/>
                         In Percentage : {attendancePercentage.toFixed(2)}%

                            </Typography>
                          
                          <Pie data={generatePieChartData(student.attendance)}
                           />
                        </Box>
                      </Collapse>
                    </TableCell>
                  </StyledTableRow>
                </React.Fragment>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
     
    </>
  );
}

export default AttendanceTable10;
