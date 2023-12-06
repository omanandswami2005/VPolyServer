const Class = require('../models/Class');
const router = require('express').Router();
const classController = require('../controllers/classController');

  
router.get('/',classController.getAllClasses );

router.post('/',classController.addClass);

router.put('/:id', classController.updateClass);

router.delete('/:id', classController.deleteClass);



  module.exports = router;
