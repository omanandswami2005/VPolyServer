const router = require('express').Router();

const facultyController = require('../controllers/facultyControllers');

router.get('/', facultyController.getAllFaculties);

router.post('/', facultyController.createNewFaculty);

router.get('/classes/:name', facultyController.getFacultyClassses);

router.put('/:id', facultyController.updateFaculty);


router.delete('/:id', facultyController.deleteFaculty);


module.exports = router;
