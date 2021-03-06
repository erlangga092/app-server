import mongoose from "mongoose";

const cartItemSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Nama produk harus diisi"],
  },
  price: {
    type: Number,
    default: 0,
  },
  qty: {
    type: Number,
    required: [true, "qty harus diisi"],
    min: [1, "Minimal qty adalah 1"],
  },
  image_url: {
    type: String,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
});

export default mongoose.model("CartItem", cartItemSchema);
