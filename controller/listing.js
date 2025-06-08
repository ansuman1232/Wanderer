//requring export package==============
const Listing=require('../models/listing.js');
const express=require('express')
const router= express.Router()//creating a nuew router object
router.use(express.urlencoded({extended : true}))
 //requiring my error class==========================
const MyError=require("../utils/myError.js");
//========================================================
module.exports.index=async (req,res,next)=>{//for callback for index route.
    const allList= await Listing.find();
    res.render("./listings/list.ejs",{allList});
    }
//for show listing====================
module.exports.showListing= async (req,res,next)=>{
let {id}=req.params;
        
       await Listing.findById(id).populate({
            path:'reviews',
            populate:{
                path:"author"
            }
                })//this means show all reviews of listing and for each review show its author
            .populate("owner").then((data)=>{//inside populte field name is written
                console.log(data)
            if(!(data)){
                req.flash("error","listing dose not exist");
             return   res.redirect('/listing')//note:- don't forget to add return statement or else will lead to unexpected
             //behaviour
            }
           
         
            
            res.render("./listings/show.ejs",{myDest:data})}).catch(err=>next(err));//here used populate method to show the details of id
}
//=========showing for creating new listing form============
module.exports.showNewForm=async (req,res,next)=>{ //direct to new location add===
        res.render("./listings/add.ejs");
    }
//==========creating new Listing ==============================
module.exports.createNewListing=async (req,res,next)=>{//saving to database========
     console.log("adding to database")
     console.log(req.body)
    let{country:newCountry  ,title:newTitle, location:newLocation, price:np, description:nd,image:img}=req.body.listing;//here deconstructing from 
    //listing body
    let list1=  new Listing({title:newTitle,location:newLocation,price:np,description:nd,country:newCountry,image:img})
    list1.owner=req.user;
    let relt= await list1.save()//.then(res.redirect('/listing'))
    req.flash("success","A new listing is Added !")    //creating a flash message==========
    res.redirect('/listing')
    }
//========== showing edit form============================
module.exports.showEditForm=async (req,res,next)=>{//saving to database========
 
let {id}=req.params;

    const data = await Listing.findById(id);

    res.render("./listings/edit.ejs",{data});
    }
//=================== update in database======================
module.exports.updateDatabase=async (req,res,next)=>{

console.log('update routes.................')
    let {id}=req.params;


if(!req.body.listing.image){
    throw new MyError(400,"Image not found");
}
    let{country:newCountry  ,title:newTitle, location:newLocation, price:np, description:nd,image:img}=req.body.listing;
     await Listing.findByIdAndUpdate(id,{title:newTitle,location:newLocation,price:np,description:nd,country:newCountry,image:img});
   
     req.flash("success","listing is Edited")
    res.redirect(`/listing/${id}`);

}
//==========destroy listing========================
module.exports.destroyListing=async(req,res,next)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","listing is deleted")
    res.redirect("/listing");
}