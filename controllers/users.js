const prisma = require("../config/prisma");
const { internalErr } = require("../utils/internalErr");

exports.listUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        enabled: true,
        address: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });
    res.send(users);
  } catch (error) {
    internalErr(res, error);
  }
};

exports.changeStatus = async (req, res) => {
  try {
    const { id, enabled } = req.body;
    await prisma.user.update({
      where: {
        id: parseInt(id),
      },
      data: {
        enabled: Boolean(enabled),
      },
    });
    res.send(`Update status to ${enabled}`);
  } catch (error) {
    internalErr(res, error);
  }
};

exports.changeRole = async (req, res) => {
  try {
    const { id, role } = req.body;
    await prisma.user.update({
      where: {
        id: parseInt(id),
      },
      data: {
        role: role,
      },
    });
    res.send(`Update role to "${role}"`);
  } catch (error) {
    internalErr(res, error);
  }
};

exports.userCart = async (req, res) => {
  try {
    const { cart } = req.body;
    const user = await prisma.user.findUnique({
      where: {
        id: req.user.id,
      },
    });
    await prisma.productOnCart.deleteMany({
      where: {
        cart: {
          orderedById: user.id,
        },
      },
    });
    await prisma.cart.deleteMany({
      where: {
        orderedById: user.id,
      },
    });
    // เตรียม product
    let products = cart.map((product) => ({
      productId: product.id,
      count: product.count,
      price: product.price,
    }));

    // หาผลรวม
    let cartTotal = products.reduce(
      (total, product) => total + product.price * product.count,
      0
    );

    // สร้าง cart
    let newCart = await prisma.cart.create({
      data: {
        products: {
          create: products,
        },
        cartTotal: cartTotal,
        orderedById: user.id,
      },
    });
    res.send(newCart);
  } catch (error) {
    internalErr(res, error);
  }
};

exports.getUserCart = async (req, res) => {
  try {
    const cart = await prisma.cart.findFirst({
      where: {
        orderedById: parseInt(req.user.id),
      },
      include: {
        products: {
          include: {
            product: true,
          },
        },
      },
    });
    res.json({ products: cart.products, cartTotal: cart.cartTotal });
  } catch (error) {
    internalErr(res, error);
  }
};

exports.emptyCart = async (req, res) => {
  try {
    res.send("empty cart");
  } catch (error) {
    internalErr(res, error);
  }
};

exports.saveAddress = async (req, res) => {
  try {
    res.send("save address");
  } catch (error) {
    internalErr(res, error);
  }
};

exports.saveOrder = async (req, res) => {
  try {
    res.send("save order");
  } catch (error) {
    internalErr(res, error);
  }
};

exports.getOrder = async (req, res) => {
  try {
    res.send("get orders");
  } catch (error) {
    internalErr(res, error);
  }
};
