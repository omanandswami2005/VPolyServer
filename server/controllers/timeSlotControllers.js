// const mongoose = require('mongoose');
const TimeSlot = require('../models/TimeSlot');

const timeSlotControllers = {
createTimeSlot:async (req, res) => {
    try {
      const { startTime, endTime } = req.body;
      const newTimeSlot = await TimeSlot.create({ startTime, endTime });
      res.status(201).json({ newTimeSlot });
    } catch (error) {
      console.error('Error creating time slot:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  getTimeSlots:async (req, res) => {
    try {
      const timeSlots = await TimeSlot.find();
      res.json({ timeSlots });
    } catch (error) {
      console.error('Error fetching time slots:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },


}
module.exports = timeSlotControllers;