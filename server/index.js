require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const userSchema = new mongoose.Schema(
  {
    studentName: { type: String, required: true },
    gender: { type: String, required: true },
    rollNo: { type: String, required: true, unique: true },
    dob: { type: String, required: true },
    bloodGroup: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    address: { type: String, required: true },
    department: { type: String, required: true },
    course: { type: String, required: true },
    year: { type: String, required: true },
    section: { type: String, required: true },
    backlogs: { type: String, required: true },
    companies: { type: [String], required: true, validate: (value) => value.length === 4 },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

app.get("/", (req, res) => {
  res.json({ message: "Server is running" });
});

app.post("/api/register", async (req, res) => {
  try {
    const registration = req.body;

    if (Object.values(registration).some((value) => !value) || registration.companies?.length !== 4) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({
      $or: [{ email: registration.email }, { rollNo: registration.rollNo }],
    });

    if (existingUser) {
      return res.status(409).json({ message: "Email or roll number already registered" });
    }

    await User.create(registration);

    res.status(201).json({ message: "Registration successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Registration failed" });
  }
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
  });