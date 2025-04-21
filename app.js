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
//requring export package==============
const Listing=require('./models/listing.js');
//to set ejs-mate=================
let ejsMate = require('ejs-mate');
app.engine('ejs', ejsMate);// use ejs-locals for all ejs templates:
//setting to access style sheet=================
app.use(express.static(path.join(__dirname,"/public")));
//requiring my error class==========================
const MyError=require("./utils/myError.js");
//for schema validation and throwing error======
const {schemaJoi}=require('./validSchemaJoi.js');//requiring

validateSchema=function(req,res,next){//middleware to check
        //if errror any filed or whole listing body is missing then throw error
let {error}= schemaJoi.validate(req.body);//here first extracted the error from the req body
let errMsg=error.details.map((el)=>el.message).join(",");//here collected all the details of error obj made a new array 
//and the join it using ","
if(error){//if  contains an error 
    throw new MyError(400,errMsg);//thrown the errror with  that error
}
else{
    next();
}
}

//starting server====================
app.listen(8080,()=>{
    console.log('listening to port 8080');
})
app.get("/home",(req,res)=>{
    res.render("./listings/home.ejs")
})
//to read the body of url==========
app.use(express.urlencoded({extended : true}))
app.use(express.json())

//creating an idex route to show all location title ==============
app.get("/listing",async (req,res)=>{
const allList= await Listing.find();
res.render("./listings/list.ejs",{allList});
});
//to show detalis of an particular topic=============
app.get("/listing/:id",(req,res,next)=>{
let {id}=req.params;

Listing.findById(id).then(data=>{res.render("./listings/show.ejs",{myDest:data})}).catch(err=>next(err));
});
//=====================create route===================
const wrapAsync=require('./utils/wrapAsync.js');
//===================requiing ayncfunction==========

app.get("/listingnewform",(req,res)=>{ //direct to new location add===
    res.render("./listings/add.ejs");
});

app.post("/listing/add",validateSchema, wrapAsync(async (req,res,next)=>{//saving to database========
 
let{country:newCountry  ,title:newTitle, location:newLocation, price:np, description:nd,image:img}=req.body.listing;//here deconstructing from 
//listing body
let list1=  new Listing({title:newTitle,location:newLocation,price:np,description:nd,country:newCountry,image:img})
list1.save().then(res.redirect('/listing'))

}));


//=============update route===================
app.get("/listing/update/:id",wrapAsync(async (req,res,next)=>{
    let {id}=req.params;

    const data = await Listing.findById(id);

    res.render("./listings/edit.ejs",{data});
}))

var methodOverride = require('method-override');

app.use(methodOverride('_method'))
//==========to update in database=========
app.put("/listing/:id",validateSchema,wrapAsync(async (req,res,next)=>{


    let {id}=req.params;


if(!req.body.listing.image){
    throw new MyError(400,"Image not found");
}
    let{country:newCountry  ,title:newTitle, location:newLocation, price:np, description:nd,image:img}=req.body.listing;
     await Listing.findByIdAndUpdate(id,{title:newTitle,location:newLocation,price:np,description:nd,country:newCountry,image:img});

    res.redirect(`/listing/${id}`);

}));
//=============delete route=======================
app.delete("/listing/:id",wrapAsync(async(req,res,next)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listing");
}));

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