import * as z from "zod";

//--Register validation schema
export const registerSchema = z.object({
  body: z.object({
    email: z.email().trim(),
    fullname: z.string().trim().min(5).max(50),
    password: z.string().trim().min(8).max(50),
  }),
});
//--Login validation schema
export const loginSchema = z.object({
  body: z.object({
    email: z.email().trim(),
    password: z.string().trim().min(8).max(50),
  }),
});
//--Forgot password validation schema
export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.email().trim(),
  }),
});
//--Reset password validation schema
export const resetPasswordSchema = z.object({
  params: z.object({
    token: z.string().trim().min(1),
  }),

  body: z.object({
    password: z.string().trim().min(8).max(50),
  }),
});
//--Change password validation schema
export const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z.string().trim().min(8).max(50),
    newPassword: z.string().trim().min(8).max(50),
  }),
});
//---Verify email validation schema
export const verifyEmailSchema = z.object({
  body: z.body({
    token: z.string().trim().min(1),
  }),
});
//---Resend email validation schema
export const resendVerificationEmailSchema = z.object({
  body: z.body({
    email: z.email().trim(),
  }),
});
