const express = require('express');
const { check, validationResult } = require('express-validator');
const router = express.Router();
const StudentProfile = require('../models/StudentProfile');
const authMiddleware = require('../middleware/authMiddleware');

// Helper function to sanitize inputs
const sanitizeInput = (value, type) => {
  if (value === "N/A" || value === "" || value === null || value === undefined) {
    return type === 'number' ? 0 : type === 'date' ? null : "NA";
  }
  if (type === 'number') return !isNaN(Number(value)) ? Number(value) : 0;
  if (type === 'date') {
    const parsedDate = Date.parse(value);
    return isNaN(parsedDate) ? null : new Date(parsedDate).toISOString();
  }
  return value;
};


// Update profile route with validation
router.post(
  '/',
  authMiddleware,
  [
    check('studentId', 'Student ID is required').not().isEmpty(),
    check('personalInfo.name', 'Name is required').not().isEmpty(),
    check('personalInfo.email', 'Valid email is required').isEmail(),
    check('personalInfo.linkedIn').optional().isURL().withMessage('Invalid LinkedIn URL'),
    check('educationInfo.qualification', 'Qualification is required').not().isEmpty(),
    check('employmentInfo.salary', 'Salary must be a valid number').isNumeric(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { studentId, personalInfo, educationInfo, employmentInfo, pitpInfo } = req.body;

    try {
      let profile = await StudentProfile.findOne({ studentId });

      if (!profile) {
        return res.status(404).json({ msg: 'Profile not found' });
      }

      // Sanitize and update profile data
      profile.personalInfo = {
        ...profile.personalInfo,
        name: sanitizeInput(personalInfo.name, 'string'),
        email: sanitizeInput(personalInfo.email, 'string'),
        linkedIn: sanitizeInput(personalInfo.linkedIn, 'string'),
        contact: sanitizeInput(personalInfo.contact, 'string'),
        address: sanitizeInput(personalInfo.address, 'string'),
      };

      profile.educationInfo = {
        qualification: sanitizeInput(educationInfo.qualification, 'string'),
        grade: sanitizeInput(educationInfo.grade, 'string'),
        passingYear: sanitizeInput(educationInfo.passingYear, 'string'),
      };

      profile.employmentInfo = {
        salary: sanitizeInput(employmentInfo.salary, 'number'),
        organization: sanitizeInput(employmentInfo.organization, 'string'),
        appointmentDate: sanitizeInput(employmentInfo.appointmentDate, 'date'),
        jobType: sanitizeInput(employmentInfo.jobType, 'string'),
        earnings: sanitizeInput(employmentInfo.earnings, 'number'),
      };

      profile.pitpInfo = {
        course: sanitizeInput(pitpInfo?.course, 'string'),
        batch: sanitizeInput(pitpInfo?.batch, 'string'),
        center: sanitizeInput(pitpInfo?.center, 'string'),
      };

      await profile.save();
      res.status(200).json({ msg: 'Profile updated successfully', profile });
    } catch (error) {
      console.error('Error updating profile:', error);
      res.status(500).send('Server error');
    }
  }
);


router.get('/:studentId', authMiddleware, async (req, res) => {
  try {
    const { studentId } = req.params;

    // Find the student's profile
    const profile = await StudentProfile.findOne({ studentId });

    if (!profile) {
      return res.status(404).json({ msg: 'Profile not found' });
    }

    res.status(200).json(profile);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).send('Server error');
  }
});
module.exports = router;
