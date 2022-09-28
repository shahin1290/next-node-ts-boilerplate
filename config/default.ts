export default {
  isProduction: process.env.NODE_ENV! === "production",
  port: 4000,
  origin: "http://localhost:3000",
  dbUri: "mongodb://localhost:27017/ultimate-boilerplate",
  saltWorkFactor: 10,
  accessTokenTl: "15m",
  refreshTokenTl: "1y",
  accessTokenSecret:
    "5e2787d0bdee6a6901fd5a8ff71a5ba92117ccd68859d4a4509a6aa921c448864cc0b04b89d098257dba9fa206a42282e005cda83b7b2da6a1a8ec4476850f62",
  refreshTokenSecret:
    "c7524de3c2a7380618583d1fb196f6a698912727631f2cfa49063c3b2cf0e5b0aadd84775921e4afab8c69a1030127f92cc413cf6e4b308fde3f27b76ba21805",
};
