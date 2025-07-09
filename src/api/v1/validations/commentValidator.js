import { body } from "express-validator";

const commentValidator = [
  body("comment").notEmpty().withMessage("Comment is required"),
];

export default commentValidator;
