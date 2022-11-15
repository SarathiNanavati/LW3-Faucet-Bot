import mongoose from "mongoose";
import { config } from "../../config/config";

const createConnectionURL = (): string => {
  const {
    mongoDbClusterName,
    mongoDbDatabaseName,
    mongoDbPassword,
    mongoDbQueryString,
    mongoDbUserName,
  } = config.database;
  return `mongodb+srv://${mongoDbUserName}:${mongoDbPassword}@${mongoDbClusterName}/${mongoDbDatabaseName}?${mongoDbQueryString}`;
};

const connectDB = async (): Promise<any> => {
  return mongoose.connect(createConnectionURL(), {
    // useNewUrlParser: true,
    // useCreateIndex: true,
    // useFindAndModify: false,
    // useUnifiedTopology: true,
  });
};

export default connectDB;
