const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json()); // to parse JSON body

// MongoDB connection
const connectDb = 'mongodb+srv://eshanraj16:chandrayaan3@cluster0.wfiv2.mongodb.net/';
mongoose.connect(connectDb)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Default route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Schema & Model
const studentSchema = new mongoose.Schema({
  stuname: String,
  USN: String,
  email: String,
  isRegistered: Boolean,
  contact: Number,
  Age: Number
});
const StudentModel = mongoose.model('Student', studentSchema);

//
// 🟢 CREATE Student (POST)
//
app.post('/Student', async (req, res) => {
  try {
    const data = req.body;
    const { stuname, USN, email, isRegistered, contact, Age } = data;

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    // Check existing student
    const existingStudent = await StudentModel.findOne({
      $or: [{ email: email }, { USN: USN }]
    });
    if (existingStudent) {
      return res.status(400).json({ error: "Email or USN already exists" });
    }

    const mydata = await StudentModel.create({
      stuname,
      USN,
      email,
      isRegistered,
      contact,
      Age
    });

    return res.status(201).json({
      message: "Student data created successfully",
      data: mydata
    });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

//
// 🔵 READ All Students (GET)
//
app.get('/Student', async (req, res) => {
  try {
    const students = await StudentModel.find();
    return res.status(200).json({ data: students });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

//
// 🔵 READ Single Student by USN (GET)
//
app.get('/Student/:USN', async (req, res) => {
  try {
    const usn = req.params.USN;
    const student = await StudentModel.findOne({ USN: usn });
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }
    return res.status(200).json({ data: student });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

//
// 🟠 UPDATE Student (PUT)
//
app.put('/Student/:USN', async (req, res) => {
  try {
    const usn = req.params.USN;
    const updates = req.body;

    const student = await StudentModel.findOne({ USN: usn });
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    const updatedStudent = await StudentModel.findOneAndUpdate(
      { USN: usn },
      updates,
      { new: true }
    );

    return res.status(200).json({
      message: "Student data updated successfully",
      data: updatedStudent
    });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

//
// 🔴 DELETE Student (DELETE)
//
app.delete('/Student/:USN', async (req, res) => {
  try {
    const usn = req.params.USN;

    const student = await StudentModel.findOne({ USN: usn });
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    await StudentModel.deleteOne({ USN: usn });

    return res.status(200).json({ message: "Student deleted successfully" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

//
// Server Start
//
app.listen(4000, () => {
  console.log('Server is running on http://localhost:4000');
});