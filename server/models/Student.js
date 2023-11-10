// const mongoose = require('mongoose');

// // Define the student schema
// const studentSchema = new mongoose.Schema({
//   name: String,
//   rollNo: String,
//   enrollmentNo: String,
//   // Other fields you want to include
// });

// // Create the Student model
// const Student = mongoose.model('Student', studentSchema);

// async function connectAndSaveStudent() {
//   try {
//     // Connect to MongoDB
//     await mongoose.connect('mongodb://localhost/attendaceRecordDb', {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });

//     console.log('Connected to MongoDB');

//     const newStudent = new Student({
//       name: 'Omanand Prashant Swami',
//       rollNo: '03',
//       enrollmentNo: '2110950050',
//       // Other fields as needed
//     });

//     const savedStudent = await newStudent.save();
//     console.log('Student saved:', savedStudent);

//     // Close the connection after saving
//     await mongoose.connection.close();
//   } catch (error) {
//     console.error('Error saving student:', error);
//   }
// }

// connectAndSaveStudent();



const mongoose = require('mongoose');

  const studentSchema = new mongoose.Schema({
    name: String,
    rollNo:  String,
    enrollmentNo: {
      type: String,
      unique: true,
    },
    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Class',
      // Reference to the Class model
    },
    // Other fields you want to include
  });

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;

