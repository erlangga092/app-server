import mongoose from "mongoose";

const deliveryAddressSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Nama alamat harus diisi"],
      minlength: [3, "Nama alamat minimal 3 karakter"],
    },
    kelurahan: {
      type: String,
      required: [true, "Kelurahan harus diisi"],
    },
    kecamatan: {
      type: String,
      required: [true, "Kecamatan harus diisi"],
    },
    kabupaten: {
      type: String,
      required: [true, "Kabupaten harus diisi"],
    },
    provinsi: {
      type: String,
      required: [true, "Provinsi harus diisi"],
    },
    detail: {
      type: String,
      required: [true, "Detail alamat harus diisi"],
      maxlength: [1000, "Detail alamat maksimal 1000 karakter"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export default mongoose.model("DeliveryAddress", deliveryAddressSchema);
