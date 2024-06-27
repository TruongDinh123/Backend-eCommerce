const { NotFoundError } = require("../core/error.response");
const cartModel = require("../models/cart.model");
const { getProductById } = require("../models/repo/product.repo");

class CartService {
  static async createUserCart({ userId, product }) {
    const query = { cart_userId: userId, cart_state: "active" },
      updateOrInsert = {
        $addToSet: {
          cart_products: product,
        },
      },
      option = { upsert: true, new: true };
    return await cartModel.findOneAndUpdate(query, updateOrInsert, option);
  }

  static async updateUserCartQuantity({ userId, product }) {
    console.log("🚀 ~ product:", product);
    const { productId, quantity } = product;

    const query = {
        cart_userId: userId,
        "cart_products.productId": productId,
        cart_state: "active",
      },
      updateSet = {
        $inc: {
          "cart_products.$.quantity": quantity,
        },
        /*
        Dấu $ ở đây là toán tử vị trí. 
        Nó chỉ đến phần tử đầu tiên trong mảng cart_products mà thỏa mãn điều kiện tìm kiếm trong query.
        */
      },
      option = { upsert: true, new: true };

    return await cartModel.findOneAndUpdate(query, updateSet, option);
  }

  static async addToCart({ userId, product = {} }) {
    const userCart = await cartModel.findOne({ cart_userId: userId });
    if (!userCart) {
      return await CartService.createUserCart({ userId, product });
    }

    //neu co gio hang nhung chua co san pham
    if (!userCart.cart_products.length == "") {
      userCart.cart_products = [product];

      return await userCart.save();
    }

    //neu co gio hang va co san pham trung nhau thi update quanity
    return await CartService.updateUserCartQuantity({ userId, product });
  }

  static async addToCartV2({ userId, shop_order_ids }) {
    try {
      const { productId, quantity, old_quantity } =
        shop_order_ids[0]?.item_products[0];

      //check product
      const foundProduct = await getProductById(productId);
      if (!foundProduct) {
        throw new NotFoundError("Product not found");
      }

      //compare
      if (
        foundProduct.product_account.toString() !== shop_order_ids[0]?.shopId
      ) {
        throw new NotFoundError("Product do not belong to the shop");
      }

      if (quantity === 0) {
        //
      }

      return await CartService.updateUserCartQuantity({
        userId,
        product: {
          productId,
          quantity: quantity - old_quantity,
        },
      });
    } catch (error) {
      console.log("🚀 ~ error:", error);
    }
  }

  static async deleteUserCart({ userId, productId }) {
    const query = { cart_userId: userId, cart_state: "active" };
    updateSety = {
      $pull: {
        cart_products: {
          productId,
        },
      },
    };

    const deleteCart = await cartModel.updateOne(query, updateSet);
    return deleteCart;
  }

  static async getListUserCart({ userId }) {
    return await cartModel.findOne({
      cart_userId: userId,
    });
  }
}
module.exports = CartService;
