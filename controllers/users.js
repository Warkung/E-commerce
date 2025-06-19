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
    res.send("edit role");
  } catch (error) {
    internalErr(res, error);
  }
};

exports.userCart = async (req, res) => {
  try {
    res.send("add to cart");
  } catch (error) {
    internalErr(res, error);
  }
};

exports.getUserCart = async (req, res) => {
  try {
    res.send("get cart");
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
