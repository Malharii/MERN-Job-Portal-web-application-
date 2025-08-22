import { User } from "../models/user.model.js";
import bcrpyt from "bcrpytjs";
import jwt from "jsonwebtoken";
// this fun is for the creating the user or register
export const register = async (req, res) => {
  try {
    const { fullName, email, phoneNumber, password, role } = req.body;

    if (!fullName || !email || !phoneNumber || !password || !role) {
      return res.status(400).json({
        message: "Something is missing",
        success: false,
      });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        message: "User already exist with this email.",
        success: false,
      });
    }
    // hashing the password using the bcrpyt
    const hashedPassword = await bcrpyt.hash(password, 10);
    await User.create({
      fullName,
      email,
      phoneNumber,
      password: hashedPassword,
      role,
    });
    return res.status(201).json({
      message: "Account created successfully.",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

// this Fun is for the login the user
export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({
        message: "Something is missing",
        success: false,
      });
    }

    // finding the user
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Incorrect email or password.",
        success: false,
      });
    }

    // Compare the entered password with the hashed password stored in DB
    const isPasswordMatch = await bcrpyt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({
        message: "Incorrect email or password.",
        success: false,
      });
    }

    // check role is correct or not
    if (role !== user.role) {
      return res.status(400).json({
        message: "Account doesn't exist with current role.",
        success: false,
      });
    }

    const tokenData = {
      userId: user._id,
    };

    // Generate JWT token (expires in 1 day)
    const token = await jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: "1d" });
    user = {
      _id: user._id,
      fullname: user.fullName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile,
    };
    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpsOnly: true,
        sameSite: "strict",
      })
      .json({
        message: `Welcome back ${user.fullName}`,
        user,
        success: true,
      });
  } catch (error) {
    console.log(error);
  }
};
