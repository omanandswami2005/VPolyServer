const express = require('express');
const mongoose = require('mongoose');
// const path = require('path');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const cookie = require('cookie');
const authenticateJWT = require('./authMiddleware');
const bodyParser = require('body-parser');
const StudentAttendance = require('./models/studentAttendance'); // Import your schema
const Student = require('./models/Student');
const Class =require('./models/Class')
const Faculty = require('./models/Faculty');

// const classRoutes = require('./routes/classRoutes'); // Import the router module for classes
const studentRoutes = require('./routes/studentRoutes'); // Import the router module for students
const facultyRoutes = require('./routes/facultyRoutes');

const app = express();


const secretKey = '85f55ae3bbf0d828d8e485122661a88d98956b6b0b35b164ab89315caeefbad9';

const PORT = process.env.PORT || 5000;
///////////////////////////////////////////////////////////////////

// Middleware to parse JSON, URL-encoded data and cookies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(bodyParser.json());

//////////////////////////////////////////////////////////////
// app.use('/classes', classRoutes);
app.use('/students', studentRoutes);
app.use('/faculty', facultyRoutes);

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Connect to MongoDB
mongoose
  .connect('mongodb://localhost/CODept', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error(err));




  


  app.post('/faculty', async (req, res) => {
    const { name, id, assignedClasses, role, password } = req.body;

    try {
        const faculty = new Faculty({
            name,
            id,
            assignedClasses, // Now directly storing class names
            role,
            password,
        });

        await faculty.save();
        res.json(faculty);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Update a faculty member
app.put('/faculty/:id', async (req, res) => {
    const { name, id, assignedClasses, role, password } = req.body;
    const facultyId = req.params.id;

    try {
        const faculty = await Faculty.findById(facultyId);

        if (!faculty) {
            return res.status(404).json({ message: 'Faculty member not found' });
        }

        // Update faculty properties
        faculty.name = name;
        faculty.id = id;
        faculty.assignedClasses = assignedClasses; // Update class names directly
        faculty.role = role;
        faculty.password = password;

        await faculty.save();
        res.json(faculty);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});
  app.get('/class/:classId', async (req, res) => {
    try {
      const classId = req.params.classId;
      // Fetch the class by ID from the database
      const classInfo = await Class.findById(classId);
  
      if (!classInfo) {
        return res.status(404).json({ message: 'Class not found' });
      }
  
      res.json({ name: classInfo.name }); // Return the class name
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  });
  

  
  
  
  

  app.get('/faculty', async (req, res) => {
    try {
      const facultyMembers = await Faculty.find({}).exec();
  
      if (facultyMembers.length === 0) {
        return res.status(200).json([]);
      }
  
      res.status(200).json(facultyMembers);
    } catch (err) {
      console.error('Error retrieving faculty members:', err);
      res.status(500).json({ error: 'Could not retrieve faculty members' });
    }
  });
  
  


  app.get('/faculty/:id', (req, res) => {
    // Retrieve a specific faculty member by ID
    const facultyId = req.params.id;
  
    Faculty.findById(facultyId, (err, facultyMember) => {
      if (err) {
        console.error('Error retrieving faculty member:', err);
        return res.status(500).json({ error: 'Could not retrieve faculty member' });
      }
  
      if (!facultyMember) {
        return res.status(404).json({ message: 'Faculty member not found' });
      }
  
      // Send a successful response with the faculty member details
      res.status(200).json(facultyMember);
    });
  });

 
  app.get('/faculty/classes/:name', async (req, res) => {
    try {
      const facultyName = req.params.name; // Retrieve the faculty member's name from the query string
  
      // Find the faculty member by their name
      // console.log(facultyName);
      const faculty = await Faculty.findOne({ name: facultyName });
      // console.log(faculty);
  
      if (!faculty) {
        return res.status(404).json({ message: 'Faculty not found' });
      }
  
      // Extract the assigned classes
      const assignedClasses = faculty.assignedClasses;
  
      res.json(assignedClasses);
    } catch (error) {
      console.error('Error fetching assigned classes:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  
  
  app.delete('/faculty/:id', async (req, res) => {
    try {
      const facultyId = req.params.id;
      
  
      // Use Mongoose 6's findByIdAndDelete method
      const deletedFaculty = await Faculty.findByIdAndDelete(facultyId);
  
      if (!deletedFaculty) {
        // Faculty member not found
        return res.status(404).json({ error: 'Faculty member not found' });
      }
  
      // Send a success response
      res.status(200).json({ message: 'Faculty member deleted successfully' });
    } catch (err) {
      console.error('Error deleting faculty member:', err);
      res.status(500).json({ error: 'Could not delete faculty member' });
    }
  });
  
  


// Add a route to fetch all students
app.get('/getstudents', async (req, res) => {
  try {
    const students = await Student.find().populate('class');
    res.status(200).json(students);
    console.log(students);
  } catch (error) {
    console.error('Error fetching students', error);
    res.status(500).json({ error: 'Error fetching students' });
  }
});

// Add a route to fetch all students
app.get('/getstudentsbyclass/:class', async (req, res) => {
  try {
    const class1 = req.params.class;
    console.log(class1);
    const students = await Class.find({name:class1}).populate('students');
    const studentsArray =students[0].students;
    console.log(studentsArray);
    const studentInfoArray = studentsArray.map(student => ({
      name: student.name,
      rollNo: student.rollNo, // Assuming "rollNo" is the property name
      enrollmentNo: student.enrollmentNo, // Assuming "enrollmentNo" is the property name
    }));    // console.log(namesArray);
    res.status(200).json(studentInfoArray);
  } catch (error) {
    console.error('Error fetching students', error);
    res.status(500).json({ error: 'Error fetching students' });


  }
});

const getStudentAttendance = async (studentEnrollmentNo, startDate, endDate) => {
  try {

    console.log(studentEnrollmentNo);
    console.log(startDate);
    console.log(endDate)  ;
    const attendanceData = await StudentAttendance.find({
      studentEnrollmentNo,
      date: { $gte: startDate, $lte: endDate },
    });

    return attendanceData;
  } catch (error) {
    console.error('Error fetching attendance data:', error);
    throw error;
  }
};


app.get('/api/studentAttendance/:studentEnrollmentNo', async (req, res) => {
  const studentEnrollmentNo = req.params.studentEnrollmentNo;
  // Parse start and end dates or month from the query parameters
  const { startDate, endDate, selectedMonth } = req.query;

  let attendanceData;

  if (selectedMonth) {
    // Calculate start and end dates for the selected month
    const year = new Date().getFullYear();
    const month = Number(selectedMonth); // Assuming 0-indexed months
    const startOfMonth = new Date(year, month, 2);
    const endOfMonth = new Date(year, month + 1, 1);
    console.log(startOfMonth);
    console.log(endOfMonth);
    // console.log(startOfMonth);

    attendanceData = await getStudentAttendance(studentEnrollmentNo, startOfMonth, endOfMonth);
  } else if (startDate && endDate) {
    attendanceData = await getStudentAttendance(studentEnrollmentNo, new Date(startDate), new Date(endDate));
  } else {
    // Handle cases without date filtering
    attendanceData = await getStudentAttendance(studentEnrollmentNo, new Date(0), new Date());
  }

  res.json(attendanceData);
});



  app.post('/addstudents', async (req, res) => {
    try {
      const { name, rollNo, enrollmentNo, class: classId } = req.body;
  
      // Create a new student and save it to the database
      const newStudent = new Student({ name, rollNo, enrollmentNo, class: classId });
      const student = await newStudent.save();
  
      // Add the student to the corresponding class's students array
      const classs = await Class.findById(classId);
      classs.students.push(student);
      await classs.save();
  
      res.status(201).json({ message: 'Student added successfully', data: student })
    
    } catch (error) {
      console.error('Error adding students', error);
      res.status(500).json({ error: 'Error adding students' });
    }
  });

  app.get('/getclasses', async (req, res) => {
    try {
      const classes = await Class.find({}, 'name');
      res.status(200).json(classes);
    } catch (error) {
      console.error('Error fetching classes', error);
      res.status(500).json({ error: 'Error fetching classes' });
    }
  });

  app.post('/addClasses', async (req, res) => {
    try {
      const { classNames } = req.body;
  
      // Create a new class for each className and save it to the database
      const classDocuments = await Promise.all(
        classNames.map(async (className) => {
          const newClass = new Class({ name: className });
          return newClass.save();
        })
      ).then((classDocuments) => {
        res.status(201).json({ data:true,message: 'Classes added successfully', data: classDocuments });
        
      }).catch((error) => {
        console.log('already added', error);
        res.status(500).json({ error: 'Error adding classes' });
      });
  
      // Return the created class documents as a response (or you can customize the response)
      // res.status(201).json({ message: 'Classes added successfully', data: classDocuments });
    } catch (error) {
      // console.log('Error adding classes', error);
      res.status(500).json({ error: 'Error adding classes' });
    }
  });

  app.put('/updateclass/:id', async (req, res) => {
    const { id } = req.params;
  const { name } = req.body;

  try {
    const updatedClass = await Class.findByIdAndUpdate(id, { name }, { new: true });

    if (!updatedClass) {
      return res.status(404).json({ message: 'Class not found' });
    }

    return res.json(updatedClass);
  } catch (error) {
    console.error('Error updating class:', error);
    return res.status(500).json({ message: 'Error updating class' });
  }
  });
  
  app.put('/updatestudent/:id', async (req, res) => {
    const { id } = req.params;
  const { name, rollNo, enrollmentNo,selectedClassId } = req.body;
console.log(selectedClassId);
  try {
    const updatedStudent = await Student.findByIdAndUpdate(id, { name, rollNo, enrollmentNo, class:  selectedClassId }, { new: true });

    if (!updatedStudent) {
      return res.status(404).json({ message: 'Class not found' });
    }

    return res.json(updatedStudent);
  } catch (error) {
    console.error('Error updating class:', error);
    return res.status(500).json({ message: 'Error updating class' });
  }
  });

  app.delete('/deleteclass/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const deletedClass = await Class.findByIdAndRemove(id);
  
      if (!deletedClass) {
        return res.status(404).json({ message: 'Class not found' });
      }
  
      return res.json({ message: 'Class deleted successfully' });
    } catch (error) {
      console.error('Error deleting class:', error);
      return res.status(500).json({ message: 'Error deleting class' });
    }
  });
  app.delete('/deletestudent/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const deletedStudent = await Student.findByIdAndRemove(id);
  
      if (!deletedStudent) {
        return res.status(404).json({ message: 'Class not found' });
      }
  
      return res.json({ message: 'Class deleted successfully' });
    } catch (error) {
      console.error('Error deleting class:', error);
      return res.status(500).json({ message: 'Error deleting class' });
    }
  });0

  
  

app.post('/manualAttendanceForToday',authenticateJWT, async (req, res) => {
    const { selectedTimeSlot ,className} = req.body;
    const today = new Date(); // Get today's date
    // const dayOfWeek = today.getDay();
    const date = today.getDate();
    const month = today.getMonth();
    const year = today.getFullYear();
    const selectedDate = `${year}-${month + 1}-${date}`
    // console.log(selectedDate);
    try {
      // Find the class by name and populate its students
      const classData = await Class.findOne({ name: className }).populate('students');
  
      if (!classData) {
        return res.status(404).json({ message: `Class '${className}' not found.` });
      }
  
      console.log(`Class: ${classData.name}`);
      console.log('Students:');
  
      // Clear the studentsToAdd array before processing students for the new class
      const studentsToAdd = [];
  
      for (const student of classData.students) {
        const existingAttendance = await StudentAttendance.findOne({
          studentId: student._id,
          date: selectedDate,
          timeSlot: selectedTimeSlot,
        });
  
        if (!existingAttendance) {
          // If the student is not present, add them to the attendance model
          studentsToAdd.push({
            studentId: student._id,
            studentName: student.name,
            studentRollNo: student.rollNo,
            studentEnrollmentNo: student.enrollmentNo,
            date: selectedDate,
            timeSlot: selectedTimeSlot,
            present: false,
          });
        }
  
        console.log(`- ${student.name}`);
      }
  
      // Insert new student attendance records if there are any
      if (studentsToAdd.length > 0) {
        await StudentAttendance.insertMany(studentsToAdd);
        console.log('Added new attendance records for missing students.');
      }
  
      // Now, send all the student attendance data as a response, including both existing and newly added records
      const allStudentAttendance = await StudentAttendance.find({
        date: selectedDate,
        timeSlot: selectedTimeSlot,
      }).populate({
        path: 'studentId',
        populate: {
          path: 'class', // Populate the class field in studentId
        },
      });
      const filteredStudentAttendance = allStudentAttendance.filter((attendance) => {
        return attendance.studentId.class.name === className;
      });
      console.log(filteredStudentAttendance);
  
      res.json({ data: true, studentAttendance: filteredStudentAttendance });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  

  app.post('/manualattendance', authenticateJWT, async (req, res) => {
  const { selectedDate, selectedTimeSlot, className } = req.body;
  console.log(selectedDate, selectedTimeSlot, className);
  try {
    // Find the class by name and populate its students
    const classData = await Class.findOne({ name: className }).populate('students');

    if (!classData) {
      return res.status(404).json({ message: `Class '${className}' not found.` });
    }

    console.log(`Class: ${classData.name}`);
    console.log('Students:');

    // Clear the studentsToAdd array before processing students for the new class
    const studentsToAdd = [];

    for (const student of classData.students) {
      const existingAttendance = await StudentAttendance.findOne({
        studentId: student._id,
        date: selectedDate,
        timeSlot: selectedTimeSlot,
      });

      if (!existingAttendance) {
        // If the student is not present, add them to the attendance model
        studentsToAdd.push({
          studentId: student._id,
          studentName: student.name,
          studentRollNo: student.rollNo,
          studentEnrollmentNo: student.enrollmentNo,
          date: selectedDate,
          timeSlot: selectedTimeSlot,
          present: false,
        });
      }

      console.log(`- ${student.name}`);
    }

    // Insert new student attendance records if there are any
    if (studentsToAdd.length > 0) {
      await StudentAttendance.insertMany(studentsToAdd);
      console.log('Added new attendance records for missing students.');
    }

    // Now, send all the student attendance data as a response, including both existing and newly added records
    const allStudentAttendance = await StudentAttendance.find({
      date: selectedDate,
      timeSlot: selectedTimeSlot,
    }).populate({
      path: 'studentId',
      populate: {
        path: 'class', // Populate the class field in studentId
      },
    });
    const filteredStudentAttendance = allStudentAttendance.filter((attendance) => {
      return attendance.studentId.class.name === className;
    });
    console.log(filteredStudentAttendance);

    res.json({ data: true, studentAttendance: filteredStudentAttendance });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
  
  
  

  app.put('/students/update/:id', authenticateJWT, async (req, res) => {

  const studentEnrollmentNo = req.params.id;
  const { selectedDate, selectedTimeSlot } = req.body;
  console.log(studentEnrollmentNo, selectedDate, selectedTimeSlot);
  try {
    
    // Also update the corresponding record in the main database
    const mainRecord = await StudentAttendance.findOne({
      studentEnrollmentNo: studentEnrollmentNo,
      date: `${selectedDate}`,
      timeSlot: selectedTimeSlot,
      
    });
console.log(mainRecord);
    if (!mainRecord) {
      // If the record doesn't exist in the main database, return an error
      return res.status(404).json({ error: 'Record not found' });
    }
    console.log("Mainrecbefor"+mainRecord);
    
    mainRecord.present = !mainRecord.present;
    await mainRecord.save();
    console.log("Mainrecafter"+mainRecord);

    res.json({ data: true, mainRecord });
    // res.json({ data: true, userData });
  } catch (error) {
    console.error('Error updating data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Serve the dashboard for authorized users (protected by JWT)
app.post('/dashboard', authenticateJWT, (req, res) => {
  console.log(req.user.role);
    // Serve the dashboard content here
    const userData = {
        name: req.user.username, // Replace with the actual user's name
        email: 'omanandswami@2005.com',
        role: req.user.role // Replace with the actual user's email
    };

    res.json({ data: true, userData});
});


app.post('/dashboard/profile', authenticateJWT, (req, res) => {
    // Serve the dashboard HTML file or content here
    const userData = req.user.username;

    res.json({ data: true, userData });
});

app.post('/ai', authenticateJWT, (req, res) => {
    // Serve the dashboard HTML file or content here
    const userData = req.user.username;

    res.json({ data: true, userData });
    // console.log("success");
});

app.post('/startmanualattendance', authenticateJWT, (req, res) => {
    res.json({ data: true });
})
app.post('/classstudentmgmt', authenticateJWT, (req, res) => {
    res.json({ data: true });
})

// Example login route to generate a JWT token

app.post('/login', async (req, res) => {
    const { facultyId, password } = req.body;

    try {
        const faculty = await Faculty.findOne({ name: facultyId });

        if (faculty) {
            if (faculty.password === password) {
                // Create a payload for the JWT token with faculty information
                const payload = {
                    username: facultyId,
                    name: faculty.name,
                    role: faculty.role,
                };
// console.log(payload);
                // Generate a JWT token and send it to the client
                const token = jwt.sign(payload, secretKey, { expiresIn: '10m' });
                console.log('Generated Token:', token);

                // Set the JWT token as a cookie
                res.setHeader('Set-Cookie', cookie.serialize('token', token, {
                    httpOnly: true,
                    maxAge: 60 * 10, // 10 minutes
                    sameSite: 'strict', // Adjust this based on your security requirements
                    path: '/', // Specify the path where the cookie is accessible
                }));

                // Respond with any other necessary data
                res.json({ name: faculty.name, role: faculty.role });
            } else {
                res.status(401).json({ message: 'Authentication failed' });
            }
        } else if (facultyId === 'Admin' && password === 'Admin') {
            // Hardcoded user for fallback authentication
            // Create a payload for the JWT token with faculty information
            const payload = {
                username: facultyId,
                name: 'Admin',
                role: 'Admin',
            };

            // Generate a JWT token and send it to the client
            const token = jwt.sign(payload, secretKey, { expiresIn: '10m' });
            console.log('Generated Token:', token);

            // Set the JWT token as a cookie
            res.setHeader('Set-Cookie', cookie.serialize('token', token, {
                httpOnly: true,
                maxAge: 60 * 10, // 10 minutes
                sameSite: 'strict', // Adjust this based on your security requirements
                path: '/', // Specify the path where the cookie is accessible
            }));

            // Respond with any other necessary data
            res.json({ name: 'Hardcoded User', role: 'Default Role' });
        } else {
            res.status(401).json({ message: 'Authentication failed' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});





app.get('/logout', (req, res) => {
    // Clear the token cookie by setting it to an empty value and specifying an immediate expiration time
    res.setHeader('Set-Cookie', cookie.serialize('token', '', {
        httpOnly: true,
        maxAge: 0, // Set the cookie to expire immediately
        sameSite: 'strict', // Adjust this based on your security requirements
        path: '/', // Specify the path where the cookie was originally set
    }));

    res.json({ logout: false }).sendStatus(200);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});



