"use strict";

const { SuccessReponse } = require("../core/success.reponse");
const CartService = require("../services/cart.service");

class CartController {
  addToCart = async (req, res, next) => {
    new SuccessReponse({
      message: "Add to cart Successfully",
      metadata: await CartService.addToCart(req.body),
    }).send(res);
  };

  updateToCart = async (req, res, next) => {
    new SuccessReponse({
      message: "update to cart Successfully",
      metadata: await CartService.addToCartV2(req.body),
    }).send(res);
  };

  deleteToCart = async (req, res, next) => {
    new SuccessReponse({
      message: "Delete to cart Successfully",
      metadata: await CartService.deleteUserCart(req.body),
    }).send(res);
  };

  getListToCart = async (req, res, next) => {
    new SuccessReponse({
      message: "Get list to cart Successfully",
      metadata: await CartService.getListUserCart(req.body),
    }).send(res);
  };
}

module.exports = new CartController();
