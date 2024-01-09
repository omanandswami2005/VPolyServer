const Student = require('../models/Student');
const Class = require('../models/Class');
const Attendance = require('../models/studentAttendance')

const mongoose = require('mongoose');


const studentController = {

  addStudents: async (req, res) => {
    try {
      const { name, rollNo, enrollmentNo, class: classId } = req.body;

      // Create a new student and save it to the database
      const newStudent = new Student({ name, rollNo, enrollmentNo, class: classId });
      const student = await newStudent.save();

      // Add the student to the corresponding class's students array
      const classs = await Class.findById(classId);
      classs.students.push(student);
      await classs.save();

      res.status(201).json({ message: 'Student added successfully', data: student })

    } catch (error) {
      console.error('Error adding students', error);
      res.status(500).json({ error: 'Error adding students' });
    }
  },
  getAllStudents: async (req, res) => {
    try {
      const students = await Student.find().populate('class');
      res.status(200).json(students);
      // console.log(students);
    } catch (error) {
      console.error('Error fetching students', error);
      res.status(500).json({ error: 'Error fetching students' });
    }
  },

  getStudentsByClass: async (req, res) => {
    try {
      const class1 = req.params.class;
      console.log(class1);
      const students = await Class.find({ name: class1 }).populate('students');
      const studentsArray = students[0].students;
      console.log(studentsArray);
      const studentInfoArray = studentsArray.map(student => ({
        name: student.name,
        rollNo: student.rollNo, // Assuming "rollNo" is the property name
        enrollmentNo: student.enrollmentNo, // Assuming "enrollmentNo" is the property name
      }));    // console.log(namesArray);
      res.status(200).json(studentInfoArray);
    } catch (error) {
      console.error('Error fetching students', error);
      res.status(500).json({ error: 'Error fetching students' });


    }
  },
  updateStudent:  async (req, res) => {
    const { id } = req.params;
    const { name, rollNo, enrollmentNo, selectedClassId } = req.body;
  
    try {
      const updatedStudent = await Student.findByIdAndUpdate(id, { name, rollNo, enrollmentNo }, { new: true });


      // Update Attendance document
    await Attendance.findOneAndUpdate({ studentId: id }, { studentName: name, studentEnrollmentNo: enrollmentNo }, { new: true });

      if (!updatedStudent) {
        return res.status(404).json({ message: 'Class not found' });
      }
  
      // Fetch the student to get the associated class ID before updating
      const student = await Student.findById(id).populate('class');
  
      if (!student) {
        throw new Error('Student not found');
      }
  
      const currentClassId = student.class ? student.class._id : null;
  
      // If currentClassId is not N/A, update the Class model to remove the student reference from the current class
      if (currentClassId) {
        await Class.findByIdAndUpdate(currentClassId, { $pull: { students: id } });
      }
  
      if (selectedClassId) {
        // Fetch the existing student in the new class with the same roll number
        const existingStudentInNewClass = await Student.findOne({
          _id: { $ne: id },
          class: selectedClassId,
          rollNo,
        });
  
        if (existingStudentInNewClass) {
          // Throw an error if a student with the same roll number already exists in the new class
          return res.status(400).json({ message: 'Every class must have a unique roll number' });
        }
  
        // Update the student with the new class ID
        await Student.findByIdAndUpdate(id, { $set: { class: selectedClassId } }, { new: true });
  
       
        // Update the Class model to add the student reference to the new class
        await Class.findByIdAndUpdate(selectedClassId, { $addToSet: { students: id } });
      }
  
      return res.json(updatedStudent);
    } catch (error) {
      console.error('Error updating class:', error);
      return res.status(500).json({ message: 'Error updating class' });
    }
  },
  deleteStudent: async (req, res) => {
    try {
      const studentId = req.params.studentId;
  
      // Fetch the student to get the associated class ID before deletion
      const student = await Student.findById(studentId).populate('class');
  
      if (!student) {
        return res.status(404).json({ message: 'Student not found' });
      }
  
      const classId = student.class ? student.class._id : null;
  
      // Fetch and delete attendance records associated with the student
      const attendanceRecords = await Attendance.find({ studentId: studentId });
      await Attendance.deleteMany({ studentId: studentId });
      console.log(attendanceRecords);
  
      if (classId) {
        // Update the Class model to remove the student reference
        await Class.findByIdAndUpdate(classId, { $pull: { students: studentId } });
      }
  
      // Delete the student
      await Student.findByIdAndDelete(studentId);
  
      // Respond with the classId and deleted attendance records
      res.json({ classId, deletedAttendanceRecords: attendanceRecords });
    } catch (error) {
      console.error(`Error deleting student with ID ${error}`);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },
  deleteAllStudent: async (req, res) => {
    const { selectedStudents } = req.body;
    try {
      // Fetch the first selected student to get the associated class ID before deletion
      const firstStudent = await Student.findById(selectedStudents[0]).populate('class');
  
      if (!firstStudent) {
        return res.status(404).json({ message: 'Student not found' });
      }
  
      const classId = firstStudent.class ? firstStudent.class._id : null;
  
      // Fetch and delete attendance records associated with the students
      const attendanceRecords = await Attendance.find({ studentId: { $in: selectedStudents } });
      await Attendance.deleteMany({ studentId: { $in: selectedStudents } });
      console.log(attendanceRecords);
  
      if (classId) {
        // Update the Class model to remove the students reference
        await Class.findByIdAndUpdate(classId, { $pullAll: { students: selectedStudents } });
      }
  
      // Delete the selected students
      await Student.deleteMany({ _id: { $in: selectedStudents } });
  
      // Respond with the classId and deleted attendance records
      res.json({ classId, deletedAttendanceRecords: attendanceRecords });
    } catch (error) {
      console.error('Error deleting students', error);
      res.status(500).json({ error: 'Error deleting students' });
    }
  }
  
  ,
  
}

const updateClassForStudent = async (res,studentId, newClassId) => {
  try {
    // console.log(studentId, "newClassId:", newClassId);
    // Fetch the student to get the associated class ID before updating
    const student = await Student.findById(studentId).populate('class');

    if (!student) {
      throw new Error('Student not found');
    }

    const currentClassId = student.class ? student.class._id : null;
// console.log(currentClassId, newClassId, studentId);
    // If currentClassId is not N/A, update the Class model to remove the student reference from the current class
    if (currentClassId) {
      await Class.findByIdAndUpdate(currentClassId, { $pull: { students: studentId } });
    }
    // console.log('newClassId:', newClassId);
    // console.log('isValid:', mongoose.Types.ObjectId.isValid(newClassId));
    
    if (!newClassId || !mongoose.Types.ObjectId.isValid(newClassId)) {
      throw new Error('Invalid new class ID');
    }
    const existingStudentInNewClass = await Student.findOne({
      _id: { $ne: studentId },
      class: newClassId,
      rollNo: student.rollNo,
    });

    if (existingStudentInNewClass) {
      // Throw an error if a student with the same roll number already exists in the new class
      throw new Error('Every class must have a unique roll number');
    }
    // Update the student with the new class ID
    await Student.findByIdAndUpdate(studentId, { $set: { class: newClassId } }, { new: true });

    // Update the Class model to add the student reference to the new class
    await Class.findByIdAndUpdate(newClassId, { $addToSet: { students: studentId } });

    return newClassId;
  } catch (error) {
    if (error.message === 'Every class must have a unique roll number' || error.code === 11000) {
      // Send a specific error message in the response
      res.status(400).json({ message: 'Every class must have a unique roll number' });
    } else {
      // Other errors
      console.error(`Error updating class for student with ID ${studentId}: ${error}`);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
};


module.exports = studentController;