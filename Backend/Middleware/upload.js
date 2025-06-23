const multer = require('multer');
const path = require('path');

// Configure storage for uploaded files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {

    if (req.originalUrl.includes('/datasource/upload/csv')) {
        cb(null, 'uploads/csvs/'); 
      } else {
        cb(null, 'uploads/'); // Default upload directory
      }
  },
  filename: function (req, file, cb) {
    const filename = file.originalname.split(".");
    cb(null, filename[0] + ' - ' + Date.now() + path.extname(file.originalname)); // Rename file
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
