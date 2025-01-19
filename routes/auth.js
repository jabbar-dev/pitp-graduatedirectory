const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const StudentProfile = require('../models/StudentProfile');

const router = express.Router();

router.post('/signup', async (req, res) => {
  try {
    const { studentId, email, password } = req.body;

    // Check if the user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    user = new User({
      studentId,
      email,
      password: hashedPassword,
    });

    await user.save();

    // Create an initial student profile linked to the new user with sanitized values
    const studentProfile = new StudentProfile({
      studentId,
      personalInfo: {
        email,
        name: "",
        fatherName: "",
        contact: "",
        address: "",
        linkedIn: "",
      },
      educationInfo: {
        qualification: "",
        grade: "",
        passingYear: "",
      },
      employmentInfo: {
        salary: 0,
        organization: "",
        appointmentDate: null,
        jobType: "",
        earnings: 0,
      },
      pitpInfo: {
        course: "",
        batch: "",
        center: "",
      },
    });
    

    await studentProfile.save();

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.status(201).json({ authCode: token, msg: "User registered successfully" });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).send("Server error");
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.status(200).json({ 
      authCode: token, 
      studentId: user.studentId, 
      msg: "Login successful" 
    });
    

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ msg: "Server error" });
  }
});


module.exports = router;
