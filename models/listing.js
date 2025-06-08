mongoose=require("mongoose");

let Schema= mongoose.Schema;
const listingSchema= new Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,

    },
    image:{
        type:String,
        default:'https://plus.unsplash.com/premium_photo-1676228998257-baac26ee1191?q=80&w=1954&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',//if image file is not sent from frontend ex:- sending by 
        //postman 
        
        
         set:(v)=>v===""?'https://plus.unsplash.com/premium_photo-1676228998257-baac26ee1191?q=80&w=1954&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D':v ,//if image
         //is blank then paste the image else go with given image link 
    },
    price:{
        type:Number
    },
    location:{
        type:String
    },
    country:{
        type:String
    },
    reviews:[
        {
            type:Schema.Types.ObjectId,//this is the a way to define data type of ObjecId
            ref:"Review"// model whose object id is beign referance 
        }
    ],
    owner:{
       type:Schema.Types.ObjectId,
       ref:"User"
    }
})

const Review= require('./review.js')//first required listing
//now  if a listing is deleted then if id is in reviews 
//note :- we are appling 'post' method on listingSchema and also 
//used it before this:-  "         const Listing=mongoose.model('Listing',listingSchema);
//                                 module.exports=Listing; "         or else code will not work                     
//here  used findByIdAndDelete which invokes findOneAndDelete


listingSchema.post('findOneAndDelete',async (listing)=>{
    if(listing){
     
    let del= await Review.deleteMany({_id:{$in:listing.reviews}})
    console.log(del)
    }
})

const Listing=mongoose.model('Listing',listingSchema);
module.exports=Listing;