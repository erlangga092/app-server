import { subject } from "@casl/ability";
import DeliveryAddress from "./model";
import { policyFor } from "../policy";

const index = async (req, res, next) => {
  try {
    const policy = policyFor(req.user);

    if (!policy.can("view", "DeliveryAddress")) {
      return res.json({
        error: 1,
        message: "Not allowed to perform this action",
      });
    }

    const { limit = 10, skip = 0 } = req.query;
    const count = await DeliveryAddress.find({
      user: req.user._id,
    }).countDocuments();

    const deliveryAddress = await DeliveryAddress.find({
      user: req.user._id,
    })
      .limit(parseInt(limit, 10))
      .skip(parseInt(skip, 10))
      .sort("-createdAt");

    return res.json({ data: deliveryAddress, count: count });
  } catch (err) {
    next(err);
  }
};

const store = async (req, res, next) => {
  try {
    const policy = policyFor(req.user);

    if (!policy.can("create", "DeliveryAddress")) {
      return res.json({
        error: 1,
        message: "Not allowed to perform this action",
      });
    }

    const address = new DeliveryAddress({
      ...req.body,
      user: req.user._id,
    });
    await address.save();
    return res.json(address);
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
    const address = await DeliveryAddress.findOne({ _id: req.params.id });
    const subjectAddress = subject("DeliveryAddress", {
      ...address,
      user_id: address.user,
    });

    if (!policy.can("update", subjectAddress)) {
      return res.json({
        error: 1,
        message: "Not allowed to perform this action",
      });
    }

    address = await DeliveryAddress.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true }
    );
    return res.json(address);
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
    const address = await DeliveryAddress.findOne({ _id: req.params.id });
    const subjectAddress = subject("DeliveryAddress", {
      ...address,
      user_id: address.user,
    });

    if (!policy.can("delete", subjectAddress)) {
      return res.json({
        error: 1,
        message: "Not allowed to perform this action",
      });
    }

    await DeliveryAddress.findOneAndDelete({ _id: req.params.id });
    return res.json(address);
  } catch (err) {
    next(err);
  }
};

export { index, store, update, destroy };
