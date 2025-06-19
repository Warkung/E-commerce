const { internalErr } = require("../utils/internalErr");
const prisma = require("../config/prisma");
const bcrypt = require("bcryptjs"); // bcryptjs is used in package.json
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email) {
      return res.status(400).json({ message: "email is required" });
    }
    if (!password) {
      return res.status(400).json({ message: "password is required" });
    }
    const user = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });
    if (user) {
      return res.status(400).json({ message: "user already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.create({
      data: {
        email: email,
        password: hashedPassword,
      },
    });
    res.json({ message: "user created" });
  } catch (error) {
    internalErr(res, error);
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    //### check user email
    const user = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });
    if (!user || !user.enabled) {
      return res.status(400).json({ message: "User not found" });
    }

    //### check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password!!" });
    }
    //### create token
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
      (err, token) => {
        if (err) throw err;
        res.json({ payload, token });
      }
    );
  } catch (error) {
    internalErr(res, error);
  }
};
