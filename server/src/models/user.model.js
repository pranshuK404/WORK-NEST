import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    fullname: {
      type: String,
      trim: true,
      required: true,
      minlength: 5,
      maxlength: 50,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      select: false,
    },
    role: {
      type: String,
      enum: {
        values: ["user", "admin"],
        message: "Invalid role",
      },
      default: "user",
    },
    avatar: {
      url: {
        type: String,
        default: "https://placehold.co/600x400",
      },
      publicId: {
        type: String,
        default: null,
      },
    },

    isVerified: {
      type: Boolean,
      default: false,
    },
    //--email verification
    emailVerificationToken: {
      type: String,
      select: false,
    },
    emailVerificationTokenExpiry: {
      type: Date,
      select: false,
    },
    //--password reset
    passwordResetToken: {
      type: String,
      select: false,
    },
    passwordResetExpiry: {
      type: Date,
      select: false,
    },
    //--refresh token
    refreshToken: {
      type: String,
      select: false,
    },

    pendingEmail: {
      type: String,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
  },
  { timestamps: true },
);

const SALT_ROUNDS = 10;
//--password hashing
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  this.password = await bcrypt.hash(this.password, salt);
});

// ---PASSWORD MATCHING
userSchema.methods.comparePassword = async function (userPassword) {
  return await bcrypt.compare(userPassword, this.password);
};

//---GENERATE JWT TOKENS -----

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id.toString(),
      email: this.email,
      role: this.role,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    },
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    },
  );
};

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.__v;
  // remove sensitive data
  delete obj.password;
  delete obj.refreshToken;
  delete obj.emailVerificationToken;
  delete obj.emailVerificationExpiry;

  return obj;
};

export const User = mongoose.model("User", userSchema);
