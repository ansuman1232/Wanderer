const express=require('express')
const router= express.Router()//creating a new router object

const wrapAsync=require('../utils/wrapAsync.js')
// for method override========================
var methodOverride = require('method-override');
router.use(methodOverride('_method'))
const {saveUserUrl}=require("../middleware.js")//requireing that middleware
//=========requring user controller===========================
const userController=require('../controller/user.js')
const passport=require("passport")

//routes===============================================================

router.get("/signup",wrapAsync(userController.showSignUpForm))


router.post("/signup",wrapAsync(userController.singUp))
//==========for login===================

router.get("/login",wrapAsync(userController.logInForm))


router.post("/login",saveUserUrl,//to save user url
   passport.authenticate("local",{failureRedirect:"/user/login",//directing to login here
    //passport.authenticate() middleware if error then redirect to login page with a flash message
    //else go to callback
    failureFlash:true}) 
,wrapAsync(userController.postLogin))

//==========also can be written like this==============================
// router.post("/login", saveUserUrl, (req, res, next) => {
//   passport.authenticate("local", (err, user, info) => {
//     if (err) return next(err);
//     if (!user) {
//       req.flash("error", "Invalid username or password.");
//       return res.redirect("/user/login");
//     }

//     req.logIn(user, (err) => {
//       if (err) return next(err);
//       const redirectUrl = res.locals.redirect || "/listing";
//       req.flash("success", "Welcome back!");
//       return res.redirect(redirectUrl);
//     });
//   })(req, res, next);
// });


//=============================== to logout========================================
router.get("/logout",wrapAsync(userController.logout));

module.exports=router;