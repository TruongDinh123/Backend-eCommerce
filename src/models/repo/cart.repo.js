"use strict";

const cartModel = require("../cart.model");

const findByCartId = async (cartId) => {
  return await cartModel
    .findOne({
      _id: cartId,
      cart_state: "active",
    })
    .lean();
};

module.exports = {
  findByCartId,
};
