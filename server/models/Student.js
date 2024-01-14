const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: String,
  rollNo: {
    type: Number,
    // required: true,
  },
  enrollmentNo: {
    type: Number,
  },
  class: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Class',
  },
  // Other fields you want to include
});

// Ensure that the combination of class and rollNo is unique
// studentSchema.index({ class: 1, rollNo: 1 }, { unique: true });

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
