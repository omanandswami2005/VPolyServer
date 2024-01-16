const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: String,
  enrollmentNo: {
    type: Number,
    required: true,
    unique: true, // Ensure enrollment numbers are unique
  },
  class: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Class',
  },
  rollNo: Number, // Roll number will be automatically assigned
});



const Student = mongoose.model('Student', studentSchema);
module.exports = Student;
