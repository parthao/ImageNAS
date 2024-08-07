const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();

const corsOptions = {
  origin: "*", // Allow only requests from this origin
  methods: "GET,POST", // Allow only these methods
  allowedHeaders: ["Content-Type", "Authorization"], // Allow only these headers
};

app.use(cors(corsOptions));
// Resolve IMAGE_DIRECTORY to an absolute path
const IMAGE_DIRECTORY = path.resolve(__dirname, "/home/drago/Images/");

// Resolve IMAGE_DIRECTORY to an absolute path
const VIDEO_DIRECTORY = path.resolve(__dirname, "/home/drago/Videos/");

// Route to list all images
app.get("/images", (req, res) => {
  fs.readdir(IMAGE_DIRECTORY, (err, files) => {
    if (err) {
      return res.status(500).send("Unable to scan directory");
    }

    const imageFiles = files.filter(
      (file) =>
        file.endsWith(".jpg") ||
        file.endsWith(".jpeg") ||
        file.endsWith(".png") ||
        file.endsWith(".gif") ||
        file.endsWith(".webp")
    );
    const imageLinks = imageFiles.map(
      (file) => `${req.protocol}://${req.get("host")}/images/${file}`
    );
    res.json(imageLinks);
  });
});

// Route to list all videos
app.get("/videos", (req, res) => {
  fs.readdir(VIDEO_DIRECTORY, (err, files) => {
    if (err) {
      return res.status(500).send("Unable to scan directory");
    }

    const imageFiles = files.filter((file) => file.endsWith(".mp4"));
    const imageLinks = imageFiles.map(
      (file) => `${req.protocol}://${req.get("host")}/videos/${file}`
    );
    res.json(imageLinks);
  });
});

// Route to serve an individual image
app.get("/images/:filename", (req, res) => {
  const filePath = path.join(IMAGE_DIRECTORY, req.params.filename);
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error("Error sending file:", err);
      res.status(err.status).send("File not found");
    } else {
      console.log("Sent:", filePath);
    }
  });
});

// Route to serve an individual videos
app.get("/videos/:filename", (req, res) => {
  const filePath = path.join(VIDEO_DIRECTORY, req.params.filename);
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error("Error sending file:", err);
      res.status(err.status).send("File not found");
    } else {
      console.log("Sent:", filePath);
    }
  });
});

const PORT = process.env.PORT || 8088;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
