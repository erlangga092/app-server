import express from "express";
import multer from "multer";
import os from "os";
import { index, single, store, update, destroy } from "./controller";

const router = express.Router();

// router
router.get("/products", index);
router.get("/products/:id", single);
router.post("/products", multer({ dest: os.tmpdir() }).single("image"), store);
router.put(
  "/products/:id",
  multer({ dest: os.tmpdir() }).single("image"),
  update
);
router.delete("/products/:id", destroy);

export default router;
