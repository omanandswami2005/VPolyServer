const router = require('express').Router(); 

const authenticateJWT = require('../middleware/authMiddleware');

const attendanceControllers =require("../controllers/attendanceControllers");



router.get('/:studentEnrollmentNo', attendanceControllers.getAttendanceByStudentEnroll);

 router.post('/manualattendance', attendanceControllers.getAllStudentForMalualAttendace);
  
  router.post('/manualAttendanceForToday',authenticateJWT,attendanceControllers.getAllStudentForMalualAttendaceToday );

  router.put('/update/:id', authenticateJWT,attendanceControllers.updateAttendance );
  




module.exports = router;
