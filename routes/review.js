const express = require('express');

const {getReviews ,getReview, addReview, updateReview, deleteReview} = require('../controllers/review')

const Review =require('../models/Review');
const advancedResult = require('../middileware/advancedResult');

const router = express.Router({ mergeParams: true });
const {protect, authorize} = require('../middileware/auth');

router.route('/')
.get(advancedResult(Review,{
    path:"bootcamp",
    select:'name description'
}),getReviews)
.post(protect , authorize('user','admin') , addReview)

router.route('/:id')
.get(getReview)
.put(protect , authorize('user','admin') , updateReview)
.delete(protect , authorize('user','admin') , deleteReview)


module.exports = router; 