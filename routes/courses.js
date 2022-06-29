const express = require('express');

const { getCourses,getCourse , addCourse,deleteCourse , updateCourse} = require('../controllers/courses.js')

const Course =require('../models/Course');
const advancedResult = require('../middileware/advancedResult');

const router = express.Router({ mergeParams: true });

router.route('/')
.get(advancedResult(Course,{
    path:"bootcamp",
    select:'name description'
}),getCourses)
.post(addCourse);

router.route('/:id')
.get(getCourse)
.delete(deleteCourse)
.put(updateCourse);

module.exports = router;