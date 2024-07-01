const inventoryModel = require("../inventory.model");
const { Types } = require("mongoose");
const { convertToObjectIdMongodb } = require("../../utils");
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
      inven_productId: convertToObjectIdMongodb(productId),
      inven_stock: { $gte: quantity },
    },
    updateSet = {
      $inc: {
        inven_stock: -quantity,
      },
      $push: {
        inven_reservations: {
          quantity,
          cardId,
          createOn: new Date(),
        },
      },
    },
    options = { upsert: true, new: true };

  return await inventoryModel.updateOne(query, updateSet);
};

module.exports = { insertInventory, reservationInventory };
