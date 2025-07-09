import { body } from "express-validator";

const blogValidator = [
  body("title").notEmpty().withMessage("Title is required"),
  body("content").notEmpty().withMessage("Content is required"),
];

export default blogValidator;
