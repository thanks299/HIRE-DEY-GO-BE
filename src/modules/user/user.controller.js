import * as userService from './user.service.js';

export const getMyProfile = async (req, res) => {
  try {
    // req.user is usually attached by the auth code yusuf wrote
    const profile = await userService.getProfileByUserId(req.user.id);
    res.status(200).json({ success: true, data: profile });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

export const updateMyProfile = async (req, res) => {
  try {
    const updatedProfile = await userService.updateProfile(req.user.id, req.body);
    res.status(200).json({ success: true, data: updatedProfile });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const uploadResume = async (req, res) => {
  try {
    // multer will attach the file to req.file
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const updatedProfile = await userService.processAndSaveResume(req.user.id, req.file);
    
    res.status(200).json({ 
      success: true, 
      message: 'Resume parsed and uploaded successfully',
      data: updatedProfile 
    });
  } catch (error) {
    console.error('resume upload failed:', error);
    res.status(500).json({ success: false, message: 'Server error during file upload' });
  }
};