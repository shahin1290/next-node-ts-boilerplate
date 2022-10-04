import mongoose from "mongoose";
import { config } from "../../config";

async function connect() {
  try {
    await mongoose.connect(config.mongoURL);
    console.info("DB Connected");
  } catch (error) {
    console.error("Could not connect to db");
    process.exit(1);
  }
}

export default connect;
