const mongoose = require('mongoose');

// Define the student schema
const studentSchema = new mongoose.Schema({
  name: String,
  rollNo: String,
  enrollmentNo: String,
  // Other fields you want to include
});

// Create the Student model
const Student = mongoose.model('Student', studentSchema);

async function connectAndSaveStudents(studentsData) {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost/attendaceRecordDb', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    for (const studentInfo of studentsData) {
      const newStudent = new Student({
        name: studentInfo.name,
        rollNo: studentInfo.rollNo,
        enrollmentNo: studentInfo.enrollmentNo,
        // Add other fields as needed
      });

      const savedStudent = await newStudent.save();
      console.log('Student saved:', savedStudent);
    }

    // Close the connection after saving all students
    await mongoose.connection.close();
  } catch (error) {
    console.error('Error saving students:', error);
  }
}

const studentsData =  [
    { name: 'Omanand Prashant Swami', rollNo: 'R001', enrollmentNo:'2110950050' },
    { name: 'Harsh Moreshwar Kale', rollNo: 'R002', enrollmentNo:'2110950050' },
    { name: 'Prathes Santosh Bavge', rollNo: 'R003', enrollmentNo:'2110950050' },
    { name: 'Akshat Dashrath Gitte', rollNo: 'R003', enrollmentNo:'2110950050' },
    { name: 'Student 5', rollNo: 'R005', enrollmentNo:'2110950050' },
    { name: 'Student 6', rollNo: 'R006', enrollmentNo:'2110950050' },
    { name: 'Student 7', rollNo: 'R007', enrollmentNo:'2110950050' },
    { name: 'Student 8', rollNo: 'R008', enrollmentNo:'2110950050' },
    { name: 'Student 9', rollNo: 'R009', enrollmentNo:'2110950050' },
    { name: 'Student 10', rollNo: 'R010', enrollmentNo:'2110950050' },
    { name: 'Student 11', rollNo: 'R011', enrollmentNo:'2110950050' },
    { name: 'Student 12', rollNo: 'R012', enrollmentNo:'2110950050' },
    { name: 'Student 13', rollNo: 'R013', enrollmentNo:'2110950050' },
    { name: 'Student 14', rollNo: 'R014', enrollmentNo:'2110950050' },
    { name: 'Student 15', rollNo: 'R015', enrollmentNo:'2110950050' },
    { name: 'Student 16', rollNo: 'R016', enrollmentNo:'2110950050' },
    { name: 'Student 17', rollNo: 'R017', enrollmentNo:'2110950050' },
    { name: 'Student 18', rollNo: 'R018', enrollmentNo:'2110950050' },
    { name: 'Student 19', rollNo: 'R019', enrollmentNo:'2110950050' },
    { name: 'Student 20', rollNo: 'R020', enrollmentNo:'2110950050' },
    { name: 'Student 28', rollNo: 'R028', enrollmentNo:'2110950050' },
    { name: 'Student 21', rollNo: 'R021', enrollmentNo:'2110950050' },
    { name: 'Student 22', rollNo: 'R022', enrollmentNo:'2110950050' },
    { name: 'Student 23', rollNo: 'R023', enrollmentNo:'2110950050' },
    { name: 'Student 24', rollNo: 'R024', enrollmentNo:'2110950050' },
    { name: 'Student 25', rollNo: 'R025', enrollmentNo:'2110950050' },
    { name: 'Student 26', rollNo: 'R026', enrollmentNo:'2110950050' },
    { name: 'Student 27', rollNo: 'R027', enrollmentNo:'2110950050' },
    { name: 'Student 36', rollNo: 'R036', enrollmentNo:'2110950050' },
    { name: 'Student 29', rollNo: 'R029', enrollmentNo:'2110950050' },
    { name: 'Student 30', rollNo: 'R030', enrollmentNo:'2110950050' },
    { name: 'Student 31', rollNo: 'R031', enrollmentNo:'2110950050' },
    { name: 'Student 32', rollNo: 'R032', enrollmentNo:'2110950050' },
    { name: 'Student 33', rollNo: 'R033', enrollmentNo:'2110950050' },
    { name: 'Student 34', rollNo: 'R034', enrollmentNo:'2110950050' },
    { name: 'Student 35', rollNo: 'R035', enrollmentNo:'2110950050' },
    { name: 'Student 37', rollNo: 'R037', enrollmentNo:'2110950050' },
    { name: 'Student 38', rollNo: 'R038', enrollmentNo:'2110950050' },
    { name: 'Student 39', rollNo: 'R039', enrollmentNo:'2110950050' },
    { name: 'Student 40', rollNo: 'R040', enrollmentNo:'2110950050' },
   
  ];
connectAndSaveStudents(studentsData);
