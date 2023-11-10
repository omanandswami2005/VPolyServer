import React from 'react';
import '../ai/index_ai.css';
import '../ai/index.js';
import { viewAttendanceData, init } from '../ai/index.js';

const AiAttendace = () => {
  // Function to refresh the page
  const refreshPage = () => {
    window.location.reload();
  };

  return (
    <div className="main">
      <div className="side-bar">
        <h2 className="h2ai">VPolyServer's AI Attendance System</h2>
        <button id="startButton" type="button" onClick={init}>
          Start
        </button>
        <button onClick={viewAttendanceData}>View Attendance Data</button>
        <button id="refreshButton" onClick={refreshPage}>
          Stop (Refresh Page)
        </button>
      </div>

      <div className="content">
        <div id="webcam-container"></div>
        <div id="label-container"></div>
        <div id="present"></div>
      </div>

      {/* Include your script tags here */}
      <script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@latest/dist/tf.min.js"></script>
      <script src="https://cdn.jsdelivr.net/npm/@teachablemachine/image@latest/dist/teachablemachine-image.min.js"></script>
    </div>
  );
};

export default AiAttendace;
