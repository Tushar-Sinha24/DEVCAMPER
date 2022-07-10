const express = require('express');

const { getUsers, getUser ,createUser, updateUser , deleteUser} = require('../controllers/users.js')

const User =require('../models/User');


const router = express.Router({ mergeParams: true });

const advancedResult = require('../middileware/advancedResult');
const {protect, authorize} = require('../middileware/auth');

router.use(protect);
router.use(authorize("admin"));

router
.route('/').get(advancedResult(User),getUsers)
.post(createUser);


router.route('/:id')
.get(getUser)
.put(updateUser)
.delete(deleteUser);

module.exports = router; 