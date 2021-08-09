import jwt from "jsonwebtoken";
import User from "../user/model";
import { getToken } from "../utils/get-token";
import { envModule } from "../config";

export function decodeToken() {
  return async (req, res, next) => {
    try {
      const token = getToken(req);
      if (!token) return next();

      req.user = jwt.verify(token, envModule.secretKey);

      const user = await User.findOne({ token: { $in: [token] } });
      if (!user) {
        return res.json({
          error: 1,
          message: "Token expired",
        });
      }
    } catch (err) {
      if (err && err.name === "JsonWebTokenError") {
        return res.json({
          error: 1,
          message: err.message,
        });
      }
      next(err);
    }
    return next();
  };
}
