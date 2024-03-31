import { Table } from 'reactstrap';
import Switch from 'react-switch';
import { useDarkMode } from '../DarkModeContext';
import React, { useState } from 'react';

const AttendanceTable = ({ columns, data, toggleAttendance }) => {
    const { isDarkMode } = useDarkMode();
    console.log(data.length);

    return (
        <div style={{ maxHeight: '80vh', overflowY: 'auto',maxWidth:'99vw',  textAlign:'center',overflowX:'auto' }}>
            <Table striped bordered responsive dark={!isDarkMode} hover size="sm"  >
                <thead style={{ textAlign: 'center', fontWeight: 'bold' }}>
                    <tr>
                        {columns.map((column, index) => (
                            <th key={index}>{column.header}</th>
                        ))}
                    </tr>
                </thead>
                <tbody style={{ textAlign: 'center' }}>
                    {data.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            {columns.map((column, colIndex) => (
                                <td key={colIndex}>
                                    {column.accessorKey === 'present' ? (
                                        <div>
                                            <Switch
                                                checked={row.present === 'true'}
                                                onChange={() => toggleAttendance(row.enrollmentNo)}
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
                                            {row.present === 'true' ? 'Present' : 'Absent'}
                                        </div>
                                    ) : (
                                        row[column.accessorKey]
                                    )}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};

export default AttendanceTable;


