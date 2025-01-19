const mongoose = require('mongoose');

const StudentProfileSchema = new mongoose.Schema({
  studentId: {
    type: String,
    required: true,
    unique: true
  },
  personalInfo: {
    name: { type: String, default: "NA" },
    fatherName: { type: String, default: "NA" },
    email: { type: String, required: true },
    contact: { type: String, default: "NA" },
    address: { type: String, default: "NA" },
    linkedIn: { type: String, default: "NA" }
  },
  educationInfo: {
    qualification: { type: String, default: "NA" },
    grade: { type: String, default: "NA" },
    passingYear: { type: String, default: "NA" }
  },
  employmentInfo: {
    salary: { type: Number, default: 0 },
    organization: { type: String, default: "NA" },
    appointmentDate: { type: Date, default: null },
    jobType: { type: String, default: "NA" },
    earnings: { type: Number, default: 0 }
  },
  pitpInfo: {
    course: { type: String, default: "NA" },
    batch: { type: String, default: "NA" },
    center: { type: String, default: "NA" }
  }
});

module.exports = mongoose.model('StudentProfile', StudentProfileSchema);
