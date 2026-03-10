import Profile from "../../models/profile.model.js";

export const getMyProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.user.id }).populate(
      "userId",
      "-password"
    );

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile fetched successfully",
      data: profile,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch profile",
      error: error.message,
    });
  }
};

export const createOrUpdateProfile = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      phone,
      location,
      bio,
      skills,
      experience,
      education,
      resumeUrl,
      parsedResume,
      avatarUrl,
    } = req.body;

    const profile = await Profile.findOneAndUpdate(
      { userId: req.user.id },
      {
        userId: req.user.id,
        firstName,
        lastName,
        phone,
        location,
        bio,
        skills,
        experience,
        education,
        resumeUrl,
        parsedResume,
        avatarUrl,
      },
      {
        returnDocument: 'after',
        upsert: true,
        runValidators: true
      }
    );

    return res.status(200).json({
      success: true,
      message: "Profile saved successfully",
      data: profile,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to save profile",
      error: error.message,
    });
  }
};