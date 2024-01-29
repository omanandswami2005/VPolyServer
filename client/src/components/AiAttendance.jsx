import React from 'react';
import { Card, CardBody, CardTitle, CardSubtitle, CardText, Button } from 'reactstrap';
import '../ai/index_ai.css';
import '../ai/index.js';
import { viewAttendanceData, init } from '../ai/index.js';

// import AiAttendace from '../willLater/ai';

const AiAttendace = () => {
  const refreshPage = () => {
    const confirm = window.confirm("Are you sure you want to refresh the page?");
    if (confirm) {
      window.location.reload();
    } else {
      return;
    }
  };
  return (
    <div className="main">
      <h2 className="h2ai text-center" >VPolyServer's AI Attendance System</h2>
      <Card style={{ display: 'flexbox', flexDirection: 'row', margin:"1rem", borderRadius: '20px', border: '4px solid black' ,width: '80vw' }}>

        <div id="webcam-container" style={{ flex: '3' }}></div>
        
        <CardBody style={{ flex: '4', display: 'flexbox', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>

          <CardTitle tag="h3"> <div id="present"></div></CardTitle>

          <CardSubtitle id="label-container" className="mb-2 text-muted" tag="h6">

          </CardSubtitle>
          <CardText id="present">

          </CardText>
          <Button id="startButton" onClick={init}>Start Capturing</Button> <br /><br />
          <Button onClick={viewAttendanceData}>View Attendance Data</Button><br /><br />
          <Button id="refreshButton" onClick={refreshPage}>Stop (Refresh Page)</Button>
        </CardBody>
      </Card>
    </div>
  );
};

export default AiAttendace;
