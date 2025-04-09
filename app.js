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

//testing model===============
// app.get("/testing",async (req,res)=>{
// let list1=new Listing({
//     title:'My new villa',
//     description:"By the Beach",
//     price:1200,
//     location:"Puri,Odisha",
//     country:"India"
// });
// await list1.save();//instead of this used this
// res.send("done..");
// })
//starting server====================
app.listen(8080,()=>{
    console.log('listening to port 8080');
})
app.get("/",(req,res)=>{
    res.render("./listings/home.ejs")
})
//to read the body of url==========
app.use(express.urlencoded({extended : true}))

//creating an idex route to show all location title ==============
app.get("/listing",async (req,res)=>{
const allList= await Listing.find();
res.render("./listings/list.ejs",{allList});
});
//to show detalis of an particular topic=============
app.get("/listing/:id",(req,res)=>{
let {id}=req.params;

Listing.findById(id).then(data=>{res.render("./listings/show.ejs",{myDest:data})})
});
//=====================create route===================
app.get("/listingnewform",(req,res)=>{ //direct to new location add===
    res.render("./listings/add.ejs");
});
app.post("/listing/add", (req,res)=>{//saving to database========
 


let{country:newCountry  ,title:newTitle, location:newLocation, price:np, description:nd,image:img}=req.body;

let list1=  new Listing({title:newTitle,location:newLocation,price:np,description:nd,country:newCountry,image:img})
console.log(np)
 list1.save().then(res.redirect('/listing'))
 .catch(e=>{console.log(e);});
});

//=============update route===================
app.get("/listing/update/:id",async (req,res)=>{
    let {id}=req.params;

    const data = await Listing.findById(id);

    res.render("./listings/edit.ejs",{data});
})


//=================method-override=========
var methodOverride = require('method-override')
app.use(methodOverride('_method'))
//==========to update in database=========
app.put("/listing/:id",async (req,res)=>{
    let {id}=req.params;
    let{country:newCountry  ,title:newTitle, location:newLocation, price:np, description:nd,image:img}=req.body;
     await Listing.findByIdAndUpdate(id,{title:newTitle,location:newLocation,price:np,description:nd,country:newCountry,image:img});

    res.redirect(`/listing/${id}`);
})
//=============delete route=======================
app.delete("/listing/:id",async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listing");
})

