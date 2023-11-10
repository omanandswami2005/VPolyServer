const Student = require('../models/Student');
const router = require('express').Router();


// Create a route to add new students to a class
router.post('/students', async (req, res) => {
    try {
      const { name, rollNo, enrollmentNo, classId } = req.body;
      const student = new Student({ name, rollNo, enrollmentNo, class: classId });
      await student.save();
      res.status(201).json(student);
    } catch (error) {
      res.status(500).json({ error: 'Failed to add a new student' });
    }
  });


  router.put('/students/:studentId', async (req, res) => {
    // Implement the logic to update a student by studentId
    try {
      // Get the studentId from req.params
      const studentId = req.params.studentId;
      // Update the student based on studentId
      // ...
      res.status(200).json(updatedStudent);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update the student' });
    }
  });


  router.delete('/students/:studentId', async (req, res) => {
    // Implement the logic to delete a student by studentId
    try {
      // Get the studentId from req.params
      const studentId = req.params.studentId;
      // Delete the student based on studentId
      // ...
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete the student' });
    }
  });


  module.exports = router;
