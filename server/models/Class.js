const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  name: {
    type: String,
  unique: true,
  },
  students: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student', // Reference to the Student model
  }],
  // Other class attributes
});

const Class = mongoose.model('Class', classSchema);

module.exports = Class;
