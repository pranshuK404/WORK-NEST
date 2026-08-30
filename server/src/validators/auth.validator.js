import * as z from "zod";

//--Register validation schema
export const registerValidator = z.object({
  email: z.trim().email(),
  fullname: z.string().trim().min(5).max(50),
  password: z.string().trim().min(8).max(50),
});
//--Login validation schema
export const loginValidator = z.object({
  email: z.trim().email(),
  password: z.string().trim().min(8).max(50),
});
//--Forgot password validation schema
export const forgotPasswordValidator = z.object({
  email: z.trim().email(),
});
//--Reset password validation schema
export const resetPasswordValidator = z.object({
  params: z.object({
    token: z.string().trim().min(1),
  }),

  body: z.object({
    password: z.string().trim().min(8).max(50),
  }),
});
//--Change password validation schema
export const changePasswordValidator = z.object({
  currentPassword: z.string().trim().min(8).max(50),
  newPassword: z.string().trim().min(8).max(50),
});
//---Verify email validation schema
export const verifyEmailValidator = z.object({
  token: z.string().trim().min(1),
});
//---Resend email validation schema
export const resendEmailValidator = z.object({
  email: z.trim().email(),
});
