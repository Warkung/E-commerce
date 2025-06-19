const router = require("express").Router();
const {
  createProduct,
  listProducts,
  removeProduct,
  listBy,
  searchFilters,
  updateProduct,
  read,
} = require("../controllers/products");

router.route("/product").post(createProduct);
router.route("/products/:count").get(listProducts);
router.route("/product/:id").get(read);
router.route("/product/:id").put(updateProduct).patch(updateProduct);
router.route("/product/:id").delete(removeProduct);
router.route("/productby").post(listBy);
router.route("/search/filters").post(searchFilters);

module.exports = router;
