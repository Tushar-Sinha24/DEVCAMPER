const express = require('express');

const {getReviews ,getReview, addReview} = require('../controllers/review')

const Review =require('../models/Review');
const advancedResult = require('../middileware/advancedResult');

const router = express.Router({ mergeParams: true });
const {protect, authorize} = require('../middileware/auth');

router.route('/')
.get(advancedResult(Review,{
    path:"bootcamp",
    select:'name description'
}),getReviews)
.post(protect , authorize('user','admins') , addReview)

router.route('/:id').get(getReview);

module.exports = router; 