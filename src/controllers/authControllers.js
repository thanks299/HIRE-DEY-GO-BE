import User from '../models/user.model.js'
import bcrypt from "bcrypt";
import { generateAccessToken } from "../utils/generateToken.js";


const handleErrors = (err) => {
    console.log(err.message)
}


// export const signup = async (req, res) => {
//   const { email, password } = req.body;

//   if (!email || !password) {
//     return res.status(400).json({ message: "Email and password are required" });
//   }

//   try {
//     // Create user
//     const user = await User.create({ email, password });

//     // Generate 6-digit OTP
//     const otp = Math.floor(100000 + Math.random() * 900000).toString();
//     user.otp = otp;
//     await user.save();

//     // Normally you'd send the OTP via email
//     console.log(`OTP for ${user.email}: ${otp}`);

//     // Return response
//     res.status(201).json({
//       message: "User created successfully. Please verify your email with OTP.",
//       user: {
//         id: user._id,
//         email: user.email,
//         role: user.role,
//         isVerified: user.isVerified
//       }
//     });
//   } catch (err) {
//     handleErrors(err);
//     res.status(400).json({ message: "Error: user not created" });
//   }
// };






// export const signup = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     // Create the user
//     const user = await User.create({ email, password });

//     // Generate OTP
//     const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
//     user.otp = otp;
//     await user.save();

//     // Normally, you would send this OTP via email
//     console.log(`OTP for ${user.email}: ${otp}`);

//     // Respond with user data (excluding password & OTP)
//     res.status(201).json({
//       message: "User created successfully. Check console for OTP.",
//       user
//     });
//   } catch (err) {
//     handleErrors(err);
//     res.status(400).send('Error: user not created');
//   }
// };

export const signup = async(req, res) => {
    const { email, password,
             
        } = req.body;
    console.log(email, password)

    try{
        const user = await User.create({ email,
            password

         });

        //   const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
        // user.otp = otp;
        // await user.save();

        // console.log(`OTP for ${user.email}: ${otp}`); // in real app, send via email
       

         res.status(201).json(user);
    }
    catch (err) {
        handleErrors(err);
        res.status(400).send('error, user not created');
    }
} 



// export const login = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const user = await User.findOne({ email });

//     if (!user) {
//       return res.status(400).json({
//         message: "Invalid email or password"
//       });
//     }

//     const isPasswordCorrect = await bcrypt.compare(password, user.password);

//     if (!isPasswordCorrect) {
//       return res.status(400).json({
//         message: "Invalid email or password"
//       });
//     }

//     const accessToken = generateAccessToken(user);

//     res.status(200).json({
//       accessToken,
//       user: {
//         id: user._id,
//         email: user.email,
//         role: user.role
//       }
//     });

//   } catch (error) {
//     res.status(500).json({
//       message: error.message
//     });
//   }
// };





export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");;

    if (!user) return res.status(400).json({ message: "Invalid email or password" });

    if (!user.password) return res.status(400).json({ message: "User has no password set" });

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect)
      return res.status(400).json({ message: "Invalid email or password" });

    const accessToken = generateAccessToken(user);

    res.json({
      accessToken,
      user: {
        id: user._id,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};






export const verify = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const user = await User.findOne({ email }).select("+otp");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    user.isVerified = true;
    user.otp = undefined;
    await user.save();

    res.status(200).json({ message: "Email verified successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};