import React from 'react';
import Table from 'react-bootstrap/Table';
import '../styles/sheep.css';
const CombinedAttendanceTable = () => {
  // Sample data structure
  const sampleData = [
    { rollNo: 1, name: 'Omanand', attendance: { '1/12/23': 'P', '2/12/23': 'A', '3/12/23': 'P', '4/12/23': 'P', '5/12/23': 'P', '6/12/23': 'P', '7/12/23': 'P', '8/12/23': 'P', '9/12/23': 'P', '10/12/23': 'P', '11/12/23': 'P', '12/12/23': 'P', '13/12/23': 'P', '14/12/23': 'P', '15/12/23': 'P',/* ... */ } },
    { rollNo: 2, name: 'Alice', attendance: { '1/12/23': 'P', '2/12/23': 'P', '3/12/23': 'A', /* ... */ } },
    { rollNo: 3, name: 'Bob', attendance: { '1/12/23': 'A', '2/12/23': 'P', '3/12/23': 'P', /* ... */ } },
    { rollNo: 1, name: 'Omanand', attendance: { '1/12/23': 'P', '2/12/23': 'P', '3/12/23': 'P', '4/12/23': 'P', '5/12/23': 'P', '6/12/23': 'P', '7/12/23': 'P', '8/12/23': 'P', '9/12/23': 'P', '10/12/23': 'P', '11/12/23': 'P', '12/12/23': 'P', '13/12/23': 'P', '14/12/23': 'P', '15/12/23': 'P',/* ... */ } },
    { rollNo: 2, name: 'Alice', attendance: { '1/12/23': 'P', '2/12/23': 'P', '3/12/23': 'A', /* ... */ } },
    { rollNo: 3, name: 'Bob', attendance: { '1/12/23': 'A', '2/12/23': 'P', '3/12/23': 'P', /* ... */ } },
    // Add more students as needed
  ];

  const dates = Object.keys(sampleData[0].attendance);

  return (
    <div style={{ overflowX: 'auto', width: '95vw', margin: 'auto',textAlign:'center' }}>
      <Table responsive='sm' striped bordered hover>
        <thead>
          <tr>
            <th>Roll No</th>
            <th>Name</th>
            {dates.map(date => (
              <th key={date}>{date}</th>
            ))}
            <th>Total Present</th>
            <th>Total Absent</th>
          </tr>
        </thead>
        <tbody>
          {sampleData.map(student => (
            <tr className='tableRow' key={student.rollNo}>
              <td>{student.rollNo}</td>
              <td>{student.name}</td>
              {dates.map(date => (
                <td key={date}>{student.attendance[date] || '-'}</td>
              ))}
              <td>{Object.values(student.attendance).filter(status => status === 'P').length}</td>
              <td>{Object.values(student.attendance).filter(status => status === 'A').length}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default CombinedAttendanceTable;
