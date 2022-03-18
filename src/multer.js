const multer  = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../public/images/products'))
  },
  filename: function (req,file, cb) {
    cb(null, Date.now() + '.jpg')
  }
})

const upload = multer({ 
  storage,
});

module.exports = upload;