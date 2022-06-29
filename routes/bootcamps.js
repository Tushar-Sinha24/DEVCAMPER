const express = require('express');

const { getBootcamps, getBootcamp, createBootcamp, deleteBootcamp, updateBootcamp ,getBootcampInRadius , bootcampPhotoUpload} = require('../controllers/bootcamps.js')

const  Bootcamp =require('../models/Bootcamp')

const advancedResults =require('../middileware/advancedResult');

//Includes other resoursces router
const courseRouter = require('./courses');

const router = express.Router();

//Re-route into other resource routers
router.use('/:bootcampId/courses' ,courseRouter) ;

router.route('/radius/:zipcode/:distance')
.get(getBootcampInRadius);

router.route('/')
.get(advancedResults(Bootcamp,'courses'),getBootcamps)
.post(createBootcamp);

router.route('/:id')
.get(getBootcamp)
.put(updateBootcamp)
.delete(deleteBootcamp);

router.route('/:id/photo')
.put(bootcampPhotoUpload);

module.exports = router;