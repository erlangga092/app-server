import mongoose from "mongoose";
import Order from "./model";
import OrderItem from "../order-item/model";
import CartItem from "../cart-item/model";
import DeliveryAddress from "../delivery-address/model";
import { policyFor } from "../policy";

const store = async (req, res, next) => {
  try {
    const policy = policyFor(req.user);

    if (!policy.can("create", "Order")) {
      return res.json({
        error: 1,
        message: "Not allowed to perform this action",
      });
    }

    const { delivery_address, delivery_fee } = req.body;
    const items = await CartItem.find({ user: req.user._id }).populate(
      "product"
    );

    if (!items.length) {
      return res.json({
        error: 1,
        message: "Can't create order because you have no items in cart",
      });
    }

    const address = await DeliveryAddress.find({ _id: delivery_address });

    let order = new Order({
      _id: new mongoose.Types.ObjectId(),
      status: "waiting_payment",
      delivery_fee,
      delivery_address: {
        provinsi: address.provinsi,
        kabupaten: address.kabupaten,
        kecamatan: address.kecamatan,
        kelurahan: address.kelurahan,
        detail: address.detail,
      },
      user: req.user._id,
    });

    let orderItems = await OrderItem.insertMany(
      items.map((item) => {
        return {
          ...item,
          name: item.product.name,
          qty: parseInt(item.qty, 10),
          price: parseInt(item.product.price, 10),
          order: order._id,
          product: item.product._id,
        };
      })
    );

    orderItems.forEach((item) => order.order_items.push(item));
    order.save();
    await CartItem.deleteMany({ user: req.user._id });
    return res.json(order);
  } catch (err) {
    if (err && err.name === "ValidationError") {
      return res.json({
        error: 1,
        message: err.message,
        fields: err.errors,
      });
    }
    next(err);
  }
};

export { store };
