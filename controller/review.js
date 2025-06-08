// ===================requiring packages===================
const Listing1=require('../models/listing.js');
const Review=require('../models/review.js')
 //requiring my error class==========================
const MyError=require("../utils/myError.js");
// ============================================================
module.exports.createReview=async (req,res,next)=>{//desing in this way to get id also
    //note:- it was showing 'page not found' so kept it above some other route and it worked
  //more specific routes should come before less specific ones. So placing /listing/:id before /listing/new
  //  is important if you're using similar patterns.
       let listId= req.params.id;
       let list= await Listing1.findById(listId)
       console.log(req.body.review)
       let newReview= new Review(req.body.review)
       newReview.author=req.user._id;//adding author also
       console.log(newReview)
       await newReview.save();
       list.reviews.push(newReview)
       await list.save();
       console.log('Review is saved')
       req.flash("success","new review is created")
       res.redirect(`/listing/${listId}`)
   }
   //==============destroy review=======================
   module.exports.destroyReview=async (req,res,next)=>{//note:- don't use this before requrieng method-override   
    let {id,reviewId}=req.params;
    await Listing1.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})//here pull operator will remove the data form reviews array of listing
    await Review.findByIdAndDelete(reviewId);//then deleted it from reviews collection also
    req.flash("success","review is deleted")
    res.redirect(res.locals.redirect||`/listing/${id}`);
}