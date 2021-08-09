import csv from "csvtojson";
import path from "path";

export const getProvinsi = async (req, res, next) => {
  const db_provinsi = path.resolve(__dirname, "./data/provinces.csv");

  try {
    const data = await csv().fromFile(db_provinsi);
    return res.json(data);
  } catch (err) {
    return res.json({
      error: 1,
      message: "Failed to get data, contact administrator",
    });
  }
};

export const getKabupaten = async (req, res, next) => {
  const db_kabupaten = path.resolve(__dirname, "./data/regencies.csv");

  try {
    const { kode_induk } = req.query;
    const data = await csv().fromFile(db_kabupaten);
    if (!kode_induk) return res.json(data);
    return res.json(
      data.filter((kabupaten) => kabupaten.kode_provinsi === kode_induk)
    );
  } catch (err) {
    return res.json({
      error: 1,
      message: "Failed to get data, contact administrator",
    });
  }
};

export const getKecamatan = async (req, res, next) => {
  const db_kecamatan = path.resolve(__dirname, "./data/districts.csv");

  try {
    const { kode_induk } = req.query;
    const data = await csv().fromFile(db_kecamatan);
    if (!kode_induk) return res.json(data);
    return res.json(
      data.filter((kecamatan) => kecamatan.kode_kabupaten === kode_induk)
    );
  } catch (err) {
    return res.json({
      error: 1,
      message: "Failed to get data, contact administrator",
    });
  }
};

export const getKelurahan = async (req, res, next) => {
  const db_kelurahan = path.resolve(__dirname, "./data/villages.csv");

  try {
    const { kode_induk } = req.query;
    const data = await csv().fromFile(db_kelurahan);
    if (!kode_induk) return res.json(data);
    return res.json(
      data.filter((kelurahan) => kelurahan.kode_kecamatan === kode_induk)
    );
  } catch (err) {
    return res.json({
      error: 1,
      message: "Failed to get data, contact administrator",
    });
  }
};
