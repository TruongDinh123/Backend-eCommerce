"use strict";

const { SuccessReponse } = require("../core/success.reponse");
const CheckoutService = require("../services/checkout.service");

class CheckoutController {
  checkoutReview = async (req, res, next) => {
    new SuccessReponse({
      message: "Add to cart Successfully",
      metadata: await CheckoutService.checkoutReview(req.body),
    }).send(res);
  };
}

module.exports = new CheckoutController();
