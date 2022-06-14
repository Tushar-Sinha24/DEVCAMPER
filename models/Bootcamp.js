const mongoose=require('mongoose');
const slugify = require('slugify');
const geocoder = require('../utils/geoCoder');

const BootcampSchema=new mongoose.Schema({
    name:{
        type:String,
        required : [true, 'please add a name'],
        unique:true,
        trim:true,
        maxlength:[50, 'Name can not be more than 50 charachter']
    },
    slug:String,

    description:{
        type:String,
        required : [true, 'please add a description'],
        maxlength:[500, 'Description can not be more than 500 charachter']
    },

    website:{
        type:String,
        match:[
            /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
            'Please use a valid URL with HTTP or HTTPS'
        ]
    },

    phone:{
        type:String,
        required : [true, 'please add a description'],
        maxlength:[10, 'phone no. cannot be longer than 10 charchter']
    },

    email:{
        type:String,
        match:[
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please use a valid email'
        ]
    },

    address: {
        type:String,
        required:[true,'Please add and adress'],
        location: {
            type: {
              type: String, // Don't do `{ location: { type: String } }`
              enum: ['Point'], // 'location.type' must be 'Point'
               
            },
            coordinates: {
              type: [Number],
              required: true,
              index:'2dsphere'
            },
            formatedAddress: String,
            street: String,
            city: String,
            state: String,
            zipcode: String,
            country: String,
          }
    },

    

      careers:{
          type:[String],
          required:true,
          enum:[
            "Web Development",
             "UI/UX", 
             "Business",
             "Mobile Development",
             "Data Science",
             'Other'
          ]
      },
      averageRating:{
          type:Number,
          min:[1,'rating must be atleast 1'],
          max: [10,'Rating can not be more than 10']
      },
      averageCost:Number,

      photo:{
          type:String,
          default:'no-photo.jpg'
      } ,
      housing:{
          type: Boolean,
          default:false
      },
      jobAssistance:{
        type: Boolean,
        default:false
    },
    jobGuarantee:{
        type: Boolean,
        default:false
    },
    acceptGi:{
        type: Boolean,
        default:false
    },
    createdAt:{
        type:Date,
        default:Date.now
    },


});

//Create bootcamp slug from the name

BootcampSchema.pre('save',function(next){
    this.slug =slugify(this.name,{ lower:true });
    next();
})


//Geocode& create location field
BootcampSchema.pre('save',async function(next){
    const loc =  await geocoder.geocode(this.address);
    this.location={
        type: 'Point',
        coordinates:[loc[0].longitude,loc[0].latitude],
        formatedAddress: loc[0].formatedAddress,
        street:loc[0].streetName,
        city:loc[0].city,
        state:loc[0].stateCode,
        zipcode:loc[0].zipcode,
        country:loc[0].countryCode
    }

    // Do not Save adreess in DB
    this.address = undefined;
    next();
})

module.exports=mongoose.model('Bootcamp',BootcampSchema);