import express from "express";
import multer from "multer";
import passport from "passport";
import PassportLocal from "passport-local";
import { register, localStrategy, login, me, logout } from "./controller";

const router = express.Router();
const LocalStrategy = PassportLocal.Strategy;

passport.use(new LocalStrategy({ usernameField: "email" }, localStrategy));

// router;
router.get("/me", me);
router.post("/register", multer().none(), register);
router.post("/login", multer().none(), login);
router.post("/logout", multer().none(), logout);

export default router;
