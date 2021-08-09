import mongoose from "mongoose";

const cartItemSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Nama produk harus diisi"],
    minlength: [5, "Nama produk minimal 5 karakter"],
  },
  qty: {
    type: Number,
    required: [true, "qty harus diisi"],
    min: [1, "qty minimal adalah 1"],
  },
  price: {
    type: Number,
    default: 0,
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
