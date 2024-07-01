"use strict";

const { profile } = require("console");
const { resolve } = require("path");
const redis = require("redis");
const { promisify } = require("util");
const { reservationInventory } = require("../models/repo/inventory.repo");
const redisClient = redis.createClient();

//promisify chuyển đổi 1 function thành 1 function async await
const pexpire = promisify(redisClient.pExpire).bind(redisClient);

const setnxAsync = promisify(redisClient.setNX).bind(redisClient);

const acquireLock = async (productId, quantity, cartId) => {
  const key = `lock_v2023_${productId}`;
  const retryTime = 10;
  const expireTime = 3000;

  for (let i = 0; i < retryTime.length; i++) {
    //Tạo 1 key, thằng nào nắm giữ được key vào thanh toán
    const result = await setnxAsync(key, expireTime);

    if (result === 1) {
      //thao tac voi inventory

      const isReversation = await reservationInventory({
        productId,
        quantity,
        cartId,
      });

      if (isReversation.modifiedCount) {
        //modifiedCount cho biết số lượng tài liệu đã được sửa đổi khi thực hiện
        //các hàm updateOne(), updateMany(), hoặc findOneAndUpdate()
        await pexpire(key, expireTime);
        return key;
      }
      return null;
    } else {
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
  }
};

const releaseLock = async (keyLock) => {
  const delAsyncKey = promisify(redisClient.decr).bind(redisClient);
  return await delAsyncKey(keyLock);
};

module.exports = {
  acquireLock,
  releaseLock,
};
