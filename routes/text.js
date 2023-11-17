const multer = require("multer");
const User = require("../models/User");
const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Specify the directory where you want to store the uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.post("/upload", upload.single("image"), async (req, res) => {
  const { email } = req.body;
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }
  try {
    const user = await User.findOne({ email });
    if (user) {
      const imageName = user.image;
      const currentPath = __dirname;

      // Split the path into individual segments
      const pathSegments = currentPath.split(path.sep);

      // Remove the last segment
      pathSegments.pop();

      // Join the remaining segments to get the parent directory path
      const parentDirectory = pathSegments.join(path.sep);
      if (imageName !== "hello.png") {
        const filePath = path.join(parentDirectory, "uploads", imageName);
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error(`Error deleting file: ${err}`);
          } else {
            console.log(`File ${filePath} has been deleted.`);
          }
        });
      }
    }
    const updatedImage = await User.findOneAndUpdate(
      { email }, // Search criteria
      { $set: { image: req.file.filename } }, // Update only the 'filename' attribute
      { new: true } // Return the updated document
    );

    if (updatedImage) {
      console.log("Updated image:", updatedImage);
      res.status(201).send(updatedImage);
    } else {
      console.log("No image found matching the criteria.");
    }
  } catch (error) {
    console.error("Error updating image:", error);
    res.status(500).send(error);
  }
});

router.post("/getimage", async (req, res) => {
  try {
    const { email } = req.body;
    console.log(email);
    const user = await User.findOne({ email });
    if (user) {
      const imageName = user.image;
      // You can customize the image file path based on your requirements
      const currentPath = __dirname;

      // Split the path into individual segments
      const pathSegments = currentPath.split(path.sep);

      // Remove the last segment
      pathSegments.pop();

      // Join the remaining segments to get the parent directory path
      const parentDirectory = pathSegments.join(path.sep);
      const imagePath = path.join(parentDirectory, "uploads", imageName);

      // Send the image file to the frontend
      return res.sendFile(imagePath);
    }
    return res.status(404).send("User not Found");
  } catch (error) {
    console.error("Error updating image:", error);
    res.status(500).send(error);
  }
});

module.exports = router;
