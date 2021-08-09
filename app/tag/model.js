import mongoose from "mongoose";

const tagSchema = mongoose.Schema({
  name: {
    type: String,
    minlength: [3, "Tag produk minimal 3 karakter"],
    maxlength: [20, "Tag produk maksimal 20 karakter"],
    required: [true, "Tag produk harus diisi"],
  },
});

export default mongoose.model("Tag", tagSchema);
