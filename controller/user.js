//for password=============
const passport=require("passport")
const LocalStrategy= require("passport-local")
const User=require("../models/user.js")
 passport.use(new LocalStrategy(User.authenticate()))
//here we use LocalStrategy to authenticate users with the 
// help of ‘authenticate()’ of passport-local-mongoose

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
 //requiring my error class==========================
const MyError=require("../utils/myError.js");

//=========================================
module.exports.showSignUpForm=async (req,res,next)=>{//directing to singin form

 res.render("./user/sign.ejs")
}
//==================================================
module.exports.singUp=async (req,res,next)=>{ 
try{//here registering user and redireing to all listing and flashing a message if no error is found.
    let {username,email,password}=req.body;
    let user={
        username:username,
        email:email,
    }
    let data=  await User.register(user,password)//don't forget use await
    console.log(data);
    req.login(data,(err)=>{
        if(err){
            next(err);
        }
    req.flash("success","you have successfully registered")
    res.redirect('/listing')
    })//this method call back is similar to req.logout but it also takes user data as parameter.
 
}
catch(e){//here if there is any error then flash that error message and redirect to signin page
    req.flash("error",e.message)
    res.redirect('/user/signup')
}
}
//==========================================
module.exports.logInForm=async (req,res,next)=>{//directing to login form

 res.render("./user/login.ejs")
}
//==================================
module.exports.postLogin=async (req,res,next)=>{
    
        let redirect=res.locals.redirect || "/listing" //if  isLoggedIn is not invoked at all then 
        // res.locals.redirect is undefined so storing a default value.
    req.flash("success","Wecome back!!!")
     res.redirect(redirect)
}
//==============for logout===================
module.exports.logout= async (req,res,next)=>{
req.logout((err)=>{
if(err){
 return   next(err);
}
req.flash("success","You logged out successfully.")
res.redirect("/listing")
}); //this function takes a callback  and in that parameter error ,so if error then call
//error handeling middleware ,else show a flash message and go to all listing page.
}