const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const multer = require("multer");

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

const STUDENT_DIRECTORY = path.resolve(
  __dirname,
  "/home/drago/Students/Images/"
);

// Set up multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, STUDENT_DIRECTORY); // Store images in the IMAGE_DIRECTORY
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Use current timestamp to avoid filename collisions
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif|webp/;
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb("Error: Images Only!");
    }
  },
});

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

// Route to list all images
app.get("/student", (req, res) => {
  fs.readdir(STUDENT_DIRECTORY, (err, files) => {
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
      (file) => `${req.protocol}://${req.get("host")}/student/${file}`
    );
    res.json(imageLinks);
  });
});

// Route to upload an image
app.post("/upload-image", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }
  const imageUrl = `${req.protocol}://${req.get("host")}/images/${
    req.file.filename
  }`;
  res.json({ message: "Image uploaded successfully", url: imageUrl });
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

// Route to serve an individual studednt image
app.get("/student/:filename", (req, res) => {
  const filePath = path.join(STUDENT_DIRECTORY, req.params.filename);
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
