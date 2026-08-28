import ApiError from "../../utils/ApiError";
import cryptoTokenUtility from "../../utils/cryptoToken.js";
import { User } from "../../models/user.model";
import sendMail from "../../utils/sendMail";
import ApiResponse from "../../utils/ApiResponse.js";

export const registerUser = async (req, res) => {
  const { email, password, fullname } = req.body;

  //checking if user exists
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new ApiError(409, "User with this email already exists");
  }
  const { rawToken, hashedToken, tokenExpiry } =
    await cryptoTokenUtility.generateToken();

  const user = await User.create({
    email: email.toLowerCase(),
    fullname,
    password,
    emailVerificationToken: hashedToken,
    emailVerificationTokenExpiry: tokenExpiry,
  });

  const createdUser = await user.save();

  await sendMail(email, rawToken);

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        createdUser,
        "User registered successfully, Please verify your email",
      ),
    );
};
