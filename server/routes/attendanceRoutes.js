const router = require('express').Router(); 

const authenticateJWT = require('../middleware/authMiddleware');

const attendanceControllers =require("../controllers/attendanceControllers");



router.get('/:studentEnrollmentNo', attendanceControllers.getAttendanceByStudentEnroll);

router.get('/', attendanceControllers.getAllAttendance);

 router.post('/manualattendance', attendanceControllers.getAllStudentForMalualAttendance);

  router.put('/update/:id', authenticateJWT,attendanceControllers.updateAttendance );
  
  router.put('/updateAll/:date/:timeSlot', attendanceControllers.updateAllAttendance);

  




module.exports = router;
