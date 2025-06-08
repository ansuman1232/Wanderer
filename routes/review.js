const express=require('express')
const router= express.Router()//creating a nuew router object


    //=====================create route===================
const wrapAsync=require('../utils/wrapAsync.js');
const {isReview}=require('../middleware.js')
//=========requiring isLoggedIn Middleware=============
const {isLoggedIn,saveUserUrl}=require("../middleware.js")
//for method overried===================================
var methodOverride = require('method-override');
router.use(methodOverride('_method'))


// //for schema validation and throwing error======
const {schemaJoi,reviewSchemaJoi}=require('../validSchemaJoi.js');//requiring

//this is for review schema==========================
validateReview=function(req,res,next){
   
    
    let {error1}=reviewSchemaJoi.validate(req.body);
    if(error1){
        console.log(error1)
        throw new MyError(400,error1.message)
    }
    
        next();
    }
//==================requring controller for review===================================
const reveiwController=require("../controller/review.js")
    //creating a post route for reviews  =======================
router.post("/:id",
    isLoggedIn,//checking is user logged in or not before adding review by api
    validateReview,
    wrapAsync(reveiwController.createReview))

   // to delete a review==================================

router.delete('/:id/:reviewId',
      saveUserUrl,//here saving the url
      isLoggedIn,//checking is user logged in or not before adding review by api
   
     isReview,//is user done the same review
    wrapAsync( reveiwController.destroyReview))

module.exports=router