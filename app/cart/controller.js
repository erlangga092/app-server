import CartItem from "../cart-item/model";
import Product from "../product/model";
import { policyFor } from "../policy";

const index = async (req, res, next) => {
  try {
    const policy = policyFor(req.user);

    if (!policy.can("read", "Cart")) {
      return res.json({
        error: 1,
        message: "Not allowed to perform this action",
      });
    }

    const items = await CartItem.find({ user: req.user._id }).populate(
      "product"
    );

    return res.json(items);
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const policy = policyFor(req.user);

    if (!policy.can("update", "Cart")) {
      return res.json({
        error: 1,
        message: "Not allowed to perform this action",
      });
    }

    const { items } = req.body;
    const productIds = items.map((item) => item._id);
    const products = await Product.find({ _id: { $in: productIds } });

    const cartItems = items.map((item) => {
      const relatedProduct = products.map(
        (product) => product._id.toString() === item._id
      );
      return {
        _id: relatedProduct._id,
        product: relatedProduct._id,
        user: req.user._id,
        name: relatedProduct.name,
        price: relatedProduct.price,
        image_url: relatedProduct.image_url,
        qty: item.qty,
      };
    });

    await CartItem.deleteMany({ user: req.user._id });
    await CartItem.bulkWrite(
      cartItems.map((item) => {
        return {
          updateOne: {
            filter: { user: req.user._id, product: item.product },
            update: item,
            upsert: true,
          },
        };
      })
    );

    return res.json(cartItems);
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

export { index, update };
