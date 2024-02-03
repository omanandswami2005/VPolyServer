const mongoose = require('mongoose');

const studentAttendanceSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
  },
  studentName: {
    type: String,
    required: false,
  },
  studentRollNo: {
    type: String
  },
  studentEnrollmentNo: {
    type: String
  },
  date: {
    type: Date,
    required: true,
  },
  timeSlot: {
    type: String,
    required: true,
  },
  present: {
    type: Boolean,
    required: true,
  },
});

const StudentAttendance = mongoose.model('StudentAttendance', studentAttendanceSchema);

module.exports = StudentAttendance;
