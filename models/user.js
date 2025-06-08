mongoose=require("mongoose");
let Schema= mongoose.Schema;
const passportLocalMongoose=require("passport-local-mongoose")

const userSchema=new Schema({
    email:{
        type:String,
        required:true
    }
})

userSchema.plugin(passportLocalMongoose)//here  username and hashed and salted password automaitcally added due to this 
//package
module.exports=mongoose.model("User",userSchema)
