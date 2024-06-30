const { NotFoundError } = require("../core/error.response");
const { findByCartId } = require("../models/repo/cart.repo");
const { checkProductByServer } = require("../models/repo/product.repo");

class CheckoutService {
  static async checkoutReview({ cartId, userId, shop_order_ids }) {
    ////checkout cart found
    const foundCart = await findByCartId(cartId);
    if (!foundCart) throw new NotFoundError("Cart not found");

    const checkoutOrder = {
        totalPrice: 0,
        feeShip: 0,
        totalDiscount: 0,
        totalCheckout: 0,
      },
      shop_order_ids_new = [];

    //tinh tong tien bill
    for (let i = 0; i < shop_order_ids.length; i++) {
      const {
        shopId,
        shop_discounts = [],
        item_products = [],
      } = shop_order_ids[i];

      const checkProductServer = checkProductByServer(item_products);
      if (!checkProductServer) throw new NotFoundError("order wrong");

      //tong tien hang
      const checkoutPrice = (await checkProductServer).reduce(
        (acc, product) => {
          return acc + product.quantity * product.price;
        },
        0
      );

      checkoutOrder.totalPrice = +checkoutPrice;

      const itemCheckout = {
        shopId,
        shop_discounts,
        priceRaw: checkoutPrice,
        priceApplyDiscount: checkoutPrice,
        item_products: checkProductServer,
      };

      //neu shop discount ton tai > 0, check xem hop le hay ko

      //   if(shop_discounts.length > 0) {
      //     //gia su chi co 1 discount
      //     //get amount
      //     const {totalCheckout} = await getDisco
      //   }

      shop_order_ids_new.push(itemCheckout);
    }

    return {
      shop_order_ids,
      shop_order_ids_new,
      checkoutOrder,
    };
  }

  static async orderByUser({
    shop_order_ids,
    cartId,
    userId,
    user_address = [],
    user_payment = {},
  }) {
    const { shop_order_ids_new, checkout_order } =
      await CheckoutService.checkoutReview({
        cartId,
        userId,
        shop_order_ids,
      });

    //check lai xem co vuot ton ho hay khong?
    //get new array products
    const products = shop_order_ids_new.flatMap((order) => order.item_products);
    console.log("🚀 ~ products:", products);
    // thuc hien pessimistic lock
    for (let i = 0; products < array.length; i++) {
      const { productId, quantity } = products[i];
    }
  }
}
module.exports = CheckoutService;
