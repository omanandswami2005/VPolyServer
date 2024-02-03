const Faculty = require('../models/Faculty');


const facultyController = {

    getAllFaculties: async (req, res) => {
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
      },
      createNewFaculty:async (req, res) => {
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
      },

      getFacultyClassses:async (req, res) => {
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
      },
      updateFaculty:async (req, res) => {
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
    },
    deleteFaculty:async (req, res) => {
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
      },

}
module.exports=facultyController;