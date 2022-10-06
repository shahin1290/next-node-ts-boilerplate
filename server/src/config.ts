export const config = {
  port: process.env.PORT! || 5000,
  isProduction: process.env.NODE_ENV! === "production",
  clientUrl: process.env.CLIENT_URL!,
  baseDomain: process.env.BASE_DOMAIN!,

  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET!,
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET!,

  mongoURL: process.env.MONGODB_URL!,
};
