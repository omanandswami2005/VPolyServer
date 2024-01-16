const Student = require('../models/Student');
const Class = require('../models/Class');
const Attendance = require('../models/studentAttendance')

const mongoose = require('mongoose');


const studentController = {

  addStudents: async (req, res) => {
    const { studentData, classId } = req.body;

    try {
      // Fetch existing students in the class
      // const existingStudents = await Student.find({ class: classId }).sort('enrollmentNo').exec();

      //sort studentData by enrollmentNo
      // studentData.sort((a, b) => a.enrollmentNo - b.enrollmentNo);

      // Find the index where the new student should be inserted based on enrollmentNo
      // let insertIndex = existingStudents.findIndex(student => student.enrollmentNo > studentData[0].enrollmentNo);
      // console.log(insertIndex);

      // // so we insert at the beginning; otherwise, insertIndex is the correct position.
      // if (insertIndex === -1 && existingStudents.length > 0) {
      //   insertIndex = existingStudents.length;

      // }
      // else if (insertIndex === -1 && existingStudents.length === 0) {
      //   insertIndex = 0;
      // }

      // const startIndex = insertIndex === -1 ? 0 : insertIndex;
      // console.log(startIndex);

      // Calculate rollNo for new students based on enrollmentNo
      const newStudents = studentData.map((student, index) => ({
        name: student.name,
        enrollmentNo: student.enrollmentNo,
        class: classId,
        rollNo: index + 1
      }));

      // Insert new students into the database
      const addedStudents = await Student.insertMany(newStudents);
      console.log(addedStudents);


      // Update existing students' roll numbers
      await updateRollNumbers(classId);

      // Add the IDs of the added students to the Class model's students field
      await Class.findByIdAndUpdate(classId, { $addToSet: { students: { $each: addedStudents.map(student => student._id) } } });


      res.status(201).json({ message: 'Students added successfully', data: addedStudents });
    } catch (error) {
      console.error('Error adding students', error);
      res.status(500).json({ error: 'Error adding students' });
    }

  }
  ,
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
      // console.log(class1);
      const student = await Class.findOne({ name: class1 }).populate('students');

      const studentsArray = student.students;

      console.log(studentsArray);

      const studentInfoArray = studentsArray.map(student => ({

        name: student.name,
        rollNo: student.rollNo,
        enrollmentNo: student.enrollmentNo,

      }));    // console.log(namesArray);
      res.status(200).json(studentInfoArray);
    } catch (error) {
      console.error('Error fetching students', error);
      res.status(500).json({ error: 'Error fetching students' });


    }
  },









  updateStudent: async (req, res) => {
    const { id } = req.params;
    const { name, enrollmentNo, selectedClassId } = req.body;

    try {
      const updatedStudent = await Student.findByIdAndUpdate(id, { name, enrollmentNo }, { new: true });

      // Update Attendance document
      await Attendance.findOneAndUpdate({ studentId: id }, { studentName: name, studentEnrollmentNo: enrollmentNo }, { new: true });

      if (!updatedStudent) {
        return res.status(404).json({ message: 'Student not found' });
      }

      // Fetch the student to get the associated class ID before updating
      const student = await Student.findById(id).populate('class');

      if (!student) {
        throw new Error('Student not found');
      }

      const currentClassId = student.class._id;
      console.log(currentClassId);

      // If currentClassId is not null, update the Class model to remove the student reference from the current class
      if (currentClassId) {
        await Class.findByIdAndUpdate(currentClassId, { $pull: { students: id } });
      }

      if (selectedClassId) {
        // Fetch the existing student in the new class with the same roll number
        const existingStudentInNewClass = await Student.findOne({
          _id: { $ne: id },
          enrollmentNo,
        });

        if (existingStudentInNewClass) {
          // Throw an error if a student with the same enrollment number already exists in the new class
          return res.status(400).json({ message: 'Every class must have a unique enrollment number' });
        }

        // Update the student with the new class ID
        await Student.findByIdAndUpdate(id, { $set: { class: selectedClassId } });

        // Update the Class model to add the student reference to the new class
        await Class.findByIdAndUpdate(selectedClassId, { $addToSet: { students: id } });
      }
      await updateRollNumbers(selectedClassId);
      await updateRollNumbers(currentClassId);
      

      return res.json(updatedStudent);
    } catch (error) {
      console.error('Error updating student:', error);
      return res.status(500).json({ message: 'Error updating student' });
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

      // Update the remaining students' roll numbers
      await updateRollNumbers(classId);
      // Helper function to update roll numbers after deletion


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

      await updateRollNumbers(classId);


      // Respond with the classId and deleted attendance records
      res.json({ classId, deletedAttendanceRecords: attendanceRecords });
    } catch (error) {
      console.error('Error deleting students', error);
      res.status(500).json({ error: 'Error deleting students' });
    }
  },
}


async function updateRollNumbers(classId) {
  const remainingStudents = await Student.find({ class: classId }).sort('enrollmentNo').exec();

  remainingStudents.forEach(async (student, index) => {
    const newRollNo = index + 1;
    await Student.findByIdAndUpdate(student._id, { $set: { rollNo: newRollNo } });
  });
}


module.exports = studentController;