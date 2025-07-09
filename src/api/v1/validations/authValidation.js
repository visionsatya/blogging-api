import { body } from "express-validator";

const registerValidator = [
  body("name").notEmpty().withMessage("Name is required"),
  body("name")
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters long"),
  body("name")
    .isLength({ max: 30 })
    .withMessage("Name must be at most 30 characters long"),
  body("username").notEmpty().withMessage("Username is required"),
  body("username")
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters long"),
  body("username")
    .isLength({ max: 20 })
    .withMessage("Username must be at most 20 characters long"),
  body("username").trim(),
  body("email").notEmpty().withMessage("Email is required"),
  body("email").isEmail().withMessage("Invalid email"),
  body("password").notEmpty().withMessage("Password is required"),
];

const loginValidator = [
  body("email").notEmpty().withMessage("Email is required"),
  body("email").isEmail().withMessage("Invalid email"),
  body("password").notEmpty().withMessage("Password is required"),
];

const profileUpdateValidator = [
  body("name")
    .optional()
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters long")
    .isLength({ max: 30 })
    .withMessage("Name must be at most 30 characters long"),
  body("username")
    .optional()
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters long")
    .isLength({ max: 20 })
    .withMessage("Username must be at most 20 characters long"),
  body("email").optional().isEmail().withMessage("Invalid email"),
  body("password")
    .optional()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];

export { registerValidator, loginValidator, profileUpdateValidator };
