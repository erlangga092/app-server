import mongoose from "mongoose";

const deliveryAddressSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Nama alamat harus diisi"],
    maxlength: [255, "Nama alamat maksimal 255 karakter"],
  },
  kelurahan: {
    type: String,
    required: [true, "Kelurahan harus diisi"],
    maxlength: [255, "Kelurahan maksimal 255 karakter"],
  },
  kecamatan: {
    type: String,
    required: [true, "Kecamatan harus diisi"],
    maxlength: [255, "Kecamatan maksimal 255 karakter"],
  },
  kabupaten: {
    type: String,
    required: [true, "Kabupaten harus diisi"],
    maxlength: [255, "Kabupaten maksimal 255 karakter"],
  },
  provinsi: {
    type: String,
    required: [true, "Provinsi harus diisi"],
    maxlength: [255, "Provinsi maksimal 255 karakter"],
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
});

export default mongoose.model("DeliveryAddress", deliveryAddressSchema);
