const wrapAsync=function(fn){
       return function (req,res,next){
        fn(req,res,next).catch(next);// same as, fn(req,res,next).catch(err=>next(err));
    }
} ;
module.exports=wrapAsync;