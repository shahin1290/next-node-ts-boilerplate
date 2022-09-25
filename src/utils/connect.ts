import config from "config";
import mongoose from "mongoose";

async function connect() {
  const dbUri = config.get<string>("dbUri");

  try {
    await mongoose.connect(dbUri);
    console.info("DB Connected");
  } catch (error) {
    console.error("Could not connect to db");
    process.exit(1);
  }
}

export default connect;
