const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const port = 3000;

// Tạo thư mục uploads nếu chưa có
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Cấu hình multer để lưu file vào thư mục uploads/
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, "firmware.bin"); // Luôn lưu với tên này (có thể sửa theo ESP ID)
  },
});

const upload = multer({ storage: storage });

// Endpoint để upload firmware
app.post("/upload", upload.single("firmware"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "Không có file nào được tải lên!" });
  }
  res.json({ message: "Upload thành công!", filename: req.file.filename });
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

// Khởi động server
app.listen(port, () => {
  console.log(`Server đang chạy tại http://localhost:${port}`);
});
