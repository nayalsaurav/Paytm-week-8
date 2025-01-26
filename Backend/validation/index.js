const zod = require("zod");

const userSignup = zod.object({
  username: zod.string().email().min(1, "username is required"),
  firstname: zod.string().min(1, "first name is required"),
  lastname: zod.string().min(1, "last name is required"),
  password: zod.string().min(8, "password should be atleast 8 characters"),
});
const userUpdate = zod.object({
  firstname: zod.string().min(1, "first name is required"),
  lastname: zod.string().min(1, "last name is required"),
  password: zod.string().min(8, "password should be atleast 8 characters"),
});
const userSignin = zod.object({
  username: zod.string().email().min(1, "username is required"),
  password: zod.string().min(8, "password should be atleast 8 characters"),
});
const transferValidation = zod.object({
  to: zod.string().min(1, "Receiver Id is required"),
  amount: zod.number().gte(1, "Amount should be greater than equal to 1"),
});

module.exports = {
  userSignup,
  userSignin,
  userUpdate,
  transferValidation,
};
