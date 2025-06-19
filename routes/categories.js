const {
  addCategory,
  litsCategory,
  removeCategory,
} = require("../controllers/category");

const router = require("express").Router();

router.route("/category").post(addCategory).get(litsCategory);
router.route("/category/:id").delete(removeCategory);

module.exports = router;
