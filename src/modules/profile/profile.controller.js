import Profile from "../../models/profile.model.js";
 
export const getMyProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.user.userId }).populate(
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
 
    // Only include fields that were actually sent in the request
    const updateFields = {};
    if (firstName !== undefined) updateFields.firstName = firstName;
    if (lastName !== undefined) updateFields.lastName = lastName;
    if (phone !== undefined) updateFields.phone = phone;
    if (location !== undefined) updateFields.location = location;
    if (bio !== undefined) updateFields.bio = bio;
    if (skills !== undefined) updateFields.skills = skills;
    if (experience !== undefined) updateFields.experience = experience;
    if (education !== undefined) updateFields.education = education;
    if (resumeUrl !== undefined) updateFields.resumeUrl = resumeUrl;
    if (parsedResume !== undefined) updateFields.parsedResume = parsedResume;
    if (avatarUrl !== undefined) updateFields.avatarUrl = avatarUrl;
 
    const profile = await Profile.findOneAndUpdate(
      { userId: req.user.userId },
      { $set: { ...updateFields, userId: req.user.userId } },
      {
        new: true,
        upsert: true,
        runValidators: true,
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
 