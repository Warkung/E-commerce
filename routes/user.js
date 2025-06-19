const {
  listUsers,
  changeStatus,
  changeRole,
  userCart,
  saveAddress,
  getUserCart,
  emptyCart,
  saveOrder,
  getOrder,
} = require("../controllers/users");
const { authCheck, adminCheck } = require("../middlewares/authCheck");

const router = require("express").Router();

router.route("/users").get(authCheck, adminCheck, listUsers);
router.route("/change-status").post(authCheck, adminCheck, changeStatus);
router.route("/change-role").post(authCheck, adminCheck, changeRole);
router
  .route("/users/cart")
  .post(authCheck, userCart)
  .get(authCheck, getUserCart)
  .delete(authCheck, emptyCart);
router.route("/users/address").post(authCheck, saveAddress);
router
  .route("/users/order")
  .post(authCheck, saveOrder)
  .get(authCheck, getOrder);

module.exports = router;
