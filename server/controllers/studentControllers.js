const Student = require('../models/Student');
const Class = require('../models/Class');



const studentController = {

addStudents:async (req, res) => {
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
getAllStudents:async (req, res) => {
    try {
      const students = await Student.find().populate('class');
      res.status(200).json(students);
      console.log(students);
    } catch (error) {
      console.error('Error fetching students', error);
      res.status(500).json({ error: 'Error fetching students' });
    }
  },
  
  getStudentsByClass:async (req, res) => {
    try {
      const class1 = req.params.class;
      console.log(class1);
      const students = await Class.find({name:class1}).populate('students');
      const studentsArray =students[0].students;
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
  updateStudent:async (req, res) => {
    const { id } = req.params;
  const { name, rollNo, enrollmentNo,selectedClassId } = req.body;
console.log(selectedClassId);
  try {
    const updatedStudent = await Student.findByIdAndUpdate(id, { name, rollNo, enrollmentNo, class:  selectedClassId }, { new: true });

    if (!updatedStudent) {
      return res.status(404).json({ message: 'Class not found' });
    }

    return res.json(updatedStudent);
  } catch (error) {
    console.error('Error updating class:', error);
    return res.status(500).json({ message: 'Error updating class' });
  }
  },
  deleteStudent:async (req, res) => {
    const { id } = req.params;
    try {
      const deletedStudent = await Student.findByIdAndDelete(id);
  
      if (!deletedStudent) {
        return res.status(404).json({ message: 'Class not found' });
      }
  
      return res.json({ message: 'Class deleted successfully' });
    } catch (error) {
      console.error('Error deleting class:', error);
      return res.status(500).json({ message: 'Error deleting class' });
    }
  },
}

module.exports=studentController;