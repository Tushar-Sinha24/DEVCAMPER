const mongoose=require('mongoose');
var bcrypt =require('bcryptjs');
var jwt = require('jsonwebtoken');
const { token } = require('morgan');

const UserSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Please add a name']
    },
    email:{
        type:String,
        required:[true,'Please add a email'],
        unique:true,
        match:[/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,'Please add a valid email']
    },
    role:{
        type:String,
        enum:['user','publisher'],
        default:'user'
    },
    password:{
        type:String,
        required:[true,'Please add a password'],
        minlength:6,
        select:false
    },
    resetPasswordToken: String,
    resetPasswordExpirre:Date,
    createdAt:{
        type:Date,
        default:Date.now
    }
});

//encrypt password using bcrypt
UserSchema.pre('save', async function(next){
    var salt = bcrypt.genSaltSync(10);
    this.password = bcrypt.hashSync(this.password, salt);
} );

//Sign JWT and return
UserSchema.methods.getSignedJwtTokens= function(){
    return jwt.sign({ id : this._id }, process.env.JWT_SECRET , {
        expiresIn: process.env.JWT_EXPIRE
    });
}

//Match usr password to hash password
UserSchema.methods.matchPassword=async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password)
}


module.exports=mongoose.model('User',UserSchema);