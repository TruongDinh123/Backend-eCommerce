"use strict";

const DiscountService = require("../services/discount.service");

class DiscountController {
  createDiscount = async (req, res, next) => {
    new SuccessReponse({
      message: "Create Discount Successfully",
      metadata: await DiscountService.createDiscountService({
        ...req,
        accountId: req.user.userId,
      }),
    }).send(res);
  };
}

module.exports = new DiscountController();
