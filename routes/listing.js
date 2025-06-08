const express=require('express')
const router= express.Router()//creating a nuew router object


//===========requiring controllers================================
const listingController=require("../controller/listing.js");


//for method overried===================================
var methodOverride = require('method-override');
router.use(methodOverride('_method'))



const {validateSchema}=require("../middleware.js")

    //=====================create route===================
    const wrapAsync=require('../utils/wrapAsync.js');

    //creating an idex route to show all location title ==============
router.get("/",wrapAsync(listingController.index));
    
    //=======================adding the middle ware to this file===============
    let {isLoggedIn,isOwner ,isReview}=require('../middleware.js')
    //===================requiing ayncfunction==========
    
    router.get("/newform",isLoggedIn,wrapAsync(listingController.showNewForm));
    
    router.post("/add",validateSchema, wrapAsync(listingController.createNewListing));
    
    
    //to show detalis of an particular topic=============
    router.get("/:id",wrapAsync(listingController.showListing));

        //=============update route===================
router.get("/update/:id",isLoggedIn,isOwner,wrapAsync(listingController.showEditForm))

//==========to update in database=========
router.put("/:id",isOwner,validateSchema,wrapAsync(listingController.updateDatabase));
//=============delete route=======================
router.delete("/:id",isLoggedIn,wrapAsync(listingController.destroyListing));

module.exports= router;