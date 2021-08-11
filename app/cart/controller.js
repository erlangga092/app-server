import CartItem from "../cart-item/model";
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

    const carts = await CartItem.find({ user: req.user._id }).populate(product);
    return res.json(carts);
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
    const productIds = items.map((item) => item.product._id);
    const products = await Product.find({ _id: { $in: productIds } });

    const cartItems = items.map((item) => {
      const relatedProduct = products.map(
        (product) => product._id.toString() === item.product._id
      );
      return {
        product: relatedProduct._id,
        name: relatedProduct.name,
        price: relatedProduct.price,
        qty: item.qty,
        image_url: relatedProduct.image_url,
        user: req.user._id,
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
