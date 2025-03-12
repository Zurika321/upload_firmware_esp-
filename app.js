const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const app = express();
const port = 3000;

// Tạo thư mục uploads nếu chưa có
const uploadDir = "./uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Cấu hình Multer để lưu file vào thư mục uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

// const upload = multer({ storage: storage });
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Giới hạn 10MB
});

// API upload file
app.post("/upload", upload.single("firmware"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded!" });
  }
  res.json({
    message: "File uploaded successfully!",
    filename: req.file.filename,
  });
});

// Endpoint để ESP32 tải firmware
app.get("/firmware", (req, res) => {
  const firmwarePath = path.join(uploadDir, "firmware.bin");
  if (fs.existsSync(firmwarePath)) {
    res.download(firmwarePath);
  } else {
    res.status(404).json({ message: "Không tìm thấy firmware!" });
  }
});

// Bắt lỗi server
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res
    .status(500)
    .json({ message: "Internal Server Error", error: err.message });
});

// Khởi động server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
