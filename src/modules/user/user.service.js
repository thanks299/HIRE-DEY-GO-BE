import Profile from '../../models/profile.model.js';
import { uploadToCloudinary } from '../../utils/upload.util.js';
import { parseResume } from '../../utils/cvParser.util.js';

export const getProfileByUserId = async (userId) => {
  // grabs the profile and populates the basic user email/role attached to it
  const profile = await Profile.findOne({ userId }).populate('userId', 'email role');
  if (!profile) throw new Error('Profile not found');
  return profile;
};

export const updateProfile = async (userId, updateData) => {
  // upsert: true means if they don't have a profile yet, it creates one
  const profile = await Profile.findOneAndUpdate(
    { userId },
    { $set: updateData },
    { new: true, upsert: true, runValidators: true }
  );
  return profile;
};

export const processAndSaveResume = async (userId, file) => {
  if (!file) throw new Error('No resume file provided');

  // to send the file to cloudinary
  const resumeUrl = await uploadToCloudinary(file.buffer);
  // for extracting the text and skills
  const parsedData = await parseResume(file.buffer);

  // update the database with the new url and the extracted data
  const updatedProfile = await Profile.findOneAndUpdate(
    { userId },
    { 
      $set: { 
        resumeUrl, 
        parsedResume: parsedData 
      },
      $addToSet: { 
        skills: { $each: parsedData.skills } 
      }
    },
    { new: true, upsert: true }
  );

  return updatedProfile;
};