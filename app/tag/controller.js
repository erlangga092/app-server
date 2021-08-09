import Tag from "./model";
import { policyFor } from "../policy";

const index = async (req, res, next) => {
  try {
    const tags = await Tag.find();
    return res.json(tags);
  } catch (err) {
    next(err);
  }
};

const single = async (req, res, next) => {
  try {
    const tag = await Tag.findOne({ _id: req.params.id });
    return res.json(tag);
  } catch (err) {
    next(err);
  }
};

const store = async (req, res, next) => {
  try {
    const policy = policyFor(req.user);

    if (!policy.can("create", "Tag")) {
      return res.json({
        error: 1,
        message: "Not allowed to perform this action",
      });
    }

    const tag = new Tag(req.body);
    await tag.save();
    return res.json(tag);
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

    if (!policy.can("update", "Tag")) {
      return res.json({
        error: 1,
        message: "Not allowed to perform this action",
      });
    }

    const payload = req.body;
    const tag = await Tag.findOneAndUpdate({ _id: req.params.id }, payload, {
      new: true,
    });
    return res.json(tag);
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

    if (!policy.can("delete", "Tag")) {
      return res.json({
        error: 1,
        message: "Not allowed to perform this action",
      });
    }

    const tag = await Tag.findOneAndDelete({ _id: req.params.id });
    return res.json(tag);
  } catch (err) {
    next(err);
  }
};

export { index, single, store, update, destroy };
