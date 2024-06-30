"use strict";

const { product, clothing, electronic } = require("../../models/product.model");
const { Types } = require("mongoose");
const {
  getSelectData,
  unGetSelectData,
  convertToObjectIdMongodb,
} = require("../../utils");

const findAllDraftForShop = async ({ query, limit, skip }) => {
  return await queryProduct({ query, limit, skip });
};

const findAllPublishForShop = async ({ query, limit, skip }) => {
  return await queryProduct({ query, limit, skip });
};

const searchProductsForShop = async ({ keySearch, limit, skip }) => {
  const regaxSearch = new RegExp(keySearch);
  const result = await product
    .find(
      {
        isPublished: true,
        $text: { $search: regaxSearch },
      },
      { score: { $meta: "textScore" } }
    )
    .sort({ score: { $meta: "textScore" } })
    .lean();
  return result;
};

const publishProductByShop = async ({ product_account, product_id }) => {
  const foundShop = await product.findOne({
    product_account: new Types.ObjectId(product_account),
    _id: new Types.ObjectId(product_id),
  });
  if (!foundShop) return null;
  foundShop.isDraft = false;
  foundShop.isPublished = true;
  const { modifiedCount } = await foundShop.updateOne(foundShop);

  return modifiedCount;
};

const findAllProducts = async ({ limit, sort, page, filter, select }) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
  //ctime: lấy ra sản phẩm mới nhất.
  const products = await product
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectData(select))
    .lean();

  return products;
};

const findOneProudct = async ({ product_id, unSelect }) => {
  return await product.findById(product_id).select(unGetSelectData(unSelect));
};

const queryProduct = async ({ query, limit, skip }) => {
  return await product
    .find(query)
    .populate("product_account")
    .sort({ updateAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean()
    .exec();
};

const updateProductById = async ({
  productId,
  bodyUpdate,
  model,
  isNew = true,
}) => {
  return await product.findByIdAndUpdate(productId, bodyUpdate, {
    new: true, //thuộc tính này sẽ luôn trả về là 1 object
  });
};

const getProductById = async (productId) => {
  return await product.findOne({ _id: productId }).lean();
};

const checkProductByServer = async (products) => {
  return await Promise.all(
    products.map(async (product) => {
      const foundProduct = await getProductById(product.productId);
      if (foundProduct) {
        return {
          price: foundProduct.product_price,
          quantity: product.quantity,
          productId: product.productId,
        };
      }
    })
  );
};

module.exports = {
  findAllDraftForShop,
  publishProductByShop,
  findAllPublishForShop,
  searchProductsForShop,
  findAllProducts,
  findOneProudct,
  updateProductById,
  getProductById,
  checkProductByServer,
};
