const router = require('express').Router();

const facultyController = require('../controllers/facultyControllers');

router.get('/', facultyController.getAllFaculties);

// router.get('/:id', (req, res) => {
//   // Retrieve a specific faculty member by ID
//   const facultyId = req.params.id;

//   Faculty.findById(facultyId, (err, facultyMember) => {
//     if (err) {
//       console.error('Error retrieving faculty member:', err);
//       return res.status(500).json({ error: 'Could not retrieve faculty member' });
//     }

//     if (!facultyMember) {
//       return res.status(404).json({ message: 'Faculty member not found' });
//     }

//     // Send a successful response with the faculty member details
//     res.status(200).json(facultyMember);
//   });
// });

// Create a route to add new faculty members


router.post('/', facultyController.createNewFaculty);
  
router.get('/classes/:name', facultyController.getFacultyClassses);

  router.put('/:id', facultyController.updateFaculty);


router.delete('/:id', facultyController.deleteFaculty);
  

  module.exports = router;
