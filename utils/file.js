const fs = require("fs");

const deleteFile = (path) => {
  fs.unlink(path, (err) => {
    console.log(err);
  });
};

exports.deleteFile = deleteFile;
