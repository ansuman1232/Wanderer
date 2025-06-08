//for express===============
const express=require('express');
const app=express();
const path=require("path");

//for ejs===============
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"))
//for mongoose=========
const mongoose=require('mongoose');
async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderer');
}
main().then(()=>{console.log("connecting to db")})
.catch(er=>{console.log(e);});


//to set ejs-mate=================
let ejsMate = require('ejs-mate');
app.engine('ejs', ejsMate);// use ejs-locals for all ejs templates:
//setting to access style sheet=================
app.use(express.static(path.join(__dirname,"/public")));
//requiring my error class==========================
const MyError=require("./utils/myError.js");










//starting server====================
app.listen(8080,()=>{
    console.log('listening to port 8080');
})

//to read the body of url==========
app.use(express.urlencoded({extended : true}))
app.use(express.json())






//=======require express-session and middleware==============

const session=require("express-session")
const sessionOption={//setting session options
    secret:"MySecret",
    resave:"false",
    saveUninitialized:"true",
    cookies:{
     expires: Date.now() +7*24*60*60*1000,// this will ensure that cookie will be delete from browser 
     //after 7 days , if no value is set then it will be deleted just after browser is closed.
     maxAge: 7*24*60*60*1000,//set the max age also with expire date
     httpOnly:true,//to protect form cross scripting attack(not explained in detail)
    }
}
app.use(session(sessionOption));
// for passport===============
const User=require("./models/user.js")
const LocalStrategy= require("passport-local")
const passport=require("passport")

//for passport authentication===================================
app.use(passport.initialize())//when ever request comes to any route it must initialize the passport.
app.use(passport.session())//this help  a web app to identify that same user is
 //sending the request to another page or different user.
//===================for flash and showing login and sign and logout options====================

const flash=require("connect-flash")
app.use(flash())//do these all thing before requiring any route
app.use((req,res,next)=>{//do these all thing before requiring any route
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
  
    res.locals.currUser=req.user;//note keep this after passport only .
 
    next()
})

//========Demo User=========================================
// app.get("/demouser",async (req,res)=>{
//     let fakeUser={
//         email:"user1@gmail.com",
//         username:"Raj1"//here due to "passport-local-mongoose" we can add this and here username will be unique
//     }
//     let data=await User.register(fakeUser,"wowGreat");//this function parameter (username ,email,password) ,here password is "wowGreat"
//     res.send(data)
// })

//home route===================
app.get("/home",(req,res,next)=>{//note:- define it after implementing session and flash
    // console.log(currUser)
    res.render("./listings/home.ejs",{currUser:req.user})
    
})


//requiring the routes==================
const userRoutes=require("./routes/user.js")
app.use('/user',userRoutes)

const listingRoutes=require("./routes/listing.js");
app.use('/listing',listingRoutes)
const reviewRoutes=require('./routes/review.js')
app.use('/review',reviewRoutes)








//==============if any randonm request is send on a route not mentioned=======


app.all(/.*/, (req, res, next) => {
    next(new MyError(404,"Page Not Found"));
  });


//========error handeling middleware===================
app.use((err,req,res,next)=>{

let {statusCode=500,message="some Error occured"}=err;

console.log(statusCode,message);

res.render('./listings/Error.ejs',{msg:message});
});


// login usersname,password:-
// user6,password :12345
// user5,password :1234
// raja mohan12,raja mohan12


