import { config } from "../../config";
import mongoose from "mongoose";

const dbUri= "mongodb://localhost:27017/ultimate-boilerplate"

async function connect() {
  try {
    await mongoose.connect(dbUri);
    console.info("DB Connected");
  } catch (error) {
    console.error("Could not connect to db");
    process.exit(1);
  }
}

export default connect;
