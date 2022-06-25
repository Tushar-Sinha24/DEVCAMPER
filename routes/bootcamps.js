const express = require('express');

const { getBootcamps, getBootcamp, createBootcamp, deleteBootcamp, updateBootcamp ,getBootcampInRadius , bootcampPhotoUpload} = require('../controllers/bootcamps.js')

//Includes other resoursces router
const courseRouter = require('./courses');

const router = express.Router();

//Re-route into other resource routers
router.use('/:bootcampId/courses' ,courseRouter) ;

router.route('/radius/:zipcode/:distance').get(getBootcampInRadius);

router.route('/').get(getBootcamps).post(createBootcamp);

router.route('/:id').get(getBootcamp).put(updateBootcamp).delete(deleteBootcamp);

router.route('/:id/photo').put(bootcampPhotoUpload);

module.exports = router;