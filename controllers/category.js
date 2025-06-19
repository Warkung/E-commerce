const prisma = require("../config/prisma");
const { internalErr } = require("../utils/internalErr");

exports.addCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const category = await prisma.category.create({
      data: {
        name: name,
      },
    });
    res.status(201).send(category);
  } catch (error) {
    internalErr(res, error);
  }
};

exports.litsCategory = async (req, res) => {
  try {
    const categories = await prisma.category.findMany();
    res.status(200).send(categories);
  } catch (error) {
    internalErr(res, error);
  }
};

exports.removeCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await prisma.category.delete({
      where: {
        id: Number(id),
      },
    });
    res.status(200).send(`Category "${category.name}" deleted`);
  } catch (error) {
    internalErr(res, error);
  }
};
