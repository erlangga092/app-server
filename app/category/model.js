import mongoose from "mongoose";

const categorySchema = mongoose.Schema({
  name: {
    type: String,
    minlength: [3, "Kategori produk minimal 3 karakter"],
    maxlength: [20, "Kategori produk maksimal 20 karakter"],
    required: [true, "Kategori produk harus diisi"],
  },
});

export default mongoose.model("Category", categorySchema);
