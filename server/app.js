const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const connectToMongoDB = require('./mongoConnection');


const classRoutes = require('./routes/classRoutes'); // Import the router module for classes
const facultyRoutes = require('./routes/facultyRoutes');
const studentRoutes = require('./routes/studentRoutes'); // Import the router module for students
const timeSlotRoutes = require('./routes/timeSlotRoutes');

const authRoutes = require('./routes/authRoutes'); // Adjust the path based on your project structure

const attendanceRoutes = require('./routes/attendanceRoutes');


const app = express();
connectToMongoDB();




const PORT = process.env.PORT || 5000;
///////////////////////////////////////////////////////////////////

// Middleware to parse JSON, URL-encoded data and cookies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(bodyParser.json());

/////////////////////////////////////////////////////////////////////
app.use('/class', classRoutes);
app.use('/student', studentRoutes);
app.use('/faculty', facultyRoutes);
app.use('/timeSlot', timeSlotRoutes);

app.use('/attendance', attendanceRoutes);


app.use('/auth', authRoutes);




// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});



