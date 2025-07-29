const express = require("express");
const {
  createUser,
  getAllUser,
  getOneUser,
  updateUser,
  deleteUser,
  login,
  currentUser,
} = require("../controller/UserController");
const { isAuth } = require("../middleware/isAuth");
const isAuthPassport = require("../middleware/isAuthPassport");
const isRole = require("../middleware/isRole");
const router = express.Router();

router.get("/", getAllUser);

router.post("/", createUser);
router.post("/login", login);
router.get("/currentUser", isAuthPassport, isRole("ADMIN"), currentUser);
router.get("/:id", isAuthPassport, getOneUser);
router.patch("/:id", isAuthPassport, updateUser);
router.delete("/:id", isAuthPassport, deleteUser);

module.exports = router;
