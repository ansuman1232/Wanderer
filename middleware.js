 //=========require=================
 const Listing=require('./models/listing.js');
 const Review=require("./models/review.js")
 const {schemaJoi,reviewSchemaJoi}=require('./validSchemaJoi.js');//requiring
 //requiring my error class==========================
const MyError=require("./utils/myError.js");
//  =====================================
 module.exports.isLoggedIn=((req,res,next)=>{//to check is user login or not
    if(!req.isAuthenticated()){//this is triggred by req.user which have user details
     //if user not loged in the redirect ot login page
  if (req.method === "GET") {
      req.session.redirect = req.originalUrl;//here save the orginalUrl where user wants to go before loggedin 
      // This ensures only navigational routes (like viewing a page) get saved.
// Not dangerous methods like DELETE, PUT, or POST.
//as when I am clicking on delete review  before login, then it was redirecting me to delete route only
//and showing that web page was not found
    }
     
     req.flash("error","you are not logged in!")
   return  res.redirect('/user/login')
    }
    next();//else call next 
 })


 module.exports.saveUserUrl=((req,res,next)=>{//to save the url of the page before login ,so that 
  //user can be redirected to a the same page if they logged successfully
   res.locals.redirect=req.session.redirect;//store it in locals as session will reset after login.
   console.log(res.locals.redirect)
   next();//call the next middleware
 })


 module.exports.isOwner=(async (req,res,next)=>{//to check current user is owner of listing or not
  let {id}=req.params;
    let data= await Listing.findById(id)
    
    if(!res.locals.currUser._id.equals(data.owner)){
      
      req.flash("error","you are not the owner of this listing");
      
      return res.redirect( `/listing/${id}`)
    }
    next();
 })


 module.exports.isReview=(async (req,res,next)=>{//to check is current user had done the reivew or not
  let {id,reviewId}=req.params;
  console.log(req.params);
    let review= await Review.findById(reviewId)
    
    if(!res.locals.currUser._id.equals(review.author)){
      
      req.flash("error","you are not the owner of this review");
      
      return res.redirect( `/listing/${id}`)
    }
    next();
 })

 module.exports.validateSchema=function(req,res,next){//middleware to check

        //if errror any filed or whole listing body is missing then throw error
let {error}= schemaJoi.validate(req.body);//here first extracted the error from the req body
//let errMsg=error.details.map((el)=>el.message).join(",");//here collected all the details of error obj made a new array 
//and the join it using ","
if(error){//if  contains an error 
    console.log(error)
    throw new MyError(400,error.message);//thrown the errror with  that error
}
next();
}