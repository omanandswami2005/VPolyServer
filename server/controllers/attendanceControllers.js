const Class = require('../models/Class');
const StudentAttendance = require('../models/studentAttendance');
const Student = require('../models/Student');



const attendanceControllers = {

  getAttendanceByStudentEnroll:
    async (req, res) => {
      const studentEnrollmentNo = req.params.studentEnrollmentNo;

      const { startDate, endDate, selectedMonth, selectedTimeSlot } = req.query;
      // console.log( startDate, endDate, selectedMonth,selectedTimeSlot);

      try {
        const year = new Date().getFullYear();
        let startDateTime, endDateTime;

        if (selectedMonth !== undefined) {
          const month = Number(selectedMonth);
          startDateTime = new Date(year, month, 2);
          endDateTime = new Date(year, month + 1, 1);
        } else {
          startDateTime = startDate ? new Date(startDate) : new Date(0);
          endDateTime = endDate ? new Date(endDate) : new Date();
        }

        const attendanceData = await StudentAttendance.find({
          studentEnrollmentNo,
          date: { $gte: startDate ? startDate : startDateTime, $lte: endDate ? endDate : endDateTime },
          timeSlot: selectedTimeSlot
        });

        res.json(attendanceData);
      } catch (error) {
        console.error('Error fetching attendance data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    }
  ,




  getAllAttendance: async (req, res) => {
    const enrollArray = req.query.enrollArray;
    const selectedClass = req.query.selectedClass;
    const selectedMonth = req.query.selectedMonth;
    const selectedTimeSlot = req.query.selectedTimeSlot;
    const { startDate, endDate } = req.query;

    console.log(selectedMonth ? "yes" : "", selectedTimeSlot ? "yes" : "");

    try {
      const year = new Date().getFullYear();
      let startDateTime, endDateTime;

      if (selectedMonth !== undefined) {
        const month = Number(selectedMonth);
        startDateTime = new Date(year, month, 2);
        endDateTime = new Date(year, month + 1, 1);
      } else {
        startDateTime = startDate ? new Date(startDate) : new Date(0);
        endDateTime = endDate ? new Date(endDate) : new Date();
      }

      const attendanceData = await StudentAttendance.find({
        studentEnrollmentNo: { $in: enrollArray },
        date: { $gte: startDate ? startDate : startDateTime, $lte: endDate ? endDate : endDateTime },
        timeSlot: selectedTimeSlot
      });
      console.log(attendanceData);
      res.json(attendanceData);
    } catch (error) {
      console.error('Error fetching attendance data:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },



  getAllStudentForMalualAttendance: async (req, res) => {
    const { selectedDate, selectedTimeSlot, className } = req.body;
  
    try {
      // Find the class by name and populate its students
      const classData = await Class.findOne({ name: className }).populate('students', 'name enrollmentNo rollNo');
  
      if (!classData) {
        return res.status(404).json({ message: `Class '${className}' not found.` });
      }
  const currentDate = new Date(selectedDate);
  currentDate.setUTCHours(0,0,0,0);

// currentDate.setDate(currentDate.getDate() + 1);

      console.log(`Class: ${classData.name}`);
      console.log('Students:');
  
      // Get an array of existing student IDs for the given date and time slot
      const existingStudentIds = (
        await StudentAttendance.find({
          date: currentDate,
          timeSlot: selectedTimeSlot,
        })
      ).map((attendance) => attendance.studentId.toString());
  
      // Filter students who are not present and whose attendance record does not exist
      const studentsToAdd = classData.students
        .filter((student) => !existingStudentIds.includes(student._id.toString()))
        .map((student) => ({
          studentId: student._id,
          date: currentDate,
          timeSlot: selectedTimeSlot,
          present: false,
        }));
  
      // Insert new student attendance records if there are any
      if (studentsToAdd.length > 0) {
        await StudentAttendance.insertMany(studentsToAdd);
      }
  
      // Now, send all the student attendance data as a response, including both existing and newly added records
      const allStudentAttendance = await StudentAttendance.find({
        date: currentDate,
        timeSlot: selectedTimeSlot,
      }).populate({
        path: 'studentId',
        select: 'name enrollmentNo rollNo',
        populate: {
          path: 'class', // Populate the class field in studentId
        },
      });
  
      const filteredStudentAttendance = allStudentAttendance.filter(
        (attendance) => attendance.studentId?.class?.name === className
      );
  
      console.log(filteredStudentAttendance);
      console.log(currentDate)
      const finalAttendance = filteredStudentAttendance.map((attendance) => ({
        _id: attendance.studentId._id,
        name: attendance.studentId.name,
        enrollmentNo: attendance.studentId.enrollmentNo,
        rollNo: attendance.studentId.rollNo,
        present: attendance.present.toString(),
      }))
  
      res.json({ data: true, studentAttendance: finalAttendance });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
  ,




  
  updateAttendance: async (req, res) => {

    const studentEnrollmentNo = req.params.id;
    const { selectedDate, selectedTimeSlot } = req.body;
    console.log(studentEnrollmentNo, selectedDate, selectedTimeSlot);
    try {
      
      const currentDate = new Date(selectedDate);
      currentDate.setUTCHours(0,0,0,0);

    
    const student = await Student.findOne({ enrollmentNo: studentEnrollmentNo });
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Also update the corresponding record in the main database
    const mainRecord = await StudentAttendance.findOne({
      studentId: student._id,
      date: currentDate,
      timeSlot: selectedTimeSlot,
    });

      if (!mainRecord) {
        // If the record doesn't exist in the main database, return an error
        return res.status(404).json({ error: 'Record not found' });
      }
      // console.log("Mainrecbefor" + mainRecord);

      mainRecord.present = !mainRecord.present;
      await mainRecord.save();
      
      console.log("Mainrecafter" + mainRecord);

      res.json({ data: true, mainRecord });
      // res.json({ data: true, userData });
    } catch (error) {
      console.error('Error updating data:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },



  updateAllAttendance: async (req, res) => {
    const { date, timeSlot } = req.params;
    const { present, className } = req.body;

    console.log(date, timeSlot, present,className);
  
    try {
      const currentDate = new Date(date);
      // currentDate.setMilliseconds(0);
      currentDate.setUTCHours(0,0,0,0);
      // currentDate.setDate(currentDate.getDate() + 1);
      // Find all students for the given date, time slot, and class
      const students = await StudentAttendance.find({
        date: currentDate,
        timeSlot,
      }).populate({
        path: 'studentId',
        match: { 'class.name': className }, // Filter students based on class name
        populate: {
          path: 'class', // Populate the class field in studentId
        },
      });
      console.log(students);
  
      // Update the present status for all students
      await Promise.all(
        students.map(async (student) => {
          // Update the present status directly
          student.present = present;
          await student.save();
        })
      );
  
      res.json({ message: 'Attendance updated successfully' });
    } catch (error) {
      console.error('Error updating all students:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },


  

}

module.exports = attendanceControllers;