// models/faculty.js
const mongoose = require('mongoose');

const facultySchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    
  },
  role: {
    type: String,

  },
  id: {
    type: String,
    unique: true,
  },
  assignedClasses: [
    {
      type: String,
     // Reference to the Class model
    },
  ],
  password: {
    type: String,
  }
  // Other faculty attributes
});

const Faculty = mongoose.model('Faculty', facultySchema);

module.exports = Faculty;
