const express = require("express");
const router = express.Router();
const fs = require("fs");
var filesize = require("filesize");

/* GET Reports page */
router.get("/", (req, res) => {
  const files = [];

  const fileNamesArray = fs.readdirSync("public/reports");
  fileNamesArray.map((filename) => {
    var stats = fs.statSync("public/reports/" + filename);

    if (filename.length === 12) {
      // exclude example-report by filename length
      files.push({
        name:
          filename.slice(0, 2) +
          "." +
          filename.slice(2, 4) +
          "." +
          filename.slice(4, 8),
        url: "/reports/" + filename,
        size: filesize(stats.size, { round: 0 }),
      });
    }
  });

  res.render("reports", { title: "CSV Reports", files });
});

module.exports = router;
