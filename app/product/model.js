import mongoose from "mongoose";

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      minlength: [3, "Nama produk minimal 3 karakter"],
      maxlength: [255, "Nama produk maksimal 255 karakter"],
      required: [true, "Nama produk harus diisi"],
    },
    description: {
      type: String,
      maxlength: [1000, "Deskripsi produk maksimal 1000 karakter"],
    },
    price: {
      type: Number,
      default: 0,
    },
    image_url: {
      type: String,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    tags: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tag",
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
