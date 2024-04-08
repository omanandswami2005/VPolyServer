const express = require('express');

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

require('dotenv').config();
const cors = require('cors');
const path = require('path');

const connectToMongoDB = require('./mongoConnection');


const classRoutes = require('./routes/classRoutes'); // Import the router module for classes
const facultyRoutes = require('./routes/facultyRoutes');
const studentRoutes = require('./routes/studentRoutes'); // Import the router module for students
const timeSlotRoutes = require('./routes/timeSlotRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');

const authRoutes = require('./routes/authRoutes'); // Adjust the path based on your project structure

const StudentAttendance = require('./models/studentAttendance');
const Student = require('./models/Student');
const Class = require('./models/Class');

const app = express();
///////////////////////////////////////////////////////////////////
connectToMongoDB();
///////////////////////////////////////////////////////////////////
const PORT = process.env.PORT || 5000;
///////////////////////////////////////////////////////////////////

// Middleware to parse JSON, URL-encoded data and cookies
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'build')));


////////////////////////////////////////////////////////////////////
app.use('/class', classRoutes);
app.use('/student', studentRoutes);
app.use('/faculty', facultyRoutes);
app.use('/timeSlot', timeSlotRoutes);
app.use('/attendance', attendanceRoutes);

app.use('/auth', authRoutes);

app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });


app.post('/viewattendance', async (req, res) => {
try {
  const { selectedClass, dateRange, timeSlot } = req.body;
  // console.log(selectedClass, timeRange, timeSlot);
// Convert startDate and endDate to ISO string format
const startDate = new Date(dateRange.startDate);
startDate.setDate(startDate.getDate() + 1);
startDate.setUTCHours(0, 0, 0, 0);

const endDate = new Date(dateRange.endDate);
endDate.setDate(endDate.getDate() + 1);

endDate.setUTCHours(0,0,0,0);


   // Find the class ID based on the class name
   const classInfo = await Class.findById({_id:selectedClass}).populate('students');

   if (!classInfo) {
     return res.status(404).json({ error: 'Class not found' });
   }
  // console.log(classInfo);


  const students = classInfo.students;
 // Fetch attendance data for each student based on the provided parameters
//  console.log(dateRange);
console.log(timeSlot);
 const attendanceData = [];

 
 for (const student of students) {

  let query = {
    studentId: student._id,
    date: { $gte: startDate, $lte: endDate }
  };

  // If timeSlot is not "All Time Slot", include it in the query
  if (timeSlot !== "All Time Slots") {
    query.timeSlot = timeSlot;
  }

  const studentAttendance = await StudentAttendance.find(query).select('date present'); // Select only required fields

      attendanceData.push({
        studentName: student.name,
        attendance: studentAttendance,
        rollNo : student.rollNo,
      });
 }
// console.log(attendanceData);
 res.json({ attendanceData });



}   catch (error) {

  console.log(error);
}

});


  
// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});