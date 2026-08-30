import { Router } from "express";
import validate from "../middlewares/validate.middleware.js";
import { verifyJWT } from "../middlewares/authenticate.middleware.js";

//---Importing auth Validation Schema
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
  resendVerificationEmailSchema,
  verifyEmailSchema,
} from "../validators/auth.validator.js";

//---Importing auth controllers
import {
  registerUser,
  loginUser,
  logoutUser,
  verifyEmail,
  resendVerificationEmail,
  forgotPassword,
  resetPassword,
  changePassword,
  refreshAccessToken,
} from "../controllers/auth/0index.js";

const router = Router();

//---Mapping auth routes

router.post("/register", validate(registerSchema), registerUser);
router.post("/login", validate(loginSchema), loginUser);
router.post("/verify-email", validate(verifyEmailSchema), verifyEmail);
router.post(
  "/resend-email",
  validate(resendVerificationEmailSchema),
  resendVerificationEmail,
);
router.post("/forgot-password", validate(forgotPasswordSchema), forgotPassword);
router.post("/reset-password", validate(resetPasswordSchema), resetPassword);
router.post("/refresh-token", refreshAccessToken);

//---Protected routes
router.post("/logout", verifyJWT, logoutUser);
router.post(
  "/change-password",
  verifyJWT,
  validate(changePasswordSchema),
  changePassword,
);

export default router;
