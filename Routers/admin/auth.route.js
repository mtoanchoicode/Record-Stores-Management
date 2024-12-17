const express = require("express");
const router = express.Router();

const controller = require("../../controllers/admin/auth.controller")
const validate = require("../../validates/admin/auth.validate")

router.get("/login", controller.login);

router.post("/login", validate.loginPost, controller.loginPost);

router.get("/logout", controller.logout);


// ..more router

module.exports = router;