const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

// Serve file tĩnh trong thư mục "public"
app.use(express.static(path.join(__dirname, "public")));

app.listen(PORT, () => {
  console.log(`🚀 Server chạy tại: http://localhost:${PORT}`);
});
