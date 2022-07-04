const express = require('express');

const { getBootcamps, getBootcamp, createBootcamp, deleteBootcamp, updateBootcamp ,getBootcampInRadius , bootcampPhotoUpload} = require('../controllers/bootcamps.js')

const  Bootcamp =require('../models/Bootcamp')

const advancedResults =require('../middileware/advancedResult');

//Includes other resoursces router
const courseRouter = require('./courses');
const router = express.Router();
const { protect ,authorize } = require('../middileware/auth')

//Re-route into other resource routers
router.use('/:bootcampId/courses' ,courseRouter) ;

router.route('/radius/:zipcode/:distance')
.get(getBootcampInRadius);

router.route('/')
.get(advancedResults(Bootcamp,'courses'),getBootcamps)
.post(protect , authorize('publisher','admin'), createBootcamp);

router.route('/:id')
.get(getBootcamp)
.put(protect ,authorize('publisher','admin'),updateBootcamp)
.delete(protect ,authorize('publisher','admin'),deleteBootcamp);

router.route('/:id/photo')
.put(protect,authorize('publisher','admin') ,bootcampPhotoUpload);

module.exports = router;