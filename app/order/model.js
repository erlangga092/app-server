import mongoose from "mongoose";
import mongooseSequence from "mongoose-sequence";

const autoIncrement = mongooseSequence(mongoose);

const orderSchema = mongoose.Schema(
  {
    status: {
      type: String,
      enum: ["waiting_payment", "processing", "in_delivery", "delivered"],
      default: "waiting_payment",
    },
    delivery_fee: {
      type: Number,
      default: 0,
    },
    delivery_address: {
      provinsi: {
        type: String,
        required: [true, "Provinsi harus diisi"],
      },
      kabupaten: {
        type: String,
        required: [true, "Kabupaten harus diisi"],
      },
      kecamatan: {
        type: String,
        required: [true, "Kecamatan harus diisi"],
      },
      kelurahan: {
        type: String,
        required: [true, "Kelurahan harus diisi"],
      },
      detail: {
        type: String,
      },
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      order_items: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "OrderItem",
        },
      ],
    },
  },
  { timestamps: true }
);

// auto increment
orderSchema.plugin(autoIncrement, { inc_field: "order_number" });

// virtual field for items_count
orderSchema.virtual("items_count").get(function () {
  return this.order_items.reduce((total, item) => {
    return total + parseInt(item.qty, 10);
  }, 10);
});

export default mongoose.model("Order", orderSchema);
