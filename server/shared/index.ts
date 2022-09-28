export enum Cookies {
  AccessToken = "access",
  RefreshToken = "refresh",
}

export interface UserDocument {
  id: string;
  name: string;
  tokenVersion: number;
  gitHubUserId: string;
}

export interface TokenPayload {
  userId: string;
  name: string;
  email: string
}

export interface RefreshToken extends TokenPayload {
  exp: number;
}