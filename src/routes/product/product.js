"use strict";

const express = require("express");
const { permission, asyncHandler } = require("../../auth/checkAuthen");
const productController = require("../../controllers/product.controller");
const { authentication } = require("../../auth/authUtils");
const router = express.Router();

router.use(authentication);

router.post(
  "/products",
  permission(["Admin", "Mentor"]),
  asyncHandler(productController.createProduct)
);

router.post(
  "/published/:product_id",
  permission(["Admin", "Mentor"]),
  asyncHandler(productController.publishProduct)
);

router.get(
  "/drafts/all",
  permission(["Admin", "Mentor"]),
  asyncHandler(productController.getAllDraftsForShop)
);

router.get(
  "/published/all",
  permission(["Admin", "Mentor"]),
  asyncHandler(productController.getAllPublishForShop)
);

router.get(
  "/search/:keySearch",
  permission(["Admin", "Mentor"]),
  asyncHandler(productController.getListSearchProduct)
);

router.get(
  "/product",
  asyncHandler(productController.findAllProducts)
);

router.get(
  "/product/:product_id",
  permission(["Admin", "Mentor"]),
  asyncHandler(productController.findOneProduct)
);

router.get(
  "/product/:product_id",
  permission(["Admin", "Mentor"]),
  asyncHandler(productController.updateProduct)
);

module.exports = router;
