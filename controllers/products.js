const prisma = require("../config/prisma");
const { internalErr } = require("../utils/internalErr");

exports.createProduct = async (req, res) => {
  try {
    const { title, description, price, quantity, categoryId, images } =
      req.body;
    console.log(req.body);
    const product = await prisma.product.create({
      data: {
        title: title,
        description: description,
        price: parseFloat(price),
        quantity: parseInt(quantity),
        categoryId: parseInt(categoryId),
        images: {
          create: images.map((item) => {
            return {
              asset_id: item.asset_id,
              public_id: item.public_id,
              url: item.url,
              secure_url: item.secure_url,
            };
          }),
        },
      },
    });

    res.send(product);
  } catch (error) {
    internalErr(res, error);
  }
};

exports.listProducts = async (req, res) => {
  try {
    const { count } = req.params;
    console.log(count);
    const products = await prisma.product.findMany({
      take: parseInt(count),
      orderBy: { createdAt: "desc" },
      include: {
        category: true,
        images: true,
      },
    });
    res.send(products);
  } catch (error) {
    internalErr(res, error);
  }
};

exports.read = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: {
        id: parseInt(id),
      },
      include: {
        category: true,
        images: true,
      },
    });
    res.send(product);
  } catch (error) {
    internalErr(res, error);
  }
};

exports.removeProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.product.delete({
      where: {
        id: parseInt(id),
      },
    });
    res.send("Delete success");
  } catch (error) {
    internalErr(res, error);
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, price, quantity, categoryId, images } =
      req.body;

    await prisma.image.deleteMany({
      where: {
        productId: parseInt(id),
      },
    });

    const product = await prisma.product.update({
      where: {
        id: parseInt(id),
      },
      data: {
        title: title,
        description: description,
        price: parseFloat(price),
        quantity: parseInt(quantity),
        categoryId: parseInt(categoryId),
        images: {
          create: images.map((item) => {
            return {
              asset_id: item.asset_id,
              public_id: item.public_id,
              url: item.url,
              secure_url: item.secure_url,
            };
          }),
        },
      },
    });

    res.send(product);
  } catch (error) {
    internalErr(res, error);
  }
};

exports.listBy = async (req, res) => {
  try {
    const { sort, order, limit } = req.body;
    const products = await prisma.product.findMany({
      orderBy: {
        [sort]: order,
      },
      take: parseInt(limit),
      include: {
        category: true,
        images: true,
      },
    });
    res.send(products);
  } catch (error) {
    internalErr(res, error);
  }
};

const handleQuery = async (req, res, query) => {
  try {
    const products = await prisma.product.findMany({
      where: {
        title: {
          contains: query,
        },
      },
      include: {
        category: true,
        images: true,
      },
    });
    res.send(products);
  } catch (error) {
    internalErr(res, error);
  }
};

const handleCategory = async (req, res, categoryId) => {
  try {
    const products = await prisma.product.findMany({
      where: {
        categoryId: {
          in: categoryId.map((id) => {
            return parseInt(id);
          }),
        },
      },
      include: {
        category: true,
        images: true,
      },
    });
    res.send(products);
  } catch (error) {
    internalErr(res, error);
  }
};

const handlePrice = async (req, res, priceRange) => {
  try {
    const products = await prisma.product.findMany({
      where: {
        price: {
          gte: priceRange[0],
          lte: priceRange[1],
        },
      },
      include: {
        category: true,
        images: true,
      },
    });
    res.send(products);
  } catch (error) {
    internalErr(res, error);
  }
};

exports.searchFilters = async (req, res) => {
  try {
    const { query, category, price } = req.body;
    if (query) {
      console.log(`query: ${query}`);
      await handleQuery(req, res, query);
    }
    if (category) {
      console.log(`category: ${category}`);
      await handleCategory(req, res, category);
    }
    if (price) {
      console.log(`price: ${price}`);
      await handlePrice(req, res, price);
    }
  } catch (error) {
    internalErr(res, error);
  }
};
