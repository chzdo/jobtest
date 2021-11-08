import joi from "joi";

const addUser = joi.object({
 firstName: joi.string().required(),
 otherName: joi.string().required(),
 address: joi.string().optional(),
 dob: joi.date().optional(),
});

export { addUser };
