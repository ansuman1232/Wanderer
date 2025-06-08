const mongoose= require('mongoose');
async function main(){
await mongoose.connect( 'mongodb://127.0.0.1:27017/wanderer');
console.log("connected to DB...");
};
main();
const initdata=require("./data.js");
const Listing=require("../models/listing.js");//how to access another folder file 
//when our accessing file is in other folder. 
async function init(){
    await Listing.deleteMany({});
    initdata.data=initdata.data.map((obj)=>{
     return obj={  ...obj,owner:'683f99c3a1453c13d39ff506'}
})
    await Listing.insertMany(initdata.data);
   
    console.log("data inserted...")
};
init();


