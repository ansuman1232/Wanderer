const joi=require("joi");//first require joi package
module.exports.schemaJoi= joi.object({//joi will recieve an object

    listing:joi.object({//object name will be listing and it must be there or else error

        title: joi.string().required(),//title will be string and required

        description: joi.string().required(),//description will be string and required

        location: joi.string().required(),//string and required

        country: joi.string().required(),
        price: joi.number().required().min(0),//number should be not be -ve

        image:joi.string().allow("",null)//here our image can be null or empty string
    }).required(),
});
