"use strict";

const express = require("express");
const { asyncHandler } = require("../../auth/checkAuthen");
const CartController = require("../../controllers/cart.controller");
const router = express.Router();

router.post("/cart", asyncHandler(CartController.addToCart));
router.delete("", asyncHandler(CartController.deleteToCart));
router.get("", asyncHandler(CartController.getListToCart));
router.post("/update", asyncHandler(CartController.updateToCart));

module.exports = router;
