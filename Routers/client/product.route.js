const express = require("express");
const router = express.Router();

const controller = require("../../controllers/client/product.controller")

router.get("/", controller.index);

// ..more router

module.exports = router;