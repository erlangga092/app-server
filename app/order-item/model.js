import mongoose from "mongoose";

const orderItemSchema = mongoose.Schema({
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
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

export default mongoose.model("OrderItem", orderItemSchema);
