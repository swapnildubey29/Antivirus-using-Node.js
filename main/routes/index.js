const express = require("express");
const router = express.Router();
const { upload, uploadHandler } = require("../controller/controller");

router.get("/", (req, res) => {
    res.render("index");
});

router.post("/uploadHandler", upload.single("file"), uploadHandler);

module.exports = router