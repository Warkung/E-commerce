const e = require("express");
const jwt = require("jsonwebtoken");
const prisma = require("../config/prisma");

exports.authCheck = async (req, res, next) => {
  try {
    const headerstoken = req.headers.authorization;
    if (!headerstoken) {
      return res.status(401).send("token not found");
    }

    const token = headerstoken.split(" ")[1];
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decode;
    const user = await prisma.user.findUnique({
      where: {
        email: req.user.email,
      },
    });
    if (!user.enabled) return res.status(401).send("User is not enabled");

    next();
  } catch (error) {
    console.log(error);
    if (error.name === "TokenExpiredError") {
      return res.status(401).send("Token Expired");
    }
    return res.status(401).send("Unauthorized");
  }
};

exports.adminCheck = async (req, res, next) => {
  try {
    const { email } = req.user;
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (user.role !== "admin")
      return res.status(401).send("Acess Denied: Admin Required");
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).send("Unauthorized");
  }
};
