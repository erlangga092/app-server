import path from "path";
import fs from "fs";
import Product from "./model";
import Category from "../category/model";
import Tag from "../tag/model";
import { envModule } from "../config";
import { policyFor } from "../policy";

const index = async (req, res, next) => {
  try {
    let { limit = 10, skip = 0, q = "", category = "", tags = [] } = req.query;
    let criteria = {};

    if (q.length) {
      criteria = {
        ...criteria,
        name: { $regex: `${q}`, $options: "i" },
      };
    }

    if (category.length) {
      const category = await Category.findOne({
        name: { $regex: `${category}`, $options: "i" },
      });

      if (category) {
        criteria = {
          ...criteria,
          category: category._id,
        };
      }
    }

    if (tags.length) {
      const tags = await Tag.find({ name: { $in: tags } });
      if (tags.length) {
        criteria = {
          ...criteria,
          tags: { $in: tags.map((tag) => tag._id) },
        };
      }
    }

    const count = await Product.find(criteria).countDocuments();

    const products = await Product.find(criteria)
      .limit(parseInt(limit, 10))
      .skip(parseInt(skip, 10))
      .populate("category")
      .populate("tags");
    return res.json(products);
  } catch (err) {
    next(err);
  }
};

const single = async (req, res, next) => {
  try {
    const product = await Product.findOne({ _id: req.params.id });
    return res.json(product);
  } catch (err) {
    next(err);
  }
};

const store = async (req, res, next) => {
  try {
    const policy = policyFor(req.user);

    if (!policy.can("create", "Product")) {
      return res.json({
        error: 1,
        message: "Not allowed to perform this action",
      });
    }

    let payload = req.body;

    if (payload.category) {
      const category = await Category.findOne({
        name: { $regex: payload.category, $options: "i" },
      });

      category
        ? (payload = {
            ...payload,
            category: category._id,
          })
        : delete payload.category;
    }

    if (payload.tags && payload.tags.length) {
      const tags = await Tag.find({
        name: { $in: payload.tags, $options: "i" },
      });

      if (tags.length) {
        payload = {
          ...payload,
          tags: tags.map((tag) => tag._id),
        };
      }
    }

    if (req.file) {
      const tmp_path = req.file.path;
      const originalExt =
        req.file.originalname.split(".")[
          req.file.originalname.split(".").length - 1
        ];
      const filename = `${req.file.filename}.${originalExt}`;
      const target_path = path.resolve(
        envModule.rootPath,
        `public/upload/${filename}`
      );

      const src = fs.createReadStream(tmp_path);
      const dest = fs.createWriteStream(target_path);
      src.pipe(dest);

      src.on("end", async () => {
        const product = new Product({
          ...payload,
          image_url: filename,
        });
        await product.save();
        return res.json(product);
      });

      src.on("error", async () => {
        next(err);
      });
    } else {
      const product = new Product(payload);
      await product.save();
      return res.json(product);
    }
  } catch (err) {
    if (err && err.name === "ValidationError") {
      return res.json({
        error: 1,
        message: err.message,
        fields: err.errors,
      });
    }
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const policy = policyFor(req.user);

    if (!policy.can("update", "Product")) {
      return res.json({
        error: 1,
        message: "Not allowed to perform this action",
      });
    }

    const payload = req.body;

    if (payload.category) {
      const category = await Category.findOne({
        name: { $regex: payload.category, $options: "i" },
      });

      category
        ? (payload = {
            ...payload,
            category: category._id,
          })
        : delete payload.category;
    }

    if (req.file) {
      const tmp_path = req.file.path;
      const originalExt =
        req.file.originalname.split(".")[
          req.file.originalname.split(".").length - 1
        ];
      const filename = `${req.file.filename}.${originalExt}`;
      const target_path = path.resolve(
        envModule.rootPath,
        `public/upload/${filename}`
      );

      const src = fs.createReadStream(tmp_path);
      const dest = fs.createWriteStream(target_path);
      src.pipe(dest);

      src.on("end", async () => {
        let product = await Product.findOne({ _id: req.params.id });
        const currentImage = `${envModule.rootPath}/public/upload/${product.image_url}`;

        if (fs.existsSync(currentImage)) {
          fs.unlinkSync(currentImage);
        }

        product = await Product.findOneAndUpdate(
          {
            _id: req.params.id,
          },
          {
            ...payload,
            image_url: filename,
          },
          {
            new: true,
            runValidators: true,
          }
        );
        return res.json(product);
      });

      src.on("error", async () => {
        next(err);
      });
    } else {
      const product = await Product.findOneAndUpdate(
        { _id: req.params.id },
        payload,
        { new: true, runValidators: true }
      );
      return res.json(product);
    }
  } catch (err) {
    if (err && err.name === "ValidationError") {
      return res.json({
        error: 1,
        message: err.message,
        fields: err.errors,
      });
    }
    next(err);
  }
};

const destroy = async (req, res, next) => {
  try {
    const policy = policyFor(req.user);

    if (!policy.can("create", "Product")) {
      return res.json({
        error: 1,
        message: "Not allowed to perform this action",
      });
    }

    let product = await Product.findOneAndDelete({ _id: req.params.id });
    const currentImage = `${envModule.rootPath}/public/upload/${product.image_url}`;
    if (fs.existsSync(currentImage)) {
      fs.unlinkSync(currentImage);
    }
    return res.json(product);
  } catch (err) {
    next(err);
  }
};

export { index, single, store, update, destroy };
