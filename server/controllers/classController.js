
const mongoose = require('mongoose');
const Class = mongoose.model('Class');
const Faculty = require('../models/Faculty');

const classController = {

    getAllClasses: async (req, res) => {
        try {
          const classes = await Class.find({}, 'name');
          res.status(200).json(classes);
          // console.log(classes);
        } catch (error) {
          console.error('Error fetching classes', error);
          res.status(500).json({ error: 'Error fetching classes' });
        }
      }


      ,

      addClass: async (req, res) => {
        try {
          const { classNames } = req.body;
      
          // Create a new class for each className and save it to the database
          const classDocuments = await Promise.all(
            classNames.map(async (className) => {
              const newClass = new Class({ name: className });
              return newClass.save();
            })
          ).then((classDocuments) => {
            res.status(201).json({ data:true,message: 'Classes added successfully', data: classDocuments });
            console.log('Classes added successfully', classDocuments);
            
          }).catch((error) => {
            console.log('already added', error);
            res.status(500).json({ error: 'Error adding classes' });
          });
      
        
        } catch (error) {
          // console.log('Error adding classes', error);
          res.status(500).json({ error: 'Error adding classes' });
        }
      },
      updateClass: async (req, res) => {
        const { id } = req.params;
      const { name } = req.body;
      
      try {
        const updatedClass = await Class.findByIdAndUpdate(id, { name }, { new: true });
      
        if (!updatedClass) {
          return res.status(404).json({ message: 'Class not found' });
        }
      
        return res.json(updatedClass);
      } catch (error) {
        console.error('Error updating class:', error);
        return res.status(500).json({ message: 'Error updating class' });
      }
      }
      ,

      deleteClass:async (req, res) => {
        const classId = req.params.id;
        try {
          // Find the class by ID and delete it
          const deletedClass = await Class.findByIdAndDelete(classId);
      
          // If the class was deleted, update faculty members
          if (deletedClass) {
            // Update faculty members with the deleted class in their assignedClasses array
            await Faculty.updateMany(
              { assignedClasses: deletedClass.name },
              { $pull: { assignedClasses: deletedClass.name } }
            );
      
            res.json({ message: `Class with ID ${classId} deleted successfully.` });
          } else {
            res.status(404).json({ message: 'Class not found.' });
          }
        } catch (error) {
          console.error(`Error deleting class with ID ${classId}: ${error}`);
          res.status(500).json({ message: 'Internal Server Error' });
        }
      }
}

module.exports = classController;