

import { Table } from 'reactstrap';
import Switch from 'react-switch';
import { useDarkMode } from '../DarkModeContext';
import React, { useMemo } from 'react';

const AttendanceTable = ({ columns, data, toggleAttendance }) => {
    const { isDarkMode } = useDarkMode();

    const memoizedData = useMemo(() => {
        return data.map((row) => ({
            ...row,
            present: row.present === 'true' ? 'Present' : 'Absent',
        }));
    }, [data]);

    const handleToggle = (enrollmentNo) => {
        toggleAttendance(enrollmentNo);
    };

    return (
        <div style={{ maxHeight: '72vh', overflowY: 'auto', maxWidth: '99vw', textAlign: 'center', overflowX: 'auto' }}>
           {memoizedData.length >0?  <Table striped bordered responsive dark={!isDarkMode} hover size="sm">
                <thead style={{ textAlign: 'center', fontWeight: 'bold' }}>
                    <tr>
                        {columns.map((column, index) => (
                            <th key={index}>{column.header}</th>
                        ))}
                    </tr>
                </thead>
                <tbody style={{ textAlign: 'center' }}>
                    {memoizedData.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            {columns.map((column, colIndex) => (
                                <td key={colIndex}>
                                    {column.accessorKey === 'present' ? (
                                        <div>
                                            <Switch
                                                checked={row.present === 'Present'}
                                                onChange={() => handleToggle(row.enrollmentNo)}
                                                offColor="#f44336"
                                                onColor="#4caf50"
                                                uncheckedHandleIcon={<div
                                                    style={{
                                                        display: "flex",
                                                        justifyContent: "center",
                                                        alignItems: "center",
                                                        height: "100%",
                                                        color: "red",
                                                        fontStyle: "italic",
                                                        fontSize: 20,
                                                        fontWeight: "bolder",
                                                    }}
                                                > A </div>}
                                                checkedHandleIcon={<div
                                                    style={{
                                                        display: "flex",
                                                        justifyContent: "center",
                                                        alignItems: "center",
                                                        height: "100%",
                                                        color: "green",
                                                        fontSize: 20,
                                                        fontStyle: "cursive",
                                                        fontWeight: "bolder",
                                                    }}
                                                >
                                                    P
                                                </div>}
                                            />
                                            <br />
                                            {row.present}
                                        </div>
                                    ) : (
                                        row[column.accessorKey]
                                    )}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </Table>:<div> <br />Please Select Date,Time & Class To Load The Student Attendance Table !!!</div>}
        </div>
    );
};

export default AttendanceTable;