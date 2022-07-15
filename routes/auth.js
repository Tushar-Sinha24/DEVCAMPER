const express = require('express');
const{register, login ,getMe ,forgotPassword , resetPassword,updateDetails, updatePassword,logout} =require('../controllers/auth')

const router = express.Router();

const {protect}=require('../middileware/auth')

router.post('/register', register);

router.post('/login', login);

router.post('/forgotpassword', forgotPassword);

router.put('/updatedetails',protect, updateDetails);
router.put('/updatepassword',protect, updatePassword);

router.put('/resetpassword/:resettoken',resetPassword);

router.get('/me',protect, getMe);

router.get('/logout', logout);

module.exports=router;