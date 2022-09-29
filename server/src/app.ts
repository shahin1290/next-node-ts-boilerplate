import * as dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import routes from "./routes";
import connect from "./utils/connect";
import { config } from "../config";

const port = config.port;

const app = express();

app.use(
  cors({
    origin: config.clientUrl,
    credentials: true,
  })
);
app.use(cookieParser());

app.use(express.json());

app.listen(port, async () => {
  console.info(`App is running at http://localhost: ${port}`);

  await connect();

  routes(app);
});
