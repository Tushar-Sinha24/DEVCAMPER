const express = require('express');

const { getCourses,getCourse , addCourse,deleteCourse , updateCourse} = require('../controllers/courses.js')

const Course =require('../models/Course');
const advancedResult = require('../middileware/advancedResult');

const router = express.Router({ mergeParams: true });
const {protect, authorize} = require('../middileware/auth');

router.route('/')
.get(advancedResult(Course,{
    path:"bootcamp",
    select:'name description'
}),getCourses)
.post(protect ,authorize('publisher','admin'),addCourse);

router.route('/:id')
.get(getCourse)
.delete(protect ,authorize('publisher','admin'),deleteCourse)
.put(protect ,authorize('publisher','admin'),updateCourse);

module.exports = router; 