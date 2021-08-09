import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import passport from "passport";
import User from "../user/model";
import { envModule } from "../config";
import { getToken } from "../utils/get-token";

const register = async (req, res, next) => {
  try {
    const user = new User(req.body);
    await user.save();
    return res.json(user);
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

const localStrategy = async (email, password, done) => {
  try {
    const user = await User.findOne({ email }).select(
      "-__v -createdAt -updatedAt -cart_items -token"
    );

    if (!user) return done();

    if (bcrypt.compareSync(password, user.password)) {
      const { password, ...userWithoutPassword } = user.toJSON();
      return done(null, userWithoutPassword);
    }
  } catch (err) {
    done(err, null);
  }
  done();
};

const login = async (req, res, next) => {
  passport.authenticate("local", async (err, user) => {
    if (err) return next(err);

    if (!user) {
      return res.json({
        error: 1,
        message: "email or password incorrect",
      });
    }

    const signed = jwt.sign(user, envModule.secretKey);

    await User.findOneAndUpdate(
      { _id: user._id },
      { $push: { token: signed } },
      { new: true }
    );

    return res.json({
      message: "logged in successfully",
      user: user,
      token: signed,
    });
  })(req, res, next);
};

const me = (req, res, next) => {
  if (!req.user) {
    return res.json({
      error: 1,
      message: "You are not login or token expired",
    });
  }

  return res.json(req.user);
};

const logout = async (req, res, next) => {
  const token = getToken(req);

  const user = await User.findOneAndUpdate(
    { token: { $in: [token] } },
    { $pull: { token } },
    { useFindAndModify: false }
  );

  if (!token || !user) {
    return res.json({
      error: 1,
      message: "No user found",
    });
  }

  return res.json({
    error: 0,
    message: "logged out success",
  });
};

export { register, localStrategy, login, me, logout };
