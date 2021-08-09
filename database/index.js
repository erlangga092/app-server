import mongoose from "mongoose";
import { envModule } from "../app/config";

const mongooseOptions = {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
};

mongoose.connect(
  `mongodb://${envModule.db_user}:${envModule.db_pass}@${envModule.db_host}:${envModule.db_port}/${envModule.db_name}?authSource=admin`,
  mongooseOptions
);

export const dbFoodStore = mongoose.connection;
