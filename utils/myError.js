class MyError extends Error{
    constructor(statusCode,mesg){
        super();
        this.statusCode=statusCode;
        this.message=mesg;
    }
}
module.exports=MyError;