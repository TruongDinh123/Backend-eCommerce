"use strict";

const express = require("express");
const { apiKey } = require("../auth/checkAuthen");
const router = express.Router();

//check apiKey
router.use(apiKey);

router.use("/v1/api", require("./access"));
router.use("/v1/api", require("./access/role"));
router.use("/v1/api", require("./product/product"));
router.use("/v1/api/checkout", require("./checkout"));
router.use("/v1/api", require("./cart"));

module.exports = router;
