
const router = require('express').Router();
const studentController =require('../controllers/studentControllers')

router.get('/',studentController.getAllStudents );

router.post('/', studentController.addStudents);

  router.put('/:id',studentController.updateStudent);

router.get('/getstudentsbyclass/:class', studentController.getStudentsByClass);

  router.delete('/:studentId', studentController.deleteStudent);

  router.post('/deleteAllStudents',studentController.deleteAllStudent)


  module.exports = router;
