const express = require("express");
const {
  getAllbooks,
  createBook,
  updateBook,
  getOneBook,
} = require("../controller/BookController");
const isAuthPassport = require("../middleware/isAuthPassport");
const isRole = require("../middleware/isRole");
const router = express.Router();

router
  .get("/", isAuthPassport, getAllbooks)
  .post("/", isAuthPassport, isRole("ADMIN"), createBook);
router
  .get("/:id", getOneBook)
  .put("/:id", updateBook)
  .delete("/:id", updateBook);

module.exports = router;
