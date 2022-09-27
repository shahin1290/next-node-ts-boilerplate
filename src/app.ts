import config from "config";
import cookieParser from "cookie-parser";
import express from "express";
import deserializeUser from "./middleware/deserializeUser";
import routes from "./routes";
import connect from "./utils/connect";
const port = config.get<string>("port");

const app = express();
app.use(cookieParser());

app.use(express.json());
app.use(deserializeUser);

app.listen(port, async () => {
  console.info(`App is running at http://localhost: ${port}`);

  await connect();

  routes(app);
});
