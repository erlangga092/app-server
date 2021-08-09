import mongoose from "mongoose";
import bcrypt from "bcrypt";
import mongooseSequence from "mongoose-sequence";

const HASH_ROUND = 10;
const AutoIncrement = mongooseSequence(mongoose);

const userSchema = mongoose.Schema(
  {
    full_name: {
      type: String,
      minlength: [3, "Nama lengkap minimal 3 karakter"],
      maxlength: [255, "Nama lengkap maksimal 255 karakter"],
      required: [true, "Nama lengkap harus diisi"],
    },
    customer_id: {
      type: Number,
    },
    email: {
      type: String,
      maxlength: [255, "Email maksimal 255 karakter"],
      required: [true, "Email harus diisi"],
    },
    password: {
      type: String,
      maxlength: [255, "Password maksimal 255 karakter"],
      required: [true, "Password harus diisi"],
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    token: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
);

// validate email
userSchema.path("email").validate(
  function (value) {
    const EMAIL_RE = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    return EMAIL_RE.test(value);
  },
  (attr) => `${attr.value} harus merupakan email yang valid!`
);

// validate email if exist
userSchema.path("email").validate(
  async function (value) {
    try {
      const count = await this.model("User").count({ email: value });
      return !count;
    } catch (err) {
      throw err;
    }
  },
  (attr) => `${attr.value} sudah terdaftar`
);

// hashing password
userSchema.pre("save", function (next) {
  this.password = bcrypt.hashSync(this.password, HASH_ROUND);
  next();
});

// auto increment
userSchema.plugin(AutoIncrement, { inc_field: "customer_id" });

export default mongoose.model("User", userSchema);
