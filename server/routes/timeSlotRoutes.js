const router = require('express').Router();
const timeSlotControllers = require('../controllers/timeSlotControllers');

router.post('/create-time-slot', timeSlotControllers.createTimeSlot);
  
  // Route to get all time slots
  router.get('/time-slots',timeSlotControllers.getTimeSlots );

  router.delete('/deleteTimeSlot/:id', timeSlotControllers.deleteTimeSlot);
  

module.exports = router;
