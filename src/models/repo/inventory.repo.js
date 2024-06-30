const inventoryModel = require("../inventory.model");
const { Types } = require("mongoose");

const insertInventory = async ({
  productId,
  accountId,
  stuck,
  location = "unknow",
}) => {
  return await inventoryModel.create({
    inven_productId: productId,
    inven_location: location,
    inven_stock: stuck,
    iven_accountId: accountId,
  });
};

const reservationInventory = async ({ productId, quantity, cardId }) => {
  const query = {
    inven_productId: productId,
  };
};

module.exports = { insertInventory };
