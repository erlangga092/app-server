import express from "express";
import {
  getProvinsi,
  getKabupaten,
  getKecamatan,
  getKelurahan,
} from "./controller";

const router = express.Router();

// router
router.get("/wilayah/provinsi", getProvinsi);
router.get("/wilayah/kabupaten", getKabupaten);
router.get("/wilayah/kecamatan", getKecamatan);
router.get("/wilayah/kelurahan", getKelurahan);

export default router;
