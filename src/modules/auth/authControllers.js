import User from '../../models/user.model.js'
import bcrypt from "bcrypt";
import { generateAccessToken, generateRefreshToken } from "../../utils/generateToken.js";
import jwt from "jsonwebtoken";


const handleErrors = (err) => {
    console.log(err.message)
}





export const signup = async(req, res) => {
    
    
    const { email, password, name} = req.body;
    console.log(email, password, name)

    try{

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        
        const user = await User.create({ email,
            password, name, otp, otpExpires: Date.now() + 10 * 60 * 1000

         });

        console.log(`OTP for ${user.email}: ${otp}`); 
       

         res.status(201).json(user);
    }
    catch (err) {
        handleErrors(err);
        res.status(400).send('error, user not created');
    }
} 





export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");;

    if (!user) return res.status(400).json({ message: "Invalid email or password" });

    if (!user.password) return res.status(400).json({ message: "User has no password set" });

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect)
      return res.status(400).json({ message: "Invalid email or password" });

    if (!user.isVerified) {
        return res.status(400).json({ message: "Please verify your email before you login"})
    }
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.json({
      accessToken,
      refreshToken,  
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






export const verifyEmail = async (req, res) => {
   
    const { email, otp } = req.body;
  
  
    try {
    
    const user = await User.findOne({ email }).select("+otp +otpExpires");
    console.log(user);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log("OTP from request:", otp);
    console.log("OTP in database:", user.otp);

    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }


    if (user.otpExpires < Date.now()) {
        return res.status(400).json({ message: "OTP expired "})
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined

    await user.save();

    res.status(200).json({ message: "Email verified successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};





export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token is required" });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newAccessToken = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    res.json({ accessToken: newAccessToken });

  } catch (err) {
    if (err.name === "TokenExpiredError" || err.name === "JsonWebTokenError") {
      return res.status(403).json({ message: "Invalid or expired refresh token" });
    }

    console.error("Refresh token handler error:", err);
    return res.status(500).json({ message: "Unable to refresh token right now" });
  }
};



