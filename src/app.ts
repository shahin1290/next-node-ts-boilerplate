import config from "config";
import express from "express";
import connect from "./utils/connect";
const port = config.get<string>("port");

const app = express();

app.use(express.json());

app.listen(port, async () => {
  console.info(`App is running at http://localhost: ${port}`);

  await connect();
});
