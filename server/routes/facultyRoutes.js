const router = require('express').Router();
const Faculty = require('../models/Faculty');



// Create a route to add new faculty members
router.post('/faculty', async (req, res) => {
    try {
      const { name, classesTeaching } = req.body;
      const faculty = new Faculty({ name, classesTeaching });
      await faculty.save();
      res.status(201).json(faculty);
    } catch (error) {
      res.status(500).json({ error: 'Failed to add a new faculty member' });
    }
  });
  


  router.put('/faculty/:facultyId', async (req, res) => {
    try {
      const { name, classesTeaching } = req.body;
      const facultyId = req.params.facultyId;
      
      const updatedFaculty = await Faculty.findByIdAndUpdate(facultyId, { name, classesTeaching }, { new: true });
      
      if (!updatedFaculty) {
        return res.status(404).json({ error: 'Faculty member not found' });
      }
      
      res.status(200).json(updatedFaculty);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update the faculty member' });
    }
  });



  router.delete('/faculty/:facultyId', async (req, res) => {
    try {
      const facultyId = req.params.facultyId;
      
      const deletedFaculty = await Faculty.findByIdAndDelete(facultyId);
      
      if (!deletedFaculty) {
        return res.status(404).json({ error: 'Faculty member not found' });
      }
      
      res.status(204).send(); // Send a 204 No Content status upon successful deletion
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete the faculty member' });
    }
  });
  
  




  module.exports = router;
