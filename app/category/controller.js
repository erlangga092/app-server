import Category from "./model";
import { policyFor } from "../policy";

const index = async (req, res, next) => {
  try {
    const categories = await Category.find();
    return res.json(categories);
  } catch (err) {
    next(err);
  }
};

const single = async (req, res, next) => {
  try {
    const category = await Category.findOne({ _id: req.params.id });
    return res.json(category);
  } catch (err) {
    next(err);
  }
};

const store = async (req, res, next) => {
  try {
    const policy = policyFor(req.user);

    if (!policy.can("create", "Category")) {
      return res.json({
        error: 1,
        message: "Not allowed to perform this action",
      });
    }

    const category = new Category(req.body);
    await category.save();
    return res.json(category);
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

    if (!policy.can("update", "Category")) {
      return res.json({
        error: 1,
        message: "Not allowed to perform this action",
      });
    }

    const payload = req.body;
    const category = await Category.findOneAndUpdate(
      { _id: req.params.id },
      payload,
      { new: true }
    );
    return res.json(category);
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

    if (!policy.can("delete", "Category")) {
      return res.json({
        error: 1,
        message: "Not allowed to perform this action",
      });
    }

    const category = await Category.findOneAndDelete({ _id: req.params.id });
    return res.json(category);
  } catch (err) {
    next(err);
  }
};

export { index, single, store, update, destroy };
